'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Мобильный режим фигур (устройства без hover): волной управляет прокрутка, а не касание.
 * Пока фигура проходит через экран, активный элемент «едет» по ней (pickIndex(t), t ∈ [0, 1)).
 * У краёв экрана (вход и выход) — покой. Срабатывает только после первой прокрутки,
 * чтобы при загрузке ничего не двигалось само. prefers-reduced-motion → фигура статична.
 * На десктопе (hover: hover) хук ничего не делает — там управляет курсор.
 */
const EDGE = 0.15; // доля пути у входа и у выхода, где фигура в покое

export function isTouchOnly() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
}

export function useScrollWave(
  ref: RefObject<Element | null>,
  pickIndex: (t: number) => number,
  activate: (index: number | null) => void,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !isTouchOnly()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let scrolled = false;
    let visible = false;
    let raf = 0;
    let last: number | null = null;

    const update = () => {
      raf = 0;
      if (!scrolled || !visible) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // p: 0 — верх фигуры у нижнего края экрана, 1 — низ фигуры у верхнего края
      const p = (vh - r.top) / (vh + r.height);
      const t = (p - EDGE) / (1 - 2 * EDGE);
      const idx = t < 0 || t >= 1 ? null : pickIndex(t);
      if (idx !== last) {
        last = idx;
        activate(idx);
      }
    };
    const onScroll = () => {
      scrolled = true;
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Слушаем прокрутку только пока фигура рядом с экраном
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      } else {
        window.removeEventListener('scroll', onScroll);
        if (last !== null) {
          last = null;
          activate(null);
        }
      }
    });
    io.observe(el);
    // Первую прокрутку отмечаем глобально: фигура может быть на экране с самого начала (первый экран)
    const markScrolled = () => {
      scrolled = true;
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', markScrolled, { passive: true, once: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', markScrolled);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, pickIndex, activate]);
}
