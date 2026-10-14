'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DURATION, EASE, FALLOFF, STAGGER } from './iso';

type El = { from: number; to: number; start: number; cur: number; d: number };

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Волна по кольцам от активного элемента (логика activate/kick из брендбука).
 * Возвращает текущие значения 0…1 для каждого элемента и функцию activate.
 * requestAnimationFrame крутится только пока что-то движется.
 */
export function useWave(count: number, distance: (a: number, b: number) => number) {
  const els = useRef<El[]>(Array.from({ length: count }, () => ({ from: 0, to: 0, start: 0, cur: 0, d: 0 })));
  const raf = useRef<number | null>(null);
  const [, setFrame] = useState(0);

  const kick = useCallback(() => {
    if (raf.current != null) return;
    const loop = () => {
      const now = performance.now();
      let moving = false;
      for (const e of els.current) {
        if (now < e.start) {
          moving = true;
          continue;
        }
        const p = Math.min(1, (now - e.start) / DURATION);
        e.cur = e.from + (e.to - e.from) * EASE(p);
        if (p < 1) moving = true;
      }
      setFrame((f) => (f + 1) % 1e6);
      raf.current = moving ? requestAnimationFrame(loop) : null;
    };
    raf.current = requestAnimationFrame(loop);
  }, []);

  /** Сила элемента j, когда активен idx (null — покой) */
  const level = useCallback(
    (idx: number | null, j: number) => {
      if (idx == null) return 0;
      const d = distance(idx, j);
      return d < FALLOFF.length ? FALLOFF[d] : 0;
    },
    [distance],
  );

  /** idx = null — курсор ушёл: всё возвращается в покой */
  const activate = useCallback(
    (idx: number | null) => {
      const now = performance.now();
      const red = reducedMotion();
      els.current.forEach((e, j) => {
        const d = idx == null ? null : distance(idx, j);
        const target = level(idx, j);
        const ring = d == null ? Math.min(e.d, 3) : Math.min(d, 3);
        if (d != null) e.d = d;
        if (target === e.to) return;
        e.from = e.cur;
        e.to = target;
        e.start = now + (red ? 0 : ring * STAGGER);
        // prefers-reduced-motion: сразу конечное состояние, без анимации
        if (red) {
          e.cur = target;
          e.from = target;
          e.start = now - DURATION;
        }
      });
      kick();
    },
    [distance, level, kick],
  );

  /**
   * Scrub (телефон): значения задаёт прокрутка. samples — положения волны, пройденные с прошлого кадра,
   * каждое — смесь состояний «активен a» и «активен b» с долей f; цель элемента — максимум по ним,
   * чтобы быстрая прокрутка не перескакивала верх. Подъём сразу, опускание — анимацией (кривая брендбука).
   */
  const scrub = useCallback(
    (samples: [a: number | null, b: number | null, f: number][]) => {
      const now = performance.now();
      els.current.forEach((e, j) => {
        let v = 0;
        for (const [a, b, f] of samples) v = Math.max(v, level(a, j) + (level(b, j) - level(a, j)) * f);
        if (v >= e.cur) {
          e.cur = e.from = e.to = v;
          e.start = 0;
        } else if (v !== e.to) {
          e.from = e.cur;
          e.to = v;
          e.start = now;
        }
      });
      setFrame((n) => (n + 1) % 1e6);
      kick();
    },
    [level, kick],
  );

  useEffect(
    () => () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
      raf.current = null;
    },
    [],
  );

  return { values: els.current.map((e) => e.cur), activate, scrub };
}
