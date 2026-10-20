import { getContent } from '@/content';
import { getUI } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import { hyphenate } from '@/lib/hyphenate';
import { FigureRack } from '@/components/figures/Figures';

export function Hero({ locale }: { locale: Locale }) {
  const { company, projects } = getContent(locale);
  const t = getUI(locale);
  // Ключевые объекты (те же, что на карте старого сайта) — помечены featured в данных
  const heroObjects = projects.filter((p) => p.featured).map((p) => p.object);
  return (
    <section aria-labelledby="hero-title" className="section">
      <div className="container-site grid grid-cols-12 items-center gap-x-6 gap-y-12">
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
          <span className="t-label flex items-center gap-[10px]">
            <span aria-hidden="true" className="size-2 rounded-full bg-accent-text" />
            {company.overline}
          </span>
          <h1 id="hero-title" className="t-display">
            {hyphenate(company.slogan)}
          </h1>
          <p className="t-body-l max-w-[560px] text-muted">{company.lead}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#contacts" className="btn btn-primary">
              {t.hero.lead}
            </a>
            <a href="#products" className="btn btn-secondary">
              {t.hero.catalog}
            </a>
          </div>
          {/* Подтверждение опыта сразу в первом экране — реальные объекты из блока «Наш опыт» */}
          <p className="mt-4 border-t border-line pt-6 text-sm text-muted">
            <span className="t-label mr-2 inline-block">{t.hero.objects}</span>
            {heroObjects.join(' · ')}
          </p>
        </div>
        <FigureRack label={t.figures.rack} className="col-span-12 mx-auto w-full max-w-[520px] lg:col-span-5" />
      </div>
    </section>
  );
}
