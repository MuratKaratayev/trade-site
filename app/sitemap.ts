import type { MetadataRoute } from 'next';
import { company, products } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: company.url, changeFrequency: 'monthly', priority: 1 },
    { url: `${company.url}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    ...products.map((p) => ({ url: `${company.url}/products/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
