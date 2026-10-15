// Типы и константы формы заявки БЕЗ zod: этот модуль импортирует клиентский компонент формы,
// а zod (~400 КБ) должен оставаться только на сервере.

export type LeadValues = { name: string; phone: string; message: string; consent: boolean };

export type LeadState = {
  status: 'idle' | 'error' | 'success' | 'failed';
  message?: string;
  fieldErrors?: Partial<Record<'name' | 'phone' | 'message' | 'consent', string>>;
  // React 19 сбрасывает форму после action — возвращаем введённое, чтобы оно не терялось при ошибке
  values?: LeadValues;
  // Счётчик отправок: меняет key формы, чтобы defaultValue применились заново
  submission?: number;
};

// Имя honeypot-поля: не похоже на реальные поля, чтобы браузер и менеджеры паролей его не автозаполняли
export const HONEYPOT_FIELD = 'hp_extra_field_7';
