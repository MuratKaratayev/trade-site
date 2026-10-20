import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent } from '@/content';
import { getUI } from '@/content/ui';
import { localePath, type Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { hyphenate } from '@/lib/hyphenate';

export type ProductParams = { slug: string };

// Разделы одинаковые для обоих языков (slug не переводится)
export function productStaticParams(): ProductParams[] {
  return getContent('ru').visibleProducts.map((p) => ({ slug: p.slug }));
}

export function productMetadata(locale: Locale, slug: string): Metadata {
  const { visibleProducts: products, isPlaceholder } = getContent(locale);
  const p = products.find((x) => x.slug === slug);
  if (!p) return {};
  const description = isPlaceholder(p.summary) ? getUI(locale).product.metaFallback(p.title) : p.summary;
  return pageMetadata(locale, `/products/${p.slug}`, p.title, description);
}

export function ProductPage({ locale, slug }: { locale: Locale; slug: string }) {
  const { company, visibleProducts: products } = getContent(locale);
  const t = getUI(locale).product;
  const lp = (path: string) => localePath(locale, path);
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();

  const others = products.filter((x) => x.slug !== p.slug);
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.home, item: company.url + lp('/') },
      { '@type': 'ListItem', position: 2, name: t.products, item: company.url + lp('/#products') },
      { '@type': 'ListItem', position: 3, name: p.title, item: company.url + lp(`/products/${p.slug}`) },
    ],
  };

  return (
    <article className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <div className="container-site grid grid-cols-12 gap-x-6 gap-y-12">
        <nav aria-label={t.breadcrumbs} className="col-span-12 text-sm text-muted">
          <Link href={lp('/')} className="hover:text-accent-text">
            {t.home}
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href={lp('/#products')} className="hover:text-accent-text">
            {t.products}
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page" className="text-text">
            {p.title}
          </span>
        </nav>

        <header className="col-span-12 flex flex-col gap-6 lg:col-span-8">
          <Icon name={p.icon} className="text-accent-text" />
          <span className="t-label">{t.products}</span>
          <h1 className="t-h2">{hyphenate(p.title)}</h1>
          {p.description.map((d) => (
            <p key={d} className="t-body-l text-muted">
              <Text>{d}</Text>
            </p>
          ))}
        </header>

        <section aria-labelledby="items-title" className="col-span-12 flex flex-col gap-6 lg:col-span-8">
          <h2 id="items-title" className="t-h2">
            {t.items}
          </h2>
          {p.items.length > 0 ? (
            <ul className="border-t border-line">
              {p.items.map((it) => (
                <li key={it.name} className="flex flex-col gap-1 border-b border-line py-4">
                  <span className="font-medium">{it.name}</span>
                  {it.note ? <span className="text-sm text-muted">{it.note}</span> : null}
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
          <h2 className="t-h3">{t.asideTitle}</h2>
          <p className="text-muted">{t.asideText}</p>
          <Link href={lp('/#contacts')} className="btn btn-primary self-start">
            {t.asideCta}
          </Link>
        </aside>
        <nav aria-labelledby="others-title" className="col-span-12 flex flex-col gap-6 border-t border-line pt-12">
          <h2 id="others-title" className="t-h3">
            {t.others}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={lp(`/products/${o.slug}`)} className="flex h-full items-center gap-4 rounded-card border border-line p-4 hover:border-text">
                  <Icon name={o.icon} size={32} className="shrink-0 text-accent-text" />
                  <span className="font-medium">{o.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}
