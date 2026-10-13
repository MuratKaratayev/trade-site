import { z } from 'zod';

const digits = (s: string) => s.replace(/\D/g, '');

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Укажите имя').max(100, 'Слишком длинное имя'),
  phone: z
    .string()
    .trim()
    .refine((v) => digits(v).length >= 10 && digits(v).length <= 15, 'Укажите телефон, например +7 701 000 00 00'),
  message: z.string().trim().max(2000, 'Не больше 2000 символов').optional().default(''),
  consent: z.literal('on', { message: 'Нужно согласие на обработку персональных данных' }),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type { LeadValues, LeadState } from './lead-types';
export { HONEYPOT_FIELD } from './lead-types';
