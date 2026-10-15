import Image from 'next/image';
import { getContent } from '@/content';
import { getUI } from '@/content/ui';
import type { Locale } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { CertificateLightbox } from './CertificateLightbox';

// Серверная секция: разметка и подписи рендерятся на сервере, на клиент уходит только лайтбокс.
export function Certificates({ locale }: { locale: Locale }) {
  const { certificates } = getContent(locale);
  const t = getUI(locale).certificates;
  return (
    <section id="certificates" aria-labelledby="certificates-title" className="section border-t border-line">
      <div className="container-site flex flex-col gap-12">
        <SectionHead label={t.label} title={t.title} id="certificates-title" />
        <CertificateLightbox items={certificates} labels={{ close: t.close, view: t.view, fallback: t.fallback }}>
          {certificates.map((c, i) => (
            <li key={c.src}>
              <button type="button" data-cert={i} className="group flex w-full flex-col gap-3 text-left">
                <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-card border border-line bg-surface transition-colors group-hover:border-text">
                  <Image src={c.src} alt="" fill sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw" className="object-contain p-3" />
                </span>
                <span className="text-sm [overflow-wrap:anywhere]">
                  <Text>{c.caption}</Text>
                </span>
              </button>
            </li>
          ))}
        </CertificateLightbox>
      </div>
    </section>
  );
}
