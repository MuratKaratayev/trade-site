import type { NextConfig } from 'next';

// 301 со старых адресов trade-engeeniring.kz (MODX). Сработают, когда домен будет смотреть на Vercel.
const legacy: { source: string; destination: string }[] = [
  { source: '/o-kompanii', destination: '/#about' },
  { source: '/uslugi', destination: '/#services' },
  { source: '/nash-opyit', destination: '/#experience' },
  { source: '/kontaktyi', destination: '/#contacts' },
  { source: '/produkcziya', destination: '/#products' },
  { source: '/produkcziya/asutp,-komplektnyie-shkafyi-avtomatiki/:path*', destination: '/products/shkafy-avtomatiki' },
  { source: '/produkcziya/mikroproczessornyie-kontrolleryi/:path*', destination: '/products/kontrollery' },
  { source: '/produkcziya/kontrolno-izmeritelnyie-priboryi/:path*', destination: '/products/kip' },
  { source: '/produkcziya/sredstva-avtomatizaczii/:path*', destination: '/products/sredstva-avtomatizacii' },
  // Пятая категория старого сайта — в новом каталоге её нет, ведём в общий раздел
  { source: '/produkcziya/analiticheskie-priboryi-zhidkix-sredstv/:path*', destination: '/#products' },
];

const nextConfig: NextConfig = {
  // Встроенная нормализация слэша дала бы цепочку 308 → 301 для старых адресов вида /uslugi/.
  // Отключаем её и делаем то же правилом ниже, после старых адресов.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      ...legacy.flatMap((r) => [
        { ...r, statusCode: 301 as const },
        // Старый сайт отдавал адреса и со слэшем на конце
        { source: r.source.includes(':path*') ? r.source.replace('/:path*', '/:path*/') : `${r.source}/`, destination: r.destination, statusCode: 301 as const },
      ]),
      // Общая нормализация: /path/ → /path
      { source: '/:path+/', destination: '/:path+', statusCode: 308 as const },
    ];
  },
};

export default nextConfig;
