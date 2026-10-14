'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Мобильный режим фигур (устройства без hover): волной управляет прокрутка, а не касание.
 * Пока фигура видна целиком (между шапкой и нижним краем экрана), активный элемент «едет» по ней
 * (pickIndex(t), t ∈ [0, 1)). Пока фигура входит в экран или уходит за него — покой. Срабатывает только после первой прокрутки,
 * чтобы при загрузке ничего не двигалось само. prefers-reduced-motion → фигура статична.
 * На десктопе (hover: hover) хук ничего не делает — там управляет курсор.
 */
const SETTLE = 0.75; // волна занимает 75% пути «видна целиком», последняя четверть — на возврат в покой (1 с)
const EDGE = 0.15; // запасной режим (фигура выше экрана): доля пути у входа и у выхода, где фигура в покое

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
      const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0;
      // Волна идёт, пока фигура видна целиком: t = 0 — низ фигуры поднялся над нижним краем экрана,
      // t = 1 — пройдено SETTLE этого пути (остаток — чтобы фигура успокоилась на виду, а не под шапкой). Фигура выше видимой области → по центру, в средних 70% экрана.
      const from = vh - r.height;
      const t =
        from - headerBottom > 40
          ? (from - r.top) / ((from - headerBottom) * SETTLE)
          : ((vh - r.top - r.height / 2) / (vh - headerBottom) - EDGE) / (1 - 2 * EDGE);
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
