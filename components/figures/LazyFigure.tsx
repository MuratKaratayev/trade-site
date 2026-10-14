'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { VIEWBOX } from './iso';

/** Монтирует фигуру, только когда блок подходит к экрану (IntersectionObserver). */
export function LazyFigure({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ aspectRatio: `${VIEWBOX.w} / ${VIEWBOX.h}` }}>
      {shown ? children : null}
    </div>
  );
}
