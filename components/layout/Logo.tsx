import Image from 'next/image';
import Link from 'next/link';

/**
 * Логотип — файл клиента PNG 218×32 без изменений (не перекрашивать, не растягивать).
 * Тёмная тема: белая плашка (--logo-plate), padding 6–10, радиус 4. Светлая: плашка прозрачная.
 * Ширина 160 (моб.) – 218 px, не больше 218.
 */
export function Logo() {
  return (
    <Link
      href="/"
      aria-label="TRADE-Инжиниринг — на главную"
      className="inline-flex shrink-0 rounded px-[10px] py-[6px]"
      style={{ background: 'var(--logo-plate)' }}
    >
      <Image src="/logo.png" alt="TRADE-Инжиниринг" width={218} height={32} priority unoptimized className="h-auto w-[160px] md:w-[218px]" />
    </Link>
  );
}
