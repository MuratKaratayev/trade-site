import '../globals.css';
import { SiteLayout, siteMetadata, siteViewport } from '@/components/site/SiteLayout';

// Корневая разметка казахской версии (адреса /kk/…).
export const metadata = siteMetadata('kk');
export const viewport = siteViewport;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout locale="kk">{children}</SiteLayout>;
}
