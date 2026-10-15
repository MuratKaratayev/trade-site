'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

type Item = { src: string; caption: string };

/** Лайтбокс на нативном <dialog>: фокус-ловушка, Esc и возврат фокуса — средствами браузера. */
export function CertificateLightbox({ items, children }: { items: Item[]; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (current != null && !d.open) d.showModal();
    if (current == null && d.open) d.close();
  }, [current]);

  // Делегирование: кнопки отрисованы сервером и помечены data-cert
  const onClick = (e: MouseEvent<HTMLUListElement>) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-cert]');
    if (btn) setCurrent(Number(btn.dataset.cert));
  };

  const item = current != null ? items[current] : null;
  const caption = item?.caption.replace(/^\[ОТ КЛИЕНТА:.*\]$/, 'Документ компании') ?? '';

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5" onClick={onClick}>
        {children}
      </ul>
      <dialog
        ref={dialog}
        onClose={() => setCurrent(null)}
        onClick={(e) => e.target === e.currentTarget && setCurrent(null)}
        className="m-auto max-h-[92vh] w-[min(92vw,960px)] rounded-card border border-line bg-bg p-0 text-text backdrop:bg-bg/80"
        aria-label={caption || 'Просмотр документа'}
      >
        {item ? (
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-line p-4">
              <span className="text-sm">{caption}</span>
              <button type="button" onClick={() => setCurrent(null)} aria-label="Закрыть" className="inline-flex size-11 shrink-0 items-center justify-center rounded border border-line">
                <Icon name="close" size={20} />
              </button>
            </div>
            <div className="relative h-[78vh] bg-surface">
              <Image src={item.src} alt={caption} fill sizes="92vw" className="object-contain p-4" />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
