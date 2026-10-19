import type { Metadata, Viewport } from 'next';
import { getContent } from '@/content';
import { getUI } from '@/content/ui';
import { HTML_LANG, localePath, type Locale } from '@/lib/i18n';
import { fontVars } from '@/lib/fonts';
import { pageMetadata } from '@/lib/seo';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothAnchors } from '@/components/layout/SmoothAnchors';
import { LANG_SCROLL_BLOCKS, LANG_SCROLL_KEY } from '@/lib/lang-scroll';

// Общая корневая разметка для обоих языков: app/(ru)/layout.tsx и app/(kk)/layout.tsx отличаются только языком.

export function siteMetadata(locale: Locale): Metadata {
  const { company } = getContent(locale);
  const t = getUI(locale);
  return {
    metadataBase: new URL(company.url),
    title: { default: t.meta.title, template: t.meta.template },
    ...pageMetadata(locale, '/', undefined, t.meta.description),
  };
}

// Цвет панели браузера: один мета-тег, скрипт темы подставляет цвет выбранной темы (а не темы ОС).
export const siteViewport: Viewport = { themeColor: '#14171A' };

// Тема до первой отрисовки (без мигания). Режим: сохранённый 'light' | 'dark', иначе «как в системе».
// data-theme — фактическая тема (на неё завязаны токены), data-theme-mode — выбранный режим.
// window.__themeColor синхронизирует <meta name="theme-color"> (значения = --bg из globals.css).
export const themeScript = `(function(){var d=document.documentElement,m,t;try{m=localStorage.getItem('theme')}catch(e){}if(m!=='light'&&m!=='dark')m='system';t=m==='system'?(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):m;d.setAttribute('data-theme',t);d.setAttribute('data-theme-mode',m);window.__themeColor=function(){var c=d.getAttribute('data-theme')==='light'?'#FFFFFF':'#14171A';document.querySelectorAll('meta[name="theme-color"]').forEach(function(e){e.setAttribute('content',c)})};document.addEventListener('DOMContentLoaded',window.__themeColor)})()`;

// Язык по умолчанию — как в браузере. Работает только на русских страницах (адреса без /kk) и только пока
// посетитель сам не выбрал язык переключателем (localStorage 'lang'). Идём по списку языков браузера:
// первым встретился казахский — переходим на ту же страницу в /kk; русский или ни одного из двух — остаёмся.
export const langScript = `(function(){try{if(localStorage.getItem('lang'))return}catch(e){return}var l=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''];for(var i=0;i<l.length;i++){var c=String(l[i]).toLowerCase();if(c==='kk'||c.indexOf('kk-')===0){var p=location.pathname;location.replace('/kk'+(p==='/'?'':p)+location.search+location.hash);return}if(c==='ru'||c.indexOf('ru-')===0)return}})()`;

// После смены языка — на то же место страницы (его сохраняет LangToggle). Стоит в конце <body>: блоки уже в DOM,
// прокрутка до первой отрисовки. Повторяем, когда догрузились шрифты и картинки (высоты блоков меняются),
// но только пока посетитель сам не начал прокручивать. Запись живёт 15 с и только для страницы, на которую вёл переключатель.
const langScrollScript = `(function(){var s;try{s=JSON.parse(sessionStorage.getItem(${JSON.stringify(LANG_SCROLL_KEY)})||'null');sessionStorage.removeItem(${JSON.stringify(LANG_SCROLL_KEY)})}catch(e){return}if(!s||!(Date.now()-s.t<15000))return;var n=function(p){return String(p).replace(/\\/+$/,'')||'/'};if(n(location.pathname)!==n(s.to))return;if(s.h)try{history.replaceState(history.state,'',location.pathname+location.search+s.h)}catch(e){}var stop=0;['wheel','touchstart','keydown','mousedown'].forEach(function(e){addEventListener(e,function(){stop=1},{once:true,passive:true})});function go(){if(stop)return;var h=document.querySelector('header'),b=document.querySelectorAll(${JSON.stringify(LANG_SCROLL_BLOCKS)}),d=document.documentElement,y,r;if(s.i>=0&&b.length===s.n){r=b[s.i].getBoundingClientRect();y=r.top+scrollY+s.r*r.height+s.d-(h?h.offsetHeight:0)}else y=s.f*d.scrollHeight;scrollTo({top:Math.max(0,Math.round(y)),behavior:'instant'})}go();if(document.fonts)document.fonts.ready.then(go);addEventListener('load',go)})()`;

export function SiteLayout({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const { company, nav } = getContent(locale);
  const t = getUI(locale);
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.legalName,
    url: company.url,
    email: company.email,
    telephone: company.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.streetAddress,
      addressLocality: company.locality,
      addressCountry: company.country,
    },
  };
  return (
    <html lang={HTML_LANG[locale]} data-theme="dark" data-theme-mode="system" suppressHydrationWarning className={fontVars}>
      <head>
        {locale === 'ru' ? <script dangerouslySetInnerHTML={{ __html: langScript }} /> : null}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-3 focus:text-on-accent">
          {t.skip}
        </a>
        <Header
          nav={nav}
          phone={company.phones[0]}
          email={company.email}
          locale={locale}
          homeHref={localePath(locale, '/')}
          logoLabel={t.logo}
          t={t.header}
          themeLabels={t.theme}
          langLabels={t.lang}
        />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <SmoothAnchors />
        <script dangerouslySetInnerHTML={{ __html: langScrollScript }} />
      </body>
    </html>
  );
}
