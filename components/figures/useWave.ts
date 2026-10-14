'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FALLOFF, STAGGER } from './iso';

// cur/vel — положение и скорость; to — цель; next/at — отложенная цель (задержка кольца или удержание);
// hold — до какого момента элемент не опускается; d — последнее кольцо (для задержки при уходе курсора)
type El = { cur: number; vel: number; to: number; next: number | null; at: number; hold: number; d: number };

const SCRUB_RISE = 60; // мс, постоянная времени подъёма в scrub-режиме
const SCRUB_FALL = 200; // мс, опускания
// Курсор: критически затухающая пружина — смена цели сохраняет скорость, поэтому без толчков и перелёта.
// W = 13 1/с: 90% пути за ~0,3 с, покой за ~0,5 с (по длительности брендбука, 600 мс).
const W = 13;
const HOLD = 350; // мс: элемент под курсором не опускается раньше — успевает подняться при быстром проходе

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Волна по кольцам от активного элемента (логика activate из брендбука: сила по кольцам FALLOFF,
 * задержка STAGGER на кольцо). Возвращает текущие значения 0…1 для каждого элемента, activate и scrub.
 * requestAnimationFrame крутится только пока что-то движется.
 */
export function useWave(count: number, distance: (a: number, b: number) => number) {
  const els = useRef<El[]>(
    Array.from({ length: count }, () => ({ cur: 0, vel: 0, to: 0, next: null, at: 0, hold: 0, d: 0 })),
  );
  const raf = useRef<number | null>(null);
  const [, setFrame] = useState(0);

  const kick = useCallback(() => {
    if (raf.current != null) return;
    let last = performance.now();
    const loop = () => {
      const now = performance.now();
      const dt = Math.min(32, now - last) / 1000;
      last = now;
      let moving = false;
      for (const e of els.current) {
        if (e.next != null && now >= e.at) {
          e.to = e.next;
          e.next = null;
          if (e.to === FALLOFF[0]) e.hold = now + HOLD;
        }
        e.vel += (W * W * (e.to - e.cur) - 2 * W * e.vel) * dt;
        e.cur += e.vel * dt;
        if (e.next != null || Math.abs(e.to - e.cur) > 0.001 || Math.abs(e.vel) > 0.01) moving = true;
        else {
          e.cur = e.to;
          e.vel = 0;
        }
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
        // prefers-reduced-motion: сразу конечное состояние, без анимации
        if (red) {
          e.cur = e.to = target;
          e.vel = 0;
          e.next = null;
          return;
        }
        if (target === (e.next ?? e.to)) return;
        e.next = target;
        e.at = Math.max(now + ring * STAGGER, target < e.to ? e.hold : 0);
      });
      if (red) setFrame((f) => (f + 1) % 1e6);
      else kick();
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
