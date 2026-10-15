import type { NextConfig } from 'next';

// Сайт собирается в статические файлы (папка out/) для хостинга PS Cloud (Plesk: Apache + nginx, без Node.js).
// Редиректы со старых адресов MODX и заголовки безопасности — в public/.htaccess (Next их в статике не применяет).
// Картинки не оптимизируются на лету (нет сервера): в public/ лежат уже сжатые webp.
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  poweredByHeader: false,
  // У русской и казахской версий разные корневые разметки (<html lang>) → общая 404 — app/global-not-found.tsx
  experimental: { globalNotFound: true },
};

export default nextConfig;
