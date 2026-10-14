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

// Заголовки безопасности. CSP допускает inline-скрипты: Next.js и скрипт темы встраивают их в HTML,
// а nonce сделал бы все страницы динамическими. vercel.live — тулбар комментариев на превью Vercel.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://vercel.live https://vercel.com",
  "font-src 'self' https://vercel.live",
  "connect-src 'self' https://vercel.live wss://ws-us3.pusher.com",
  "frame-src https://vercel.live",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
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
