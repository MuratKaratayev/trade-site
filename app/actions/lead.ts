'use server';

import { leadSchema, type LeadState } from '@/lib/lead-schema';
import { saveLead } from '@/lib/leads';

export async function submitLead(_prev: LeadState, form: FormData): Promise<LeadState> {
  // Honeypot: люди это поле не видят и не заполняют
  if (String(form.get('website') ?? '').trim() !== '') {
    return { status: 'success', message: 'Спасибо! Заявка принята.' };
  }

  const parsed = leadSchema.safeParse({
    name: form.get('name') ?? '',
    phone: form.get('phone') ?? '',
    message: form.get('message') ?? '',
    consent: form.get('consent') ?? undefined,
  });

  if (!parsed.success) {
    const fieldErrors: LeadState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<LeadState['fieldErrors']>;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: 'error', message: 'Проверьте поля формы.', fieldErrors };
  }

  const result = await saveLead({ ...parsed.data, source: 'site-form' });
  if (result === 'not-configured') {
    return {
      status: 'not-configured',
      message: 'Приём заявок через сайт ещё не подключён — заявка не сохранена. Позвоните или напишите нам напрямую.',
    };
  }
  return { status: 'success', message: 'Спасибо! Заявка принята, мы свяжемся с вами.' };
}
