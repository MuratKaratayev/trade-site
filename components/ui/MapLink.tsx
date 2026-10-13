'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * Ссылка на адрес, открывающая карты по умолчанию на устройстве посетителя:
 * - iPhone / iPad / Mac → Apple Maps (maps.apple.com открывает приложение «Карты»);
 * - Android → geo:-URI (система предлагает приложение карт по умолчанию);
 * - остальное (Windows, Linux) → Google Maps в браузере.
 * На сервере и без JS — ссылка на Google Maps, она работает везде.
 */
export function MapLink({ query, children, className = '' }: { query: string; children: ReactNode; className?: string }) {
  const q = encodeURIComponent(query);
  const web = `https://www.google.com/maps/search/?api=1&query=${q}`;
  const [href, setHref] = useState(web);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    if (/iPhone|iPad|iPod|Macintosh/.test(ua) || isIPadOS) setHref(`https://maps.apple.com/?q=${q}`);
    else if (/Android/.test(ua)) setHref(`geo:0,0?q=${q}`);
  }, [q]);

  const external = href.startsWith('http');
  return (
    <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
      <span className="sr-only"> (открыть на карте)</span>
    </a>
  );
}
