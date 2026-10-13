'use client';

import { useEffect, useState } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';

export type ThemeMode = 'system' | 'light' | 'dark';

const KEY = 'theme';
const EVENT = 'themechange';
const media = () => window.matchMedia('(prefers-color-scheme: light)');

/** Режим → фактическая тема. Атрибут data-theme всегда 'light' | 'dark' (токены завязаны на него). */
function apply(mode: ThemeMode) {
  const resolved = mode === 'system' ? (media().matches ? 'light' : 'dark') : mode;
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);
  root.setAttribute('data-theme-mode', mode);
  (window as unknown as { __themeColor?: () => void }).__themeColor?.();
}

function readMode(): ThemeMode {
  const m = document.documentElement.getAttribute('data-theme-mode');
  return m === 'light' || m === 'dark' ? m : 'system';
}

function setMode(mode: ThemeMode) {
  try {
    if (mode === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, mode);
  } catch {}
  apply(mode);
  window.dispatchEvent(new CustomEvent(EVENT));
}

// Один слушатель системной темы на страницу: в режиме «как в системе» тема меняется вслед за ОС.
let systemListenerAttached = false;
function attachSystemListener() {
  if (systemListenerAttached) return;
  systemListenerAttached = true;
  media().addEventListener('change', () => {
    if (readMode() === 'system') {
      apply('system');
      window.dispatchEvent(new CustomEvent(EVENT));
    }
  });
}

const OPTIONS: { mode: ThemeMode; label: string; icon: IconName }[] = [
  { mode: 'system', label: 'Как в системе', icon: 'monitor' },
  { mode: 'light', label: 'Светлая тема', icon: 'sun' },
  { mode: 'dark', label: 'Тёмная тема', icon: 'moon' },
];

/** Переключатель темы: как в системе (по умолчанию) / светлая / тёмная. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [mode, setModeState] = useState<ThemeMode | null>(null);

  useEffect(() => {
    attachSystemListener();
    const sync = () => setModeState(readMode());
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const choose = (m: ThemeMode) => setMode(m);

  return (
    <div role="radiogroup" aria-label="Тема оформления" className={`inline-flex rounded border border-line p-[3px] ${className}`}>
      {OPTIONS.map((o, i) => {
        const checked = mode === o.mode;
        return (
          <button
            key={o.mode}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={o.label}
            title={o.label}
            data-mode={o.mode}
            // Roving tabindex: в группу попадаем одним Tab, внутри — стрелками
            tabIndex={checked || (mode === null && o.mode === 'system') ? 0 : -1}
            onClick={() => choose(o.mode)}
            onKeyDown={(e) => {
              const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
              if (!step) return;
              e.preventDefault();
              const next = OPTIONS[(i + step + OPTIONS.length) % OPTIONS.length];
              choose(next.mode);
              const group = e.currentTarget.parentElement;
              (group?.querySelectorAll<HTMLButtonElement>('button')[OPTIONS.indexOf(next)])?.focus();
            }}
            className={`theme-opt inline-flex size-10 items-center justify-center rounded-sm transition-colors ${
              checked ? 'bg-surface text-text' : 'text-muted hover:text-text'
            }`}
          >
            <Icon name={o.icon} size={20} />
          </button>
        );
      })}
    </div>
  );
}
