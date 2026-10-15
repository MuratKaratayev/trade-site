'use client';

import { useActionState, useEffect, useRef } from 'react';
import { submitLead } from '@/lib/lead-validate';
import { HONEYPOT_FIELD, type LeadState } from '@/lib/lead-types';
import { MapLink } from '@/components/ui/MapLink';

type Contacts = {
  phones: { label: string; href: string }[];
  email: string;
  address: string;
  mapQuery: string;
};

const initial: LeadState = { status: 'idle' };
const FIELDS = ['name', 'phone', 'consent'] as const;

// Контакты приходят пропсами из серверной страницы — content/site не попадает в клиентский бандл.
export function LeadForm({ contacts }: { contacts: Contacts }) {
  const [state, action, pending] = useActionState(submitLead, initial);
  const err = state.fieldErrors ?? {};
  const v = state.values;
  const formRef = useRef<HTMLFormElement>(null);

  // После неудачной отправки — фокус на первое поле с ошибкой
  useEffect(() => {
    if (state.status !== 'error' || !formRef.current) return;
    const first = FIELDS.find((f) => err[f]);
    if (first) formRef.current.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state, err]);

  const describedBy = (f: keyof typeof err) => (err[f] ? `e-${f}` : undefined);

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
                {contacts.phones.map((p) => (
                  <a key={p.href} href={p.href} className="py-1 text-lg font-semibold">
                    {p.label}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Почта</dt>
              <dd>
                <a href={`mailto:${contacts.email}`} className="link-accent">
                  {contacts.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Адрес</dt>
              <dd>
                <MapLink query={contacts.mapQuery} className="underline decoration-line underline-offset-4 hover:text-accent-text">
                  {contacts.address}
                </MapLink>
              </dd>
            </div>
          </dl>
        </div>

        {/* key меняется с каждой отправкой: после авто-сброса React форма заново берёт введённые значения из defaultValue */}
        <form
          key={state.submission ?? 0}
          ref={formRef}
          action={action}
          noValidate
          aria-describedby="lead-status"
          className="relative col-span-12 flex flex-col gap-5 rounded-card border border-line bg-surface p-6 md:p-8 lg:col-span-6 lg:col-start-7"
        >
          <p className="text-sm text-muted">Все поля, кроме сообщения, обязательны.</p>
          <div className="flex flex-col gap-2">
            <label htmlFor="lead-name" className="text-sm font-medium text-muted">
              Имя
            </label>
            <input
              id="lead-name"
              name="name"
              autoComplete="name"
              required
              defaultValue={v?.name}
              className="field"
              aria-invalid={!!err.name}
              aria-describedby={describedBy('name')}
            />
            {err.name ? (
              <p id="e-name" className="text-sm text-accent-text">
                {err.name}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lead-phone" className="text-sm font-medium text-muted">
              Телефон
            </label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 700 000 00 00"
              required
              defaultValue={v?.phone}
              className="field"
              aria-invalid={!!err.phone}
              aria-describedby={describedBy('phone')}
            />
            {err.phone ? (
              <p id="e-phone" className="text-sm text-accent-text">
                {err.phone}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lead-message" className="text-sm font-medium text-muted">
              Сообщение <span className="font-normal">(необязательно)</span>
            </label>
            <textarea
              id="lead-message"
              name="message"
              rows={4}
              defaultValue={v?.message}
              className="field"
              aria-invalid={!!err.message}
              aria-describedby={describedBy('message')}
            />
            {err.message ? (
              <p id="e-message" className="text-sm text-accent-text">
                {err.message}
              </p>
            ) : null}
          </div>
          {/* Honeypot: скрыт от людей и скринридеров */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="lead-hp">Не заполняйте это поле</label>
            <input id="lead-hp" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="consent"
                required
                defaultChecked={v?.consent}
                className="mt-1 size-5 shrink-0 accent-[var(--accent)]"
                aria-invalid={!!err.consent}
                aria-describedby={describedBy('consent')}
              />
              <span>
                Я согласен с{' '}
                <a href="/privacy" target="_blank" className="link-accent underline underline-offset-4">
                  обработкой персональных данных
                </a>
              </span>
            </label>
            {err.consent ? (
              <p id="e-consent" className="text-sm text-accent-text">
                {err.consent}
              </p>
            ) : null}
          </div>
          <button type="submit" disabled={pending} className="btn btn-primary self-stretch disabled:opacity-70 sm:self-start">
            {pending ? 'Отправляем…' : 'Отправить заявку'}
          </button>
          <p id="lead-status" role="status" aria-live="polite" className="min-h-6 text-sm">
            {state.status !== 'idle' ? state.message : ''}
            {state.status === 'not-configured' ? (
              <>
                {' '}
                <a href={contacts.phones[0].href} className="link-accent">
                  {contacts.phones[0].label}
                </a>
              </>
            ) : null}
          </p>
        </form>
      </div>
    </section>
  );
}
