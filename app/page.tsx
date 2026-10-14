import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Products } from '@/components/sections/Products';
import { Services } from '@/components/sections/Services';
import { Experience } from '@/components/sections/Experience';
import { Certificates } from '@/components/sections/Certificates';
import { LeadForm } from '@/components/sections/LeadForm';
import { company } from '@/content/site';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Products />
      <Services />
      <Experience />
      <Certificates />
      <LeadForm contacts={{ phones: company.phones, email: company.email, address: company.address, mapQuery: company.mapQuery }} />
    </>
  );
}
