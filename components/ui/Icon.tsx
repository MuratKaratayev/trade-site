import type { ProductIcon } from '@/content/site';

// Иконки: сетка 40, линия 1.8, скругления. cabinet и controller — из листа 02 брендбука.
const paths: Record<ProductIcon | 'arrow' | 'sun' | 'moon' | 'close' | 'menu', string> = {
  cabinet: '<rect x="8" y="4" width="24" height="32" rx="2"/><path d="M8 16h24M13 9h4M13 22h14M13 27h14M13 32h8"/>',
  controller:
    '<rect x="10" y="10" width="20" height="20" rx="2"/><rect x="15" y="15" width="10" height="10"/><path d="M14 4v6M20 4v6M26 4v6M14 30v6M20 30v6M26 30v6M4 14h6M4 20h6M4 26h6M30 14h6M30 20h6M30 26h6"/>',
  gauge: '<circle cx="20" cy="18" r="13"/><path d="M20 18l6-6M11 18h2M27 18h2M20 9v2M14 34h12M20 31v3"/>',
  relay: '<rect x="6" y="10" width="12" height="22" rx="2"/><rect x="22" y="10" width="12" height="22" rx="2"/><path d="M4 32h32M10 15h4M26 15h4M12 21v6M28 21v6"/>',
  arrow: '<path d="M8 20h24M24 12l8 8-8 8"/>',
  sun: '<circle cx="20" cy="20" r="7"/><path d="M20 4v4M20 32v4M4 20h4M32 20h4M8.7 8.7l2.8 2.8M28.5 28.5l2.8 2.8M8.7 31.3l2.8-2.8M28.5 11.5l2.8-2.8"/>',
  moon: '<path d="M32 24.5A13 13 0 1 1 15.5 8a10.5 10.5 0 0 0 16.5 16.5z"/>',
  close: '<path d="M10 10l20 20M30 10L10 30"/>',
  menu: '<path d="M6 14h28M6 26h28"/>',
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 40, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: paths[name] }}
    />
  );
}
