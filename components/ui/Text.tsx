import { isPlaceholder } from '@/content/site';

/** Выводит строку; если это «[ОТ КЛИЕНТА: …]» — видимым плейсхолдером. */
export function Text({ children }: { children: string }) {
  if (isPlaceholder(children)) return <span className="placeholder">{children}</span>;
  return <>{children}</>;
}
