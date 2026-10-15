import './globals.css';
import type { Metadata } from 'next';
import { fontVars } from '@/lib/fonts';
import { themeScript } from '@/components/site/SiteLayout';

// Страница 404 для адресов, которых нет на сайте (у языков разные корневые разметки, поэтому общая 404 — отдельная).
// Язык адреса на сервере неизвестен (статика), поэтому текст на двух языках. На хостинге её отдаёт .htaccess (404.html).
export const metadata: Metadata = {
  title: 'Страница не найдена · Бет табылмады — TRADE-Инжиниринг',
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="ru" data-theme="dark" data-theme-mode="system" suppressHydrationWarning className={fontVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <main className="section">
          <div className="container-site flex flex-col items-start gap-10">
            <a href="/" className="inline-flex shrink-0 rounded px-[10px] py-[8px]" style={{ background: 'var(--logo-plate)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="TRADE-Инжиниринг" width={240} height={26} />
            </a>
            <span className="t-label">404</span>
            <div className="flex flex-col gap-4">
              <h1 className="t-display">Страница не найдена</h1>
              <p className="t-body-l text-muted">Возможно, адрес изменился после обновления сайта.</p>
              <a href="/" className="btn btn-primary self-start">
                На главную
              </a>
            </div>
            <div lang="kk" className="flex flex-col gap-4 border-t border-line pt-10">
              <h2 className="t-h2">Бет табылмады</h2>
              <p className="t-body-l text-muted">Сайт жаңартылғаннан кейін мекенжай өзгерген болуы мүмкін.</p>
              <a href="/kk" className="btn btn-secondary self-start">
                Басты бетке
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
