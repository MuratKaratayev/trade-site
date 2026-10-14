'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Мобильный режим фигур (устройства без hover): волной управляет прокрутка, а не касание.
 * Scrub: положение волны задаёт сама прокрутка (с таймером на обычной скорости элементы не успевали подняться).
 * Волна проходит шаги pick(0) … pick(steps − 1), пока фигура видна хотя бы на VISIBLE (снизу и сверху);
 * на входе и выходе — покой. Волна широкая: элемент на 100% в пределах PLATEAU шага, дальше плавно гаснет
 * к REACH — так элементы держатся наверху дольше и движение не дёргается. Значения сглаживает useWave.scrub.
 * prefers-reduced-motion → фигура статична. На десктопе (hover: hover) хук ничего не делает — там курсор.
 */
const VISIBLE = 0.7; // волна идёт, пока на экране (под шапкой) не меньше этой доли фигуры
const PLATEAU = 0.5; // в шагах волны: ближе — элемент на 100%
const REACH = 2; // в шагах волны: дальше — элемент в покое

export function isTouchOnly() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
}

// Постоянная ссылка: pick — зависимость эффекта, новая функция на каждый рендер пересоздавала бы его
const byIndex = (k: number) => k;

export function useScrollWave(
  ref: RefObject<Element | null>,
  wave: { steps: number; count: number; distance: (a: number, b: number) => number },
  scrub: (targets: number[]) => void,
  pick: (step: number) => number = byIndex,
) {
  const { steps, count, distance } = wave;
  useEffect(() => {
    const el = ref.current;
    if (!el || !isTouchOnly()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Расстояние (в шагах волны) от элемента j до волны в шаге k; за пределами шагов — плюс выход за край
    const dAt = (k: number, j: number) => {
      const kk = Math.min(steps - 1, Math.max(0, k));
      return distance(pick(kk), j) + Math.abs(k - kk);
    };
    const level = (c: number, j: number) => {
      const k = Math.floor(c);
      const d = dAt(k, j) + (dAt(k + 1, j) - dAt(k, j)) * (c - k);
      const x = Math.min(1, Math.max(0, (d - PLATEAU) / (REACH - PLATEAU)));
      return 1 - x * x * (3 - 2 * x); // smoothstep
    };

    let raf = 0;
    let prev = NaN; // положение волны в прошлом кадре

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const top = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
      // p = 0 — фигура вошла снизу на VISIBLE, p = 1 — ушла под шапку так, что видно VISIBLE
      const cy = r.top + r.height / 2;
      let from = vh - (VISIBLE - 0.5) * r.height;
      let to = top + (VISIBLE - 0.5) * r.height;
      if (from - to < (vh - top) / 2) {
        // фигура почти с экран — середина фигуры проходит средние 70% видимой области
        from = vh - 0.15 * (vh - top);
        to = top + 0.15 * (vh - top);
      }
      const p = (from - cy) / (from - to);
      // c ∈ [−REACH, steps − 1 + REACH]: на краях все элементы в покое
      const c = Math.min(steps - 1 + REACH, Math.max(-REACH, -REACH + p * (steps - 1 + 2 * REACH)));
      if (c === prev) return;
      // Весь отрезок, пройденный с прошлого кадра, с шагом ≤ 0,1 шага волны — чтобы не перескочить пик
      const c0 = Number.isNaN(prev) ? c : prev;
      const n = Math.ceil(Math.abs(c - c0) / 0.1);
      const targets = Array.from({ length: count }, (_, j) => {
        let v = level(c, j);
        for (let i = 0; i < n; i++) v = Math.max(v, level(c0 + ((c - c0) * i) / n, j));
        return v;
      });
      prev = c;
      scrub(targets);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Слушаем прокрутку только пока фигура рядом с экраном
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      } else {
        window.removeEventListener('scroll', onScroll);
        prev = NaN;
        scrub(Array(count).fill(0));
      }
    });
    io.observe(el);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, steps, count, distance, scrub, pick]);
}
