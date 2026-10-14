'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DURATION, EASE, FALLOFF, STAGGER } from './iso';

type El = { from: number; to: number; start: number; cur: number; d: number };

const SCRUB_RISE = 60; // мс, постоянная времени подъёма в scrub-режиме
const SCRUB_FALL = 200; // мс, опускания

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

  /** idx = null — курсор ушёл: всё возвращается в покой */
  const activate = useCallback(
    (idx: number | null) => {
      const now = performance.now();
      const red = reducedMotion();
      els.current.forEach((e, j) => {
        const d = idx == null ? null : distance(idx, j);
        const target = d != null && d < FALLOFF.length ? FALLOFF[d] : 0;
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
    [distance, kick],
  );

  /**
   * Scrub (телефон): цели 0…1 для каждого элемента задаёт прокрутка (useScrollWave), значения догоняют их
   * с короткой инерцией — подъём быстрее, опускание мягче. Без неё волна дёргается вслед за кадрами прокрутки.
   * Если за кадр пришло несколько целей, берётся максимум — пик не теряется.
   */
  const targets = useRef<number[] | null>(null);
  const fresh = useRef(false);
  const sraf = useRef<number | null>(null);
  const scrub = useCallback((next: number[]) => {
    const prev = targets.current;
    targets.current = fresh.current && prev ? next.map((v, j) => Math.max(v, prev[j])) : next;
    fresh.current = true;
    if (sraf.current != null) return;
    let last = performance.now();
    const loop = () => {
      const now = performance.now();
      const dt = Math.min(64, now - last);
      last = now;
      fresh.current = false;
      const tg = targets.current ?? [];
      let moving = false;
      els.current.forEach((e, j) => {
        const diff = (tg[j] ?? 0) - e.cur;
        if (Math.abs(diff) < 0.002) {
          e.cur = tg[j] ?? 0;
          return;
        }
        e.cur += diff * (1 - Math.exp(-dt / (diff > 0 ? SCRUB_RISE : SCRUB_FALL)));
        moving = true;
      });
      setFrame((n) => (n + 1) % 1e6);
      sraf.current = moving ? requestAnimationFrame(loop) : null;
    };
    sraf.current = requestAnimationFrame(loop);
  }, []);

  useEffect(
    () => () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
      if (sraf.current != null) cancelAnimationFrame(sraf.current);
      raf.current = sraf.current = null;
    },
    [],
  );

  return { values: els.current.map((e) => e.cur), activate, scrub };
}
