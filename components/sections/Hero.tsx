import { company, projects } from '@/content/site';
import { hyphenate } from '@/lib/hyphenate';
import { FigureRack } from '@/components/figures/Figures';

// Ключевые объекты из projects (те же, что на карте старого сайта); фильтр гарантирует, что они есть в данных
const FEATURED = ['Павлодарская ТЭЦ-3', 'Экибастузская ТЭЦ', 'АО ТНК «Казхром»', 'АО «Алюминий Казахстана»'];
const heroObjects = projects.filter((p) => FEATURED.includes(p.object)).map((p) => p.object);

export function Hero() {
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
            <a href="#lead" className="btn btn-primary">
              Оставить заявку
            </a>
            <a href="#products" className="btn btn-secondary">
              Каталог продукции
            </a>
          </div>
          {/* Подтверждение опыта сразу в первом экране — реальные объекты из блока «Наш опыт» */}
          <p className="mt-4 border-t border-line pt-6 text-sm text-muted">
            <span className="t-label mr-2 inline-block">Объекты</span>
            {heroObjects.join(' · ')}
          </p>
        </div>
        <FigureRack className="col-span-12 mx-auto w-full max-w-[520px] lg:col-span-5" />
      </div>
    </section>
  );
}
