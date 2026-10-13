import Image from 'next/image';
import Link from 'next/link';

/**
 * Логотип — чистая векторная перерисовка (public/logo.svg, исходники и PNG — docs/logo/).
 * Пропорции 817×90. Тёмная тема: белая плашка (--logo-plate), padding 6–10, радиус 4. Светлая: прозрачная.
 */
export function Logo() {
  return (
    <Link
      href="/"
      aria-label="TRADE-Инжиниринг — на главную"
      className="inline-flex shrink-0 rounded px-[10px] py-[8px]"
      style={{ background: 'var(--logo-plate)' }}
    >
      <Image src="/logo.svg" alt="TRADE-Инжиниринг" width={817} height={90} priority unoptimized className="h-auto w-[170px] md:w-[218px]" />
    </Link>
  );
}
