'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

type Props = { nav: { label: string; href: string }[]; phone: { label: string; href: string }; email: string };

// Клиентский компонент получает данные пропсами — модуль content/site не попадает в клиентский бандл.
export function Header({ nav, phone, email }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      {/* Высота 96: охранное поле логотипа ≥ 32 px сверху и снизу на десктопе */}
      <div className="container-site flex h-[72px] items-center gap-8 lg:h-24">
        <Logo />
        <nav aria-label="Основная навигация" className="ml-auto hidden lg:block">
          <ul className="flex gap-5 text-[15px] font-medium xl:gap-7">
            {nav.map((i) => (
              <li key={i.href}>
                <a href={i.href} className="hover:text-accent-text">
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <a href={phone.href} className="hidden font-semibold whitespace-nowrap xl:inline">
            {phone.label}
          </a>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <button
            type="button"
            className="inline-flex size-12 items-center justify-center rounded border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>
      <div id="mobile-menu" hidden={!open} className="border-t border-line lg:hidden">
        <nav aria-label="Мобильная навигация" className="container-site py-4">
          <ul onClick={() => setOpen(false)}>
            {nav.map((i) => (
              <li key={i.href}>
                <a href={i.href} className="block border-b border-line py-4 text-lg font-medium">
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between sm:hidden">
            <span className="text-muted">Тема</span>
            <ThemeToggle />
          </div>
          <a href={phone.href} className="mt-6 block text-lg font-semibold">
            {phone.label}
          </a>
          <a href={`mailto:${email}`} className="mt-2 block text-muted">
            {email}
          </a>
        </nav>
      </div>
    </header>
  );
}
