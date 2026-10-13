'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

type Theme = 'dark' | 'light';

/** Переключатель темы: меняет только data-theme на <html>, выбор хранится в localStorage. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  }, []);

  const next: Theme = theme === 'light' ? 'dark' : 'light';
  const toggle = () => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={next === 'light' ? 'Включить светлую тему' : 'Включить тёмную тему'}
      title={next === 'light' ? 'Светлая тема' : 'Тёмная тема'}
      className="inline-flex size-12 items-center justify-center rounded border border-line text-text hover:bg-surface"
    >
      {/* До гидратации тема неизвестна — показываем иконку, не влияющую на вёрстку */}
      <Icon name={theme === 'light' ? 'moon' : 'sun'} size={22} />
    </button>
  );
}
