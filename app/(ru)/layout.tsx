import '../globals.css';
import { SiteLayout, siteMetadata, siteViewport } from '@/components/site/SiteLayout';

// Корневая разметка русской версии (адреса без префикса).
export const metadata = siteMetadata('ru');
export const viewport = siteViewport;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout locale="ru">{children}</SiteLayout>;
}
