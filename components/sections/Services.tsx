import { getContent } from '@/content';
import { getUI } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';
import { hyphenate } from '@/lib/hyphenate';

export function Services({ locale }: { locale: Locale }) {
  const { services } = getContent(locale);
  const t = getUI(locale).services;
  return (
    <section id="services" aria-labelledby="services-title" className="section border-t border-line">
      <div className="container-site flex flex-col gap-12">
        <SectionHead label={t.label} title={t.title} id="services-title">
          {t.sub}
        </SectionHead>
        <ol className="grid grid-cols-1 border-t border-line md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-4 border-b border-line py-8 md:pr-8">
              <span className="t-label">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-h3">{hyphenate(s.title)}</h3>
              <ul className="flex flex-col gap-2 text-muted">
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
