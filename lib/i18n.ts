// Языки сайта. Русский — основной, по прежним адресам (/, /products/kip); казахский — с префиксом /kk.
export const LOCALES = ['ru', 'kk'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ru';

/** Адрес страницы на нужном языке: localePath('kk', '/products/kip') → '/kk/products/kip', '/#about' → '/kk#about'. */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === '/') return `/${locale}`;
  if (path.startsWith('/#')) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}

/** Адрес страницы без языкового префикса: '/kk/products/kip' → '/products/kip', '/kk' → '/'. */
export function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/kk(?=\/|$)(.*)$/);
  return m ? m[1] || '/' : pathname;
}

export const OG_LOCALE: Record<Locale, string> = { ru: 'ru_RU', kk: 'kk_KZ' };
export const HTML_LANG: Record<Locale, string> = { ru: 'ru', kk: 'kk' };
