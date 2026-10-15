import { getUI } from '@/content/ui';
import { localePath, type Locale } from '@/lib/i18n';

export function NotFoundView({ locale }: { locale: Locale }) {
  const t = getUI(locale).notFound;
  return (
    <section className="section">
      <div className="container-site flex flex-col items-start gap-6">
        <span className="t-label">{t.label}</span>
        <h1 className="t-display">{t.title}</h1>
        <p className="t-body-l text-muted">{t.text}</p>
        <a href={localePath(locale, '/')} className="btn btn-primary">
          {t.home}
        </a>
      </div>
    </section>
  );
}
