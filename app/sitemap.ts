import type { MetadataRoute } from 'next';
import { company, visibleProducts as products } from '@/content/site';

// Статическая сборка (output: 'export'): файл генерируется один раз при сборке
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: company.url, changeFrequency: 'monthly', priority: 1 },
    { url: `${company.url}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    ...products.map((p) => ({ url: `${company.url}/products/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
