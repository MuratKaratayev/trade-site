'use client';

import { usePathname } from 'next/navigation';
import { LOCALES, localePath, stripLocale, type Locale } from '@/lib/i18n';
import { LANG_SCROLL_BLOCKS, LANG_SCROLL_KEY } from '@/lib/lang-scroll';

export type LangLabels = { group: string } & Record<Locale, { short: string; full: string }>;

// Ключ выбора языка в localStorage. Пока его нет, язык выбирается по браузеру (скрипт в app/(ru)/layout.tsx).
export const LANG_KEY = 'lang';

// Место на странице при смене языка запоминаем не в пикселях, а блоком под шапкой и долей его высоты (см. lib/lang-scroll.ts)

function saveScroll(to: string) {
  // Открытое мобильное меню раздвигает шапку: закрываем, чтобы мерить от обычной шапки
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.hidden = true;
  const header = document.querySelector('header');
  const line = header ? header.getBoundingClientRect().bottom : 0;
  const blocks = document.querySelectorAll(LANG_SCROLL_BLOCKS);
  let i = -1;
  let r = 0;
  let d = 0;
  blocks.forEach((el, k) => {
    const b = el.getBoundingClientRect();
    if (b.height > 0 && b.top <= line) {
      i = k;
      r = Math.min(1, (line - b.top) / b.height);
      d = Math.max(0, line - b.bottom);
    }
  });
  if (window.scrollY < 1) return;
  try {
    sessionStorage.setItem(
      LANG_SCROLL_KEY,
      JSON.stringify({ to, i, n: blocks.length, r, d, f: window.scrollY / document.documentElement.scrollHeight, h: location.hash, t: Date.now() }),
    );
  } catch {}
}

/**
 * Переключатель языка: «РУС | ҚАЗ», текущий язык подсвечен. Ссылка ведёт на ту же страницу на другом языке
 * (с того же места страницы) и запоминает выбор. Обычная ссылка, а не next/link: у языков разные корневые
 * разметки (<html lang>), переход между ними — полная загрузка страницы.
 */
export function LangToggle({ locale, labels, className = '' }: { locale: Locale; labels: LangLabels; className?: string }) {
  const path = stripLocale(usePathname() || '/');
  return (
    <nav aria-label={labels.group} className={`inline-flex rounded border border-line p-[3px] ${className}`}>
      {LOCALES.map((l) => {
        const current = l === locale;
        const href = localePath(l, path);
        return (
          <a
            key={l}
            href={href}
            hrefLang={l}
            lang={l}
            aria-current={current ? 'true' : undefined}
            aria-label={labels[l].full}
            title={labels[l].full}
            onClick={(e) => {
              try {
                localStorage.setItem(LANG_KEY, l);
              } catch {}
              if (current) {
                e.preventDefault();
                return;
              }
              // Без #… в адресе: иначе браузер сначала прыгнет к разделу. Место восстановит скрипт на новой странице.
              saveScroll(href);
            }}
            className={`inline-flex h-10 min-w-11 items-center justify-center rounded-sm px-2 text-sm font-semibold tracking-[0.04em] transition-colors ${
              current ? 'bg-surface text-text' : 'text-muted hover:text-text'
            }`}
          >
            {labels[l].short}
          </a>
        );
      })}
    </nav>
  );
}
