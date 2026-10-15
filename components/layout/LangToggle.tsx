'use client';

import { usePathname } from 'next/navigation';
import { LOCALES, localePath, stripLocale, type Locale } from '@/lib/i18n';

export type LangLabels = { group: string } & Record<Locale, { short: string; full: string }>;

// Ключ выбора языка в localStorage. Пока его нет, язык выбирается по браузеру (скрипт в app/(ru)/layout.tsx).
export const LANG_KEY = 'lang';

/**
 * Переключатель языка: «РУС | ҚАЗ», текущий язык подсвечен. Ссылка ведёт на ту же страницу на другом языке
 * (раздел #… сохраняется) и запоминает выбор. Обычная ссылка, а не next/link: у языков разные корневые
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
              // Сохраняем раздел страницы, в котором находится посетитель
              e.currentTarget.href = href + window.location.hash;
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
