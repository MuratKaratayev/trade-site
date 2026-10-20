import { getContent } from '@/content';
import { getUI } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import { MapLink } from '@/components/ui/MapLink';

// Контакты на главной. Формы заявки нет (решение клиента 2026-10-20): связь по телефону и почте.
// id="lead" оставлен для старых ссылок /#lead.
export function Contacts({ locale }: { locale: Locale }) {
  const { company } = getContent(locale);
  const t = getUI(locale);
  return (
    <section id="contacts" aria-labelledby="contacts-title" className="section border-t border-line">
      <div id="lead" className="container-site grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
          <span className="t-label">{t.contacts.label}</span>
          <h2 id="contacts-title" className="t-h2">
            {t.contacts.title}
          </h2>
          <p className="t-body-l text-muted">{t.contacts.sub}</p>
        </div>
        <dl className="col-span-12 grid gap-8 rounded-card border border-line bg-surface p-6 md:p-8 lg:col-span-6 lg:col-start-7">
          <div>
            <dt className="text-sm text-muted">{t.contacts.phones}</dt>
            <dd className="flex flex-col">
              {company.phones.map((p) => (
                <a key={p.href} href={p.href} className="py-1 text-lg font-semibold">
                  {p.label}
                </a>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t.contacts.email}</dt>
            <dd>
              <a href={`mailto:${company.email}`} className="link-accent text-lg">
                {company.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">{t.contacts.address}</dt>
            <dd>
              <MapLink query={company.mapQuery} srLabel={t.map} className="underline decoration-line underline-offset-4 hover:text-accent-text">
                {company.address}
              </MapLink>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
