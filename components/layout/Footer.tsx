import { getContent } from '@/content';
import { getUI } from '@/content/ui';
import { localePath, type Locale } from '@/lib/i18n';
import { MapLink } from '@/components/ui/MapLink';
import { CurrentYear } from '@/components/ui/CurrentYear';

export function Footer({ locale }: { locale: Locale }) {
  const { company, nav } = getContent(locale);
  const t = getUI(locale);
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="container-site grid grid-cols-12 gap-x-6 gap-y-10 py-16">
        <div className="col-span-12 flex flex-col gap-3 md:col-span-4">
          <span className="font-display text-lg font-medium">{company.legalName}</span>
          <p className="text-muted">{t.footer.about}</p>
        </div>
        <nav aria-label={t.footer.nav} className="col-span-6 md:col-span-2">
          <ul className="flex flex-col gap-2">
            {nav.map((i) => (
              <li key={i.href}>
                <a href={i.href} className="hover:text-accent-text">
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="col-span-6 flex flex-col gap-2 md:col-span-3">
          {company.phones.map((p) => (
            <a key={p.href} href={p.href} className="font-semibold">
              {p.label}
            </a>
          ))}
          <a href={`mailto:${company.email}`} className="link-accent">
            {company.email}
          </a>
          <MapLink query={company.mapQuery} srLabel={t.map} className="text-muted underline decoration-line underline-offset-4 hover:text-accent-text">
            {company.address}
          </MapLink>
        </div>
        <dl className="col-span-12 flex flex-col gap-2 text-sm md:col-span-3">
          {company.requisites.map((r) => (
            <div key={r.label}>
              <dt className="text-muted">{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="container-site flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-line py-6 text-sm text-muted">
        <span>
          © <CurrentYear buildYear={year} /> {company.legalName}
        </span>
        <a href={localePath(locale, '/privacy')} className="hover:text-accent-text">
          {t.footer.privacy}
        </a>
        <span>
          {t.footer.madeBy}{' '}
          <a href="https://www.karatayev.com/" target="_blank" rel="noopener" className="underline decoration-line underline-offset-4 hover:text-accent-text">
            karatayev.com
          </a>
        </span>
      </div>
    </footer>
  );
}
