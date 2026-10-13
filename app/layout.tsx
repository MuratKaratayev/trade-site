import type { Metadata, Viewport } from 'next';
import { Onest, Unbounded } from 'next/font/google';
import { company } from '@/content/site';
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
  openGraph: { type: 'website', locale: 'ru_RU', siteName: company.legalName, title, description, url: '/' },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#14171A' },
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
  ],
};

// Тема до первой отрисовки: сохранённый выбор → prefers-color-scheme → тёмная.
const themeScript = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem('theme')}catch(e){}if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}d.setAttribute('data-theme',t)})()`;

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.legalName,
  url: company.url,
  email: company.email,
  telephone: '+7 7182 62 40 90',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. Сталеваров, 18',
    addressLocality: 'Павлодар',
    addressCountry: 'KZ',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="dark" suppressHydrationWarning className={`${unbounded.variable} ${onest.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-3 focus:text-on-accent">
          Перейти к содержимому
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
