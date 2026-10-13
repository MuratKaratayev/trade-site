import Image from 'next/image';
import { certificates } from '@/content/site';
import { SectionHead } from '@/components/ui/SectionHead';
import { Text } from '@/components/ui/Text';
import { CertificateLightbox } from './CertificateLightbox';

// Серверная секция: разметка и подписи рендерятся на сервере, на клиент уходит только лайтбокс.
export function Certificates() {
  return (
    <section id="certificates" aria-labelledby="certificates-title" className="section border-t border-line">
      <div className="container-site flex flex-col gap-12">
        <SectionHead label="Документы" title="Сертификаты и свидетельства" id="certificates-title" />
        <CertificateLightbox items={certificates}>
          {certificates.map((c, i) => (
            <li key={c.src}>
              <button type="button" data-cert={i} className="group flex w-full flex-col gap-3 text-left">
                <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-card border border-line bg-surface transition-colors group-hover:border-text">
                  <Image src={c.src} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain p-3" />
                </span>
                <span className="text-sm">
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
