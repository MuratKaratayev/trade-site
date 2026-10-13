import 'server-only';
import type { LeadInput } from './lead-schema';

/**
 * Хранилище заявок. Пока НЕ подключено (решение владельца: «пока без Supabase»).
 * Когда подключим Supabase: insert в таблицу leads с service role key из env, только на сервере.
 */
export async function saveLead(_lead: LeadInput & { source: string }): Promise<'saved' | 'not-configured'> {
  return 'not-configured';
}
