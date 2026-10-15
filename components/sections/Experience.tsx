import Image from 'next/image';
import { getContent } from '@/content';
import { getUI } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';
import { FigureKipField } from '@/components/figures/Figures';

export function Experience({ locale }: { locale: Locale }) {
  const { photos, projects } = getContent(locale);
  const ui = getUI(locale);
  const t = ui.experience;
  return (
    <section id="experience" aria-labelledby="experience-title" className="section border-t border-line">
      <div className="container-site flex flex-col gap-12">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <SectionHead label={t.label} title={t.title} id="experience-title">
              {t.sub}
            </SectionHead>
          </div>
          <FigureKipField label={ui.figures.kip} className="col-span-12 w-full max-w-[420px] lg:col-span-5 lg:justify-self-end" />
        </div>

        <ul className="border-t border-line">
          {projects.map((p) => (
            <li key={p.object + p.city} className="grid grid-cols-12 gap-x-6 gap-y-3 border-b border-line py-6">
              <div className="col-span-12 flex flex-col gap-1 md:col-span-5">
                <h3 className="t-h3">{p.object}</h3>
                <span className="text-sm font-medium tracking-[0.14em] text-accent-text uppercase">
                  {p.city} · {p.industry}
                </span>
                {p.customer ? <span className="text-muted">
                    {t.customer} {p.customer}
                  </span> : null}
              </div>
              <ul className="col-span-12 flex flex-col gap-2 md:col-span-7">
                {p.works.map((w) => (
                  <li key={w} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[10px] h-px w-3 shrink-0 bg-figure-dim" />
                    {w}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {photos.map((ph) => (
            <li key={ph.src}>
              {/* alt пустой: фото описывает видимая подпись figcaption */}
              <figure className="flex flex-col gap-3">
                <div className="photo aspect-[4/5] rounded-card">
                  <Image src={ph.src} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                </div>
                <figcaption className="text-sm text-muted">{ph.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
