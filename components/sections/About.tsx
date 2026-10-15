import { getContent } from '@/content';
import { getUI } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';

export function About({ locale }: { locale: Locale }) {
  const { about } = getContent(locale);
  const t = getUI(locale).about;
  return (
    <section id="about" aria-labelledby="about-title" className="section border-t border-line">
      <div className="container-site grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-6">
          <SectionHead label={t.label} title={t.title} id="about-title" />
          {about.text.map((p) => (
            <p key={p} className="t-body-l text-muted">
              {p}
            </p>
          ))}
        </div>
        <div className="col-span-12 flex flex-col gap-10 lg:col-span-5 lg:col-start-8">
          <div className="flex flex-col gap-4">
            <h3 className="t-h3">{t.industries}</h3>
            <ul className="flex flex-wrap gap-2">
              {about.industries.map((i) => (
                <li key={i} className="rounded border border-line px-4 py-2">
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="t-h3">{t.tasks}</h3>
            <ul className="flex flex-col">
              {about.tasks.map((t) => (
                <li key={t} className="border-b border-line py-3">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="t-h3">{t.platforms}</h3>
            <p className="text-muted">{t.platformsText(about.platforms.join(', '))}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
