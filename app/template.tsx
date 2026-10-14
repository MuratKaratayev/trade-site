'use client';

import { useEffect, useState } from 'react';

// Плавное появление страницы при переходе внутри сайта. При первой загрузке анимации нет:
// иначе текст появлялся бы с задержкой и проседал LCP. На сервере window нет — всегда без анимации.
let hasMounted = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => typeof window !== 'undefined' && hasMounted);
  useEffect(() => {
    hasMounted = true;
  }, []);
  return <div className={animate ? 'page-enter' : undefined}>{children}</div>;
}
