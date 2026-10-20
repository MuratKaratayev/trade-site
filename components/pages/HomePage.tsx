import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Products } from '@/components/sections/Products';
import { Services } from '@/components/sections/Services';
import { Experience } from '@/components/sections/Experience';
import { Certificates } from '@/components/sections/Certificates';
import { Contacts } from '@/components/sections/Contacts';
import type { Locale } from '@/lib/i18n';

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero locale={locale} />
      <About locale={locale} />
      <Products locale={locale} />
      <Services locale={locale} />
      <Experience locale={locale} />
      <Certificates locale={locale} />
      <Contacts locale={locale} />
    </>
  );
}
