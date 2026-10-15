import type { Metadata } from 'next';
import { company } from '@/content/site';
import { getUI } from '@/content/ui';
import { LOCALES, OG_LOCALE, localePath, type Locale } from '@/lib/i18n';

// Next.js не сливает вложенные объекты metadata: openGraph страницы заменяет корневой целиком.
// Поэтому общие поля собраны здесь и подмешиваются на каждой странице.
export function seoBase(locale: Locale) {
  const ogImage = { url: '/og.png', width: 1200, height: 630, alt: getUI(locale).meta.ogAlt };
  return {
    ogBase: {
      type: 'website' as const,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      siteName: company.name,
      images: [ogImage],
    },
    twitterBase: { card: 'summary_large_image' as const, images: [ogImage] },
  };
}

/** canonical + hreflang для страницы: path — адрес без языкового префикса ('/', '/products/kip'). */
export function alternates(locale: Locale, path: string): Metadata['alternates'] {
  return {
    canonical: localePath(locale, path),
    languages: { ru: localePath('ru', path), kk: localePath('kk', path), 'x-default': localePath('ru', path) },
  };
}

/** Полный набор метаданных страницы на нужном языке. */
export function pageMetadata(locale: Locale, path: string, title: string | undefined, description: string): Metadata {
  const { ogBase, twitterBase } = seoBase(locale);
  const ogTitle = title ?? getUI(locale).meta.title;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: alternates(locale, path),
    openGraph: { ...ogBase, title: ogTitle, description, url: localePath(locale, path) },
    twitter: { ...twitterBase, title: ogTitle, description },
  };
}
