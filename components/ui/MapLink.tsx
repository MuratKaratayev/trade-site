'use client';

import { useEffect, useState, type ReactNode } from 'react';

/**
 * Ссылка на адрес, открывающая карты по умолчанию на устройстве посетителя:
 * - iPhone / iPad → Apple Maps (maps.apple.com открывает приложение «Карты» из любого браузера);
 * - Mac в Safari → Apple Maps; Mac в Chrome/Firefox → Google Maps (там maps.apple.com откроется лишь веб-версией);
 * - Android → geo:-URI (система предлагает приложение карт по умолчанию);
 * - остальное (Windows, Linux) → Google Maps в браузере.
 * На сервере и без JS — ссылка на Google Maps, она работает везде.
 */
export function MapLink({ query, children, className = '', srLabel = ' (открыть на карте)' }: { query: string; children: ReactNode; className?: string; srLabel?: string }) {
  const q = encodeURIComponent(query);
  const web = `https://www.google.com/maps/search/?api=1&query=${q}`;
  const [href, setHref] = useState(web);

  useEffect(() => {
    const ua = navigator.userAgent;
    // iPadOS представляется как Mac, отличаем по сенсорному экрану
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const isMacSafari = /Macintosh/.test(ua) && /Safari\//.test(ua) && !/Chrome|Chromium|CriOS|Edg|Firefox|FxiOS|OPR/.test(ua);
    if (isIOS || isMacSafari) setHref(`https://maps.apple.com/?q=${q}`);
    else if (/Android/.test(ua)) setHref(`geo:0,0?q=${q}`);
  }, [q]);

  const external = href.startsWith('http');
  return (
    <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
      <span className="sr-only">{srLabel}</span>
    </a>
  );
}
