'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { certificates } from '@/content/site';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';

export function Certificates() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (current != null && !d.open) d.showModal();
    if (current == null && d.open) d.close();
  }, [current]);

  const cert = current != null ? certificates[current] : null;

  return (
    <section id="certificates" aria-labelledby="certificates-title" className="section border-t border-line">
      <div className="container-site flex flex-col gap-12">
        <SectionHead label="Документы" title="Сертификаты и свидетельства" id="certificates-title" />
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {certificates.map((c, i) => (
            <li key={c.src}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                className="group flex w-full flex-col gap-3 text-left"
                aria-label={`Открыть документ ${i + 1}`}
              >
                <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-card border border-line bg-surface">
                  <Image src={c.src} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain p-3" />
                </span>
                <span className="text-sm">
                  <Text>{c.caption}</Text>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Лайтбокс на нативном <dialog>: фокус-ловушка и Esc из коробки */}
      <dialog
        ref={dialog}
        onClose={() => setCurrent(null)}
        onClick={(e) => e.target === e.currentTarget && setCurrent(null)}
        className="m-auto max-h-[92vh] w-[min(92vw,960px)] rounded-card border border-line bg-bg p-0 text-text backdrop:bg-bg/80"
        aria-label="Просмотр документа"
      >
        {cert ? (
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-line p-4">
              <span className="text-sm">
                <Text>{cert.caption}</Text>
              </span>
              <button type="button" onClick={() => setCurrent(null)} aria-label="Закрыть" className="inline-flex size-10 items-center justify-center rounded border border-line">
                <Icon name="close" size={20} />
              </button>
            </div>
            <div className="relative h-[78vh] bg-surface">
              <Image src={cert.src} alt="Документ компании" fill sizes="92vw" className="object-contain p-4" />
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
