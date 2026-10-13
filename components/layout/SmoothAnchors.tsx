'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { EASE } from '@/components/figures/iso';

/**
 * Плавная прокрутка к якорям (#about, /#products …) — медленнее встроенной в браузер,
 * с фирменной кривой брендбука. Со страницы продукции ссылка «/#раздел» открывает главную
 * без перезагрузки и затем плавно доезжает до раздела. prefers-reduced-motion — без анимации.
 */
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let raf = 0;
function cancelScroll() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
}

function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  const el = id ? document.getElementById(id) : null;
  if (!el) return;
  const header = document.querySelector('header');
  const offset = header ? header.getBoundingClientRect().height : 0;
  const from = window.scrollY;
  const to = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
  const focusTarget = () => {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
  cancelScroll();
  if (reduced() || Math.abs(to - from) < 2) {
    window.scrollTo({ top: to, behavior: 'instant' });
    focusTarget();
    return;
  }
  // Длительность растёт с расстоянием: 0,9–1,6 с
  const duration = Math.min(1600, Math.max(900, 500 + Math.abs(to - from) * 0.4));
  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    window.scrollTo({ top: from + (to - from) * EASE(p), behavior: 'instant' });
    if (p < 1) raf = requestAnimationFrame(step);
    else {
      raf = 0;
      focusTarget();
    }
  };
  raf = requestAnimationFrame(step);
}

export function SmoothAnchors() {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
      if (!a || a.target === '_blank') return;
      const href = a.getAttribute('href') ?? '';
      const m = href.match(/^(\/[^#]*)?(#.+)$/);
      if (!m) return;
      const path = m[1] || window.location.pathname;
      const hash = m[2];
      e.preventDefault();
      if (path === window.location.pathname) {
        window.history.pushState(null, '', hash);
        // Кадр на закрытие мобильного меню: высота шапки должна успеть измениться
        requestAnimationFrame(() => scrollToHash(hash));
      } else {
        pending.current = hash;
        router.push(`${path}${hash}`, { scroll: false });
      }
    };
    // Пользователь сам крутит колесо или палец — не воюем с ним
    const interrupt = () => cancelScroll();
    document.addEventListener('click', onClick);
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchstart', interrupt);
    };
  }, [router]);

  // После перехода на другую страницу с якорем: начинаем сверху и плавно едем к разделу
  useEffect(() => {
    const hash = pending.current;
    if (!hash) return;
    pending.current = null;
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Ждём конца анимации появления страницы (сдвиг translateY исказил бы расчёт цели)
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      scrollToHash(hash);
    };
    const wrap = document.querySelector('.page-enter');
    wrap?.addEventListener('animationend', go, { once: true });
    const t = window.setTimeout(go, wrap ? 900 : 250);
    return () => {
      window.clearTimeout(t);
      wrap?.removeEventListener('animationend', go);
    };
  }, [pathname]);

  return null;
}
