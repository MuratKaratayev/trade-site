import type { MetadataRoute } from 'next';
import { company } from '@/content/site';

// Статическая сборка (output: 'export'): файл генерируется один раз при сборке
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${company.url}/sitemap.xml` };
}
