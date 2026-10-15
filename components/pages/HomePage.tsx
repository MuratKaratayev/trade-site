import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Products } from '@/components/sections/Products';
import { Services } from '@/components/sections/Services';
import { Experience } from '@/components/sections/Experience';
import { Certificates } from '@/components/sections/Certificates';
import { LeadForm } from '@/components/sections/LeadForm';
import { getContent } from '@/content';
import { getUI } from '@/content/ui';
import { localePath, type Locale } from '@/lib/i18n';

export function HomePage({ locale }: { locale: Locale }) {
  const { company } = getContent(locale);
  const t = getUI(locale);
  return (
    <>
      <Hero locale={locale} />
      <About locale={locale} />
      <Products locale={locale} />
      <Services locale={locale} />
      <Experience locale={locale} />
      <Certificates locale={locale} />
      <LeadForm
        contacts={{ phones: company.phones, email: company.email, address: company.address, mapQuery: company.mapQuery }}
        t={{ ...t.lead, validation: t.validation }}
        privacyHref={localePath(locale, '/privacy')}
        mapLabel={t.map}
      />
    </>
  );
}
