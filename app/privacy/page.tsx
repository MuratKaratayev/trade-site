import type { Metadata } from 'next';
import Link from 'next/link';
import { company } from '@/content/site';
import { ogBase, twitterBase } from '@/lib/seo';
import { Text } from '@/components/ui/Text';

const title = 'Политика обработки персональных данных';
const description = `Как ${company.legalName} обрабатывает персональные данные, полученные через форму заявки на сайте.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/privacy' },
  openGraph: { ...ogBase, title, description, url: '/privacy' },
  twitter: { ...twitterBase, title, description },
};

// ЧЕРНОВИК. Текст составлен по данным сайта и требует проверки юристом клиента до запуска.
const sections: { h: string; p: string[] }[] = [
  {
    h: 'Оператор',
    p: [
      `${company.legalName}, БИН ${company.requisites.find((r) => r.label === 'БИН')?.value ?? ''}.`,
      `Фактический адрес: ${company.address}. Электронная почта: ${company.email}. Телефон: ${company.phones[0].label}.`,
    ],
  },
  {
    h: 'Какие данные мы получаем',
    p: ['Через форму «Оставить заявку»: имя, номер телефона и текст сообщения, если вы его указали.'],
  },
  {
    h: 'Зачем',
    p: ['Чтобы связаться с вами по заявке, уточнить задачу и подготовить предложение. Для рассылок данные не используются.'],
  },
  {
    h: 'Основание',
    p: ['Ваше согласие, которое вы даёте, отмечая соответствующий пункт в форме, — в соответствии с законодательством Республики Казахстан о персональных данных и их защите.'],
  },
  {
    h: 'Хранение и передача',
    p: ['[ОТ КЛИЕНТА: где и сколько хранятся заявки, кому могут передаваться (например, сервис уведомлений), порядок уничтожения]'],
  },
  {
    h: 'Ваши права',
    p: [`Вы можете узнать, какие ваши данные мы храним, потребовать их уточнения или удаления и отозвать согласие, написав на ${company.email}.`],
  },
];

export default function PrivacyPage() {
  return (
    <article className="section">
      <div className="container-site grid grid-cols-12 gap-x-6 gap-y-10">
        <nav aria-label="Хлебные крошки" className="col-span-12 text-sm text-muted">
          <Link href="/" className="hover:text-accent-text">
            Главная
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page" className="text-text">
            {title}
          </span>
        </nav>
        <header className="col-span-12 flex flex-col gap-4 lg:col-span-8">
          <span className="t-label">Документ</span>
          <h1 className="t-h2">{title}</h1>
          <p className="text-muted">
            <Text>[ОТ КЛИЕНТА: черновик — текст нужно проверить и утвердить у юриста, указать дату редакции]</Text>
          </p>
        </header>
        <div className="col-span-12 flex flex-col gap-8 lg:col-span-8">
          {sections.map((s) => (
            <section key={s.h} className="flex flex-col gap-3">
              <h2 className="t-h3">{s.h}</h2>
              {s.p.map((t) => (
                <p key={t} className="t-body-l text-muted">
                  <Text>{t}</Text>
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
