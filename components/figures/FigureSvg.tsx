'use client';

import type { PointerEvent } from 'react';
import { VIEWBOX, type Hit, type Solid } from './iso';

type Props = {
  label: string;
  solids: Solid[];
  hits: Hit[];
  onActivate: (index: number | null) => void;
};

/**
 * Рисует грани (solids) и поверх — невидимые статичные зоны (hits).
 * События висят только на статичных зонах, не на движущихся гранях — иначе дребезг.
 * Мышь/перо: наведение. Тач: касание (повторное касание фона — сброс).
 */
export function FigureSvg({ label, solids, hits, onActivate }: Props) {
  const isTouch = (e: PointerEvent) => e.pointerType === 'touch';

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      role="img"
      aria-label={label}
      className="block h-auto w-full select-none"
      style={{ strokeLinejoin: 'round', touchAction: 'manipulation' }}
      onPointerLeave={(e) => {
        if (!isTouch(e)) onActivate(null);
      }}
      onPointerDown={(e) => {
        if (isTouch(e) && e.target === e.currentTarget) onActivate(null);
      }}
    >
      <g pointerEvents="none">
        {solids.map((p, i) => (
          <polygon
            key={i}
            points={p.pts}
            fill={p.fill}
            stroke={p.stroke}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
      {hits.map((h) => (
        <polygon
          key={h.index}
          points={h.pts}
          fill="transparent"
          stroke="none"
          onPointerEnter={(e) => {
            if (!isTouch(e)) onActivate(h.index);
          }}
          onPointerDown={(e) => {
            if (isTouch(e)) onActivate(h.index);
          }}
        />
      ))}
    </svg>
  );
}
