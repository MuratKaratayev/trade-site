import { ProductPage, productMetadata, productStaticParams, type ProductParams } from '@/components/pages/ProductPage';

export const dynamicParams = false;
export const generateStaticParams = productStaticParams;

export async function generateMetadata({ params }: { params: Promise<ProductParams> }) {
  return productMetadata('ru', (await params).slug);
}

export default async function Page({ params }: { params: Promise<ProductParams> }) {
  return <ProductPage locale="ru" slug={(await params).slug} />;
}
