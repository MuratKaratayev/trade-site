'use client';

import { useRef, type PointerEvent, type Ref } from 'react';
import { VIEWBOX, type Hit, type Solid } from './iso';

type Props = {
  label: string;
  solids: Solid[];
  hits: Hit[];
  onActivate: (index: number | null) => void;
  svgRef?: Ref<SVGSVGElement>;
};

/**
 * Рисует грани (solids) и поверх — невидимые статичные зоны (hits).
 * События висят только на статичных зонах, не на движущихся гранях — иначе дребезг.
 * Мышь/перо: наведение. Проверяется весь отрезок между двумя событиями мыши (шаг SWEEP px): при быстром
 * движении курсор за кадр перепрыгивает узкие элементы, и pointerenter по ним не приходит. На тач-экранах касания игнорируются — там волной управляет прокрутка
 * (useScrollWave), иначе фигура дёргается от случайных касаний при листании.
 */
const SWEEP = 3;

export function FigureSvg({ label, solids, hits, onActivate, svgRef }: Props) {
  const isTouch = (e: PointerEvent) => e.pointerType === 'touch';
  const last = useRef<{ x: number; y: number } | null>(null);
  const current = useRef<number | null>(null);

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (isTouch(e)) return;
    const to = { x: e.clientX, y: e.clientY };
    const from = last.current ?? to;
    last.current = to;
    const n = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / SWEEP));
    for (let i = 1; i <= n; i++) {
      const el = document.elementFromPoint(from.x + ((to.x - from.x) * i) / n, from.y + ((to.y - from.y) * i) / n);
      if (el?.parentNode !== e.currentTarget || !(el instanceof SVGElement) || el.dataset.hit == null) continue;
      const idx = Number(el.dataset.hit);
      if (idx !== current.current) {
        current.current = idx;
        onActivate(idx);
      }
    }
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      role="img"
      aria-label={label}
      className="block h-auto w-full select-none"
      style={{ strokeLinejoin: 'round' }}
      onPointerMove={onPointerMove}
      onPointerLeave={(e) => {
        if (isTouch(e)) return;
        last.current = current.current = null;
        onActivate(null);
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
          data-hit={h.index}
        />
      ))}
    </svg>
  );
}
