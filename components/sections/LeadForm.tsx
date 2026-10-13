'use client';

import { useActionState } from 'react';
import { submitLead } from '@/app/actions/lead';
import type { LeadState } from '@/lib/lead-schema';
import { company } from '@/content/site';

const initial: LeadState = { status: 'idle' };

export function LeadForm() {
  const [state, action, pending] = useActionState(submitLead, initial);
  const err = state.fieldErrors ?? {};

  return (
    <section id="contacts" aria-labelledby="lead-title" className="section border-t border-line">
      <div id="lead" className="container-site grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
          <span className="t-label">Контакты</span>
          <h2 id="lead-title" className="t-h2">
            Оставить заявку
          </h2>
          <p className="t-body-l text-muted">Опишите объект и задачу — подготовим технические решения и бюджетную оценку.</p>
          <dl className="mt-2 flex flex-col gap-5">
            <div>
              <dt className="text-sm text-muted">Телефоны</dt>
              <dd className="flex flex-col">
                {company.phones.map((p) => (
                  <a key={p.href} href={p.href} className="text-lg font-semibold">
                    {p.label}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Почта</dt>
              <dd>
                <a href={`mailto:${company.email}`} className="link-accent">
                  {company.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Адрес</dt>
              <dd>{company.address}</dd>
            </div>
          </dl>
        </div>

        <form action={action} noValidate className="relative col-span-12 flex flex-col gap-5 rounded-card border border-line bg-surface p-6 md:p-8 lg:col-span-6 lg:col-start-7">
          <div className="flex flex-col gap-2">
            <label htmlFor="lead-name" className="text-sm font-medium text-muted">
              Имя
            </label>
            <input id="lead-name" name="name" autoComplete="name" required className="field" aria-invalid={!!err.name} aria-describedby={err.name ? 'e-name' : undefined} />
            {err.name ? <p id="e-name" className="text-sm text-accent-text">{err.name}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lead-phone" className="text-sm font-medium text-muted">
              Телефон
            </label>
            <input id="lead-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 ___ ___ __ __" required className="field" aria-invalid={!!err.phone} aria-describedby={err.phone ? 'e-phone' : undefined} />
            {err.phone ? <p id="e-phone" className="text-sm text-accent-text">{err.phone}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lead-message" className="text-sm font-medium text-muted">
              Сообщение
            </label>
            <textarea id="lead-message" name="message" rows={4} className="field" aria-invalid={!!err.message} aria-describedby={err.message ? 'e-message' : undefined} />
            {err.message ? <p id="e-message" className="text-sm text-accent-text">{err.message}</p> : null}
          </div>
          {/* Honeypot: скрыт от людей и скринридеров */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="lead-website">Сайт</label>
            <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-3">
              <input type="checkbox" name="consent" required className="mt-1 size-5 shrink-0 accent-[var(--accent)]" aria-invalid={!!err.consent} aria-describedby={err.consent ? 'e-consent' : undefined} />
              <span>Я согласен с обработкой персональных данных</span>
            </label>
            {err.consent ? <p id="e-consent" className="text-sm text-accent-text">{err.consent}</p> : null}
          </div>
          <button type="submit" disabled={pending} className="btn btn-primary self-start disabled:opacity-70">
            {pending ? 'Отправляем…' : 'Отправить'}
          </button>
          <p role="status" aria-live="polite" className="min-h-6 text-sm">
            {state.status !== 'idle' ? state.message : ''}
            {state.status === 'not-configured' ? (
              <>
                {' '}
                <a href={company.phones[0].href} className="link-accent">
                  {company.phones[0].label}
                </a>
              </>
            ) : null}
          </p>
        </form>
      </div>
    </section>
  );
}
