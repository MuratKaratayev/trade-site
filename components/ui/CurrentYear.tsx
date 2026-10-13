'use client';

import { useEffect, useState } from 'react';

/** Год в копирайте: страница статическая, поэтому на клиенте подставляем текущий, а не год сборки. */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const [year, setYear] = useState(buildYear);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year}</>;
}
