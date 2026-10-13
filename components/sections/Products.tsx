import Link from 'next/link';
import { products } from '@/content/site';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { FigureDinRail } from '@/components/figures/Figures';
import { hyphenate } from '@/lib/hyphenate';

export function Products() {
  return (
    <section id="products" aria-labelledby="products-title" className="section border-t border-line">
      <div className="container-site grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 flex flex-col justify-between gap-8 lg:col-span-5">
          <SectionHead label="Продукция" title="Оборудование для систем автоматизации" id="products-title">
            Комплектные шкафы, контроллеры и КИП под проект заказчика.
          </SectionHead>
          <FigureDinRail className="w-full max-w-[460px]" />
        </div>
        <ul className="col-span-12 grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-1 xl:grid-cols-2">
          {products.map((p) => (
            <li
              key={p.slug}
              className="group relative flex flex-col gap-4 rounded-card border border-line bg-surface p-6 transition-colors hover:border-text focus-within:border-text"
            >
              <Icon name={p.icon} className="text-accent-text" />
              <h3 className="t-h3">{hyphenate(p.title)}</h3>
              <p className="flex-1 text-muted">
                <Text>{p.summary}</Text>
              </p>
              {/* Растянутая ссылка: кликабельна вся карточка, а в дереве доступности — одна ссылка */}
              <Link
                href={`/products/${p.slug}`}
                className="link-accent self-start after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[var(--accent-text)]"
              >
                Подробнее <span aria-hidden="true">→</span>
                <span className="sr-only"> о разделе «{p.title}»</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
