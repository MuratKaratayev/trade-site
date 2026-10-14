import { company } from '@/content/site';

// Next.js не сливает вложенные объекты metadata: openGraph страницы заменяет корневой целиком.
// Поэтому общие поля собраны здесь и подмешиваются на каждой странице.
const ogImage = { url: '/og.png', width: 1200, height: 630, alt: 'TRADE-Инжиниринг — АСУТП, оборудование, инжиниринг. Павлодар.' };

export const ogBase = {
  type: 'website' as const,
  locale: 'ru_RU',
  siteName: company.legalName,
  images: [ogImage],
};

export const twitterBase = { card: 'summary_large_image' as const, images: [ogImage] };
