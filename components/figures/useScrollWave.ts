'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Мобильный режим фигур (устройства без hover): волной управляет прокрутка, а не касание.
 * Scrub: положение волны задаёт сама прокрутка, без таймера. Поэтому каждый элемент доходит до конца
 * при любой скорости листания (с таймером на обычной скорости элементы не успевали подняться).
 * Волна проходит шаги pick(0) … pick(steps − 1), пока фигура видна целиком (между шапкой и нижним
 * краем экрана); на входе и выходе — покой. prefers-reduced-motion → фигура статична.
 * На десктопе (hover: hover) хук ничего не делает — там управляет курсор.
 */
const EDGE = 0.15; // запасной режим (фигура выше экрана): доля пути у входа и у выхода, где фигура в покое
const HOLD = 0.3; // доля отрезка каждого шага, где элемент стоит на 100%

export function isTouchOnly() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
}

// Постоянная ссылка: pick — зависимость эффекта, новая функция на каждый рендер пересоздавала бы его
const byIndex = (k: number) => k;

export type Scrub = (samples: [a: number | null, b: number | null, f: number][]) => void;

export function useScrollWave(
  ref: RefObject<Element | null>,
  steps: number,
  scrub: Scrub,
  pick: (step: number) => number = byIndex,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !isTouchOnly()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let prev = NaN; // положение волны в прошлом кадре

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
      // p = 0 — низ фигуры поднялся над нижним краем экрана, p = 1 — верх фигуры дошёл до шапки.
      // Фигура выше видимой области → по центру, в средних 70% экрана.
      const from = vh - r.height;
      const p =
        from - headerBottom > 40
          ? (from - r.top) / (from - headerBottom)
          : ((vh - r.top - r.height / 2) / (vh - headerBottom) - EDGE) / (1 - 2 * EDGE);
      // c ∈ [−1, steps]: на краях все элементы в покое, между целыми — переход к следующему шагу
      const c = Math.min(steps, Math.max(-1, p * (steps + 1) - 1));
      if (c === prev) return;
      const at = (s: number) => (s >= 0 && s < steps ? pick(s) : null);
      const sample = (c: number): [number | null, number | null, number] => {
        const k = Math.floor(c);
        const x = Math.min(1, Math.max(0, (c - k - HOLD / 2) / (1 - HOLD)));
        return [at(k), at(k + 1), x * x * (3 - 2 * x)]; // smoothstep
      };
      // Весь отрезок, пройденный с прошлого кадра, с шагом ≤ 0,1 шага волны
      const from0 = Number.isNaN(prev) ? c : prev;
      const n = Math.ceil(Math.abs(c - from0) / 0.1);
      const samples = [sample(c)];
      for (let i = 0; i < n; i++) samples.push(sample(from0 + ((c - from0) * i) / n));
      prev = c;
      scrub(samples);
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
        scrub([[null, null, 0]]);
      }
    });
    io.observe(el);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, steps, scrub, pick]);
}
