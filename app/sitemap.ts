import type { MetadataRoute } from 'next';
import { company, visibleProducts } from '@/content/site';
import { localePath } from '@/lib/i18n';

// Статическая сборка (output: 'export'): файл генерируется один раз при сборке
export const dynamic = 'force-static';

// Каждая страница — на двух языках, с взаимными ссылками hreflang
const PATHS: { path: string; changeFrequency: 'monthly' | 'yearly'; priority: number }[] = [
  { path: '/', changeFrequency: 'monthly', priority: 1 },
  ...visibleProducts.map((p) => ({ path: `/products/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (locale: 'ru' | 'kk', path: string) => company.url + (localePath(locale, path) === '/' ? '' : localePath(locale, path));
  return PATHS.flatMap(({ path, changeFrequency, priority }) => {
    const languages = { ru: url('ru', path), kk: url('kk', path) };
    return [
      { url: languages.ru, changeFrequency, priority, alternates: { languages } },
      { url: languages.kk, changeFrequency, priority, alternates: { languages } },
    ];
  });
}
