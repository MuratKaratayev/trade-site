import type { Metadata, Viewport } from 'next';
import { Onest, Unbounded } from 'next/font/google';
import { company, nav } from '@/content/site';
import { ogBase, twitterBase } from '@/lib/seo';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const unbounded = Unbounded({ subsets: ['cyrillic', 'latin'], weight: ['500', '600'], display: 'swap', variable: '--font-unbounded' });
const onest = Onest({ subsets: ['cyrillic', 'latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-onest' });

const title = 'TRADE-Инжиниринг — АСУТП, оборудование, инжиниринг';
const description =
  'Проектирование, поставка и внедрение систем управления технологическими процессами для теплоэнергетики, металлургии и нефтехимии Казахстана. Павлодар.';

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: { default: title, template: '%s — TRADE-Инжиниринг' },
  description,
  openGraph: { ...ogBase, title, description, url: '/' },
  twitter: { ...twitterBase, title, description },
  alternates: { canonical: '/' },
};

// Цвет панели браузера: один мета-тег, скрипт темы подставляет цвет выбранной темы (а не темы ОС).
export const viewport: Viewport = { themeColor: '#14171A' };

// Тема до первой отрисовки (без мигания). Режим: сохранённый 'light' | 'dark', иначе «как в системе».
// data-theme — фактическая тема (на неё завязаны токены), data-theme-mode — выбранный режим.
// window.__themeColor синхронизирует <meta name="theme-color"> (значения = --bg из globals.css).
const themeScript = `(function(){var d=document.documentElement,m,t;try{m=localStorage.getItem('theme')}catch(e){}if(m!=='light'&&m!=='dark')m='system';t=m==='system'?(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):m;d.setAttribute('data-theme',t);d.setAttribute('data-theme-mode',m);window.__themeColor=function(){var c=d.getAttribute('data-theme')==='light'?'#FFFFFF':'#14171A';document.querySelectorAll('meta[name="theme-color"]').forEach(function(e){e.setAttribute('content',c)})};document.addEventListener('DOMContentLoaded',window.__themeColor)})()`;

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.legalName,
  url: company.url,
  email: company.email,
  telephone: company.telephone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.streetAddress,
    addressLocality: company.locality,
    addressCountry: company.country,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="dark" data-theme-mode="system" suppressHydrationWarning className={`${unbounded.variable} ${onest.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-3 focus:text-on-accent">
          Перейти к содержимому
        </a>
        <Header nav={nav} phone={company.phones[0]} email={company.email} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
