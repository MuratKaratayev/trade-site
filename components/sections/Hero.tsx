import { company } from '@/content/site';
import { hyphenate } from '@/lib/hyphenate';
import { FigureRack } from '@/components/figures/Figures';

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
          <div className="mt-2 flex flex-wrap gap-3">
            <a href="#lead" className="btn btn-primary">
              Оставить заявку
            </a>
            <a href="#products" className="btn btn-secondary">
              Каталог продукции
            </a>
          </div>
        </div>
        <FigureRack className="col-span-12 mx-auto w-full max-w-[520px] lg:col-span-5" />
      </div>
    </section>
  );
}
