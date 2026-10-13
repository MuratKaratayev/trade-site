import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '@/content/site';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) return {};
  const description = p.summary.startsWith('[') ? `${p.title} — TRADE-Инжиниринг, Павлодар.` : p.summary;
  return { title: p.title, description, alternates: { canonical: `/products/${p.slug}` }, openGraph: { title: p.title, description } };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <article className="section">
      <div className="container-site grid grid-cols-12 gap-x-6 gap-y-12">
        <nav aria-label="Хлебные крошки" className="col-span-12 text-sm text-muted">
          <Link href="/" className="hover:text-accent-text">
            Главная
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href="/#products" className="hover:text-accent-text">
            Продукция
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page" className="text-text">
            {p.title}
          </span>
        </nav>

        <header className="col-span-12 flex flex-col gap-6 lg:col-span-8">
          <Icon name={p.icon} className="text-accent-text" />
          <span className="t-label">Продукция</span>
          <h1 className="t-display">{p.title}</h1>
          {p.description.map((d) => (
            <p key={d} className="t-body-l text-muted">
              <Text>{d}</Text>
            </p>
          ))}
        </header>

        <section aria-labelledby="items-title" className="col-span-12 flex flex-col gap-6 lg:col-span-8">
          <h2 id="items-title" className="t-h2">
            Номенклатура
          </h2>
          {p.items.length > 0 ? (
            <ul className="border-t border-line">
              {p.items.map((it) => (
                <li key={it} className="border-b border-line py-4">
                  {it}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <Text>[ОТ КЛИЕНТА: перечень позиций раздела]</Text>
            </p>
          )}
        </section>

        <aside className="col-span-12 flex flex-col gap-4 self-start rounded-card border border-line bg-surface p-6 lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:row-span-2">
          <h2 className="t-h3">Нужна поставка или подбор?</h2>
          <p className="text-muted">Пришлите опросный лист или спецификацию — подберём оборудование под проект.</p>
          <Link href="/#lead" className="btn btn-primary self-start">
            Оставить заявку
          </Link>
        </aside>
      </div>
    </article>
  );
}
