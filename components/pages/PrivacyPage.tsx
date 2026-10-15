import type { Metadata } from 'next';
import Link from 'next/link';
import { getContent } from '@/content';
import { getUI } from '@/content/ui';
import { localePath, type Locale } from '@/lib/i18n';
import { pageMetadata } from '@/lib/seo';
import { Text } from '@/components/ui/Text';

export function privacyMetadata(locale: Locale): Metadata {
  const { company } = getContent(locale);
  const t = getUI(locale).privacy;
  return pageMetadata(locale, '/privacy', t.title, t.description(company.legalName));
}

// ЧЕРНОВИК. Текст составлен по данным сайта и требует проверки юристом клиента до запуска.
// Казахская версия — перевод русской, тоже требует вычитки.
function sections(locale: Locale): { h: string; p: string[] }[] {
  const { company } = getContent(locale);
  const phone = company.phones[0].label;
  const holder = '[ОТ КЛИЕНТА: где и сколько хранятся заявки, кому могут передаваться (например, сервис уведомлений), порядок уничтожения]';
  if (locale === 'kk') {
    return [
      { h: 'Оператор', p: [`${company.legalName}, БСН ${company.bin}.`, `Нақты мекенжайы: ${company.address}. Электрондық пошта: ${company.email}. Телефон: ${phone}.`] },
      { h: 'Қандай деректерді аламыз', p: ['«Өтінім қалдыру» формасы арқылы: аты, телефон нөмірі және хабарлама мәтіні (егер көрсетсеңіз).'] },
      { h: 'Не үшін', p: ['Өтінім бойынша сізбен байланысу, міндетті нақтылау және ұсыныс дайындау үшін. Деректер жарнамалық таратылымдар үшін пайдаланылмайды.'] },
      { h: 'Негіз', p: ['Формадағы тиісті тармақты белгілеу арқылы беретін келісіміңіз — Қазақстан Республикасының дербес деректер және оларды қорғау туралы заңнамасына сәйкес.'] },
      { h: 'Сақтау және беру', p: [holder] },
      { h: 'Сіздің құқықтарыңыз', p: [`Біз сіздің қандай деректеріңізді сақтайтынымызды біле аласыз, оларды нақтылауды немесе жоюды талап ете аласыз және ${company.email} поштасына жазу арқылы келісіміңізді кері қайтарып ала аласыз.`] },
    ];
  }
  return [
    { h: 'Оператор', p: [`${company.legalName}, БИН ${company.bin}.`, `Фактический адрес: ${company.address}. Электронная почта: ${company.email}. Телефон: ${phone}.`] },
    { h: 'Какие данные мы получаем', p: ['Через форму «Оставить заявку»: имя, номер телефона и текст сообщения, если вы его указали.'] },
    { h: 'Зачем', p: ['Чтобы связаться с вами по заявке, уточнить задачу и подготовить предложение. Для рассылок данные не используются.'] },
    { h: 'Основание', p: ['Ваше согласие, которое вы даёте, отмечая соответствующий пункт в форме, — в соответствии с законодательством Республики Казахстан о персональных данных и их защите.'] },
    { h: 'Хранение и передача', p: [holder] },
    { h: 'Ваши права', p: [`Вы можете узнать, какие ваши данные мы храним, потребовать их уточнения или удаления и отозвать согласие, написав на ${company.email}.`] },
  ];
}

export function PrivacyPage({ locale }: { locale: Locale }) {
  const ui = getUI(locale);
  const t = ui.privacy;
  const title = t.title;
  return (
    <article className="section">
      <div className="container-site grid grid-cols-12 gap-x-6 gap-y-10">
        <nav aria-label={ui.product.breadcrumbs} className="col-span-12 text-sm text-muted">
          <Link href={localePath(locale, '/')} className="hover:text-accent-text">
            {ui.product.home}
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page" className="text-text">
            {title}
          </span>
        </nav>
        <header className="col-span-12 flex flex-col gap-4 lg:col-span-8">
          <span className="t-label">{t.label}</span>
          <h1 className="t-h2">{title}</h1>
          <p className="text-muted">
            <Text>[ОТ КЛИЕНТА: черновик — текст нужно проверить и утвердить у юриста, указать дату редакции]</Text>
          </p>
        </header>
        <div className="col-span-12 flex flex-col gap-8 lg:col-span-8">
          {sections(locale).map((s) => (
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
