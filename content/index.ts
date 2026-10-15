import * as ru from './site';
import * as kk from './site.kk';
import type { Locale } from '@/lib/i18n';

// Контент страницы на нужном языке. Структура обеих версий одинаковая (site.kk.ts собирается из site.ts).
export function getContent(locale: Locale) {
  return locale === 'kk' ? kk : ru;
}
export type SiteContent = ReturnType<typeof getContent>;
