import { HONEYPOT_FIELD, type LeadState, type LeadValues } from './lead-types';
import type { UI } from '@/content/ui';

type Messages = UI['validation'];

// Проверка формы заявки в браузере. Сайт собирается статикой для хостинга PS Cloud (нет Node.js),
// поэтому серверной функции Next.js нет. Правила — те же, что были в zod-схеме.
const digits = (s: string) => s.replace(/\D/g, '');

export function validateLead(form: FormData, m: Messages): { values: LeadValues; fieldErrors: NonNullable<LeadState['fieldErrors']>; bot: boolean } {
  const values: LeadValues = {
    name: String(form.get('name') ?? ''),
    phone: String(form.get('phone') ?? ''),
    message: String(form.get('message') ?? ''),
    consent: form.get('consent') === 'on',
  };
  const fieldErrors: NonNullable<LeadState['fieldErrors']> = {};
  const name = values.name.trim();
  if (name.length < 2) fieldErrors.name = m.name;
  else if (name.length > 100) fieldErrors.name = m.nameLong;
  const d = digits(values.phone).length;
  if (d < 10 || d > 15) fieldErrors.phone = m.phone;
  if (values.message.trim().length > 2000) fieldErrors.message = m.message;
  if (!values.consent) fieldErrors.consent = m.consent;
  // Honeypot: люди это поле не видят и не заполняют
  const bot = String(form.get(HONEYPOT_FIELD) ?? '').trim() !== '';
  return { values, fieldErrors, bot };
}

/**
 * Обработчик отправки (сообщения — на языке страницы). Приём заявок пока НЕ подключён (куда отправлять — решает
 * владелец), поэтому после проверки честно сообщаем об этом и показываем телефон.
 * Когда решение будет: отправлять FormData на PHP-обработчик на том же хостинге.
 */
export function makeSubmitLead(m: Messages) {
  return async function submitLead(prev: LeadState, form: FormData): Promise<LeadState> {
    const submission = (prev.submission ?? 0) + 1;
    const { values, fieldErrors, bot } = validateLead(form, m);
    if (bot) return { status: 'success', message: m.ok, submission };
    if (Object.keys(fieldErrors).length) {
      return { status: 'error', message: m.check, fieldErrors, values, submission };
    }
    return { status: 'not-configured', message: m.notConfigured, values, submission };
  };
}
