'use client';

import { amplitude, C, faces, hull, iso, pts, pushBox, type Grid, type Hit, type Solid } from './iso';
import { FigureSvg } from './FigureSvg';
import { LazyFigure } from './LazyFigure';
import { useWave } from './useWave';

type FigureProps = { intensity?: number; className?: string };

// ── FIG 01 · Поле КИП: основание с сеткой 6×6 столбиков ──────────────
const N = 6;
const fieldDistance = (p: number, q: number) =>
  Math.max(Math.abs(Math.floor(p / N) - Math.floor(q / N)), Math.abs((p % N) - (q % N)));

function KipField({ intensity = 0.6 }: FigureProps) {
  const { values, activate } = useWave(N * N, fieldDistance);
  const m = amplitude(intensity);
  const g: Grid = { s: 26, ox: 229, oy: 150 };
  const solids: Solid[] = [];
  const hits: Hit[] = [];

  pushBox(solids, faces(-0.25, -0.25, -0.35, N + 0.5, N + 0.5, 0.35, g), C.face, C.dim);
  const cells: [number, number][] = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) cells.push([i, j]);
  // back-to-front по (x + y)
  cells.sort((a, b) => a[0] + a[1] - (b[0] + b[1]) || a[0] - b[0]);
  for (const [i, j] of cells) {
    const v = values[i * N + j];
    const h = 0.45 + v * 2.3 * m;
    const hot = v > 0.66;
    pushBox(solids, faces(i + 0.19, j + 0.19, 0, 0.62, 0.62, h, g), C.face, C.figure, hot ? C.hotFill : C.face, hot ? C.hot : C.figure);
  }
  for (let a = 0; a < N; a++)
    for (let b = 0; b < N; b++) hits.push({ pts: hull(a, b, 0, 1, 1, 0.45, g), index: a * N + b });

  return <FigureSvg label="Поле КИП: столбики датчиков поднимаются вокруг курсора" solids={solids} hits={hits} onActivate={activate} />;
}

// ── FIG 02 · DIN-рейка: 8 модулей контроллера ────────────────────────
const linear = (p: number, q: number) => Math.abs(p - q);

function DinRail({ intensity = 0.6 }: FigureProps) {
  const { values, activate } = useWave(8, linear);
  const m = amplitude(intensity);
  const g: Grid = { s: 24, ox: 160, oy: 200 };
  const solids: Solid[] = [];
  const hits: Hit[] = [];

  pushBox(solids, faces(-0.3, 0.2, -0.25, 8.4, 0.9, 0.25, g), C.face, C.dim);
  for (let i = 0; i < 8; i++) {
    const v = values[i];
    const x = i * 1.0 + 0.07;
    const y = 0;
    const w = 0.86;
    const d = 1.3;
    const z = 0.05 + v * 1.25 * m;
    const h = 1.8;
    pushBox(solids, faces(x, y, z, w, d, h, g), C.face, C.figure);
    solids.push({ pts: pts([iso(x + 0.14, y + d, z + 0.45, g), iso(x + w - 0.14, y + d, z + 0.45, g)]), fill: 'none', stroke: C.dim });
    solids.push({ pts: pts([iso(x + 0.14, y + d, z + 0.75, g), iso(x + w - 0.14, y + d, z + 0.75, g)]), fill: 'none', stroke: C.dim });
    const led = v > 0.2;
    solids.push({
      pts: pts([
        iso(x + 0.14, y + d, z + h - 0.22, g),
        iso(x + 0.3, y + d, z + h - 0.22, g),
        iso(x + 0.3, y + d, z + h - 0.38, g),
        iso(x + 0.14, y + d, z + h - 0.38, g),
      ]),
      fill: led ? C.hot : C.face,
      stroke: led ? C.hot : C.figure,
    });
    hits.push({ pts: hull(i * 1.0 + 0.07, 0, 0, 0.86, 1.3, 3.4, g), index: i });
  }

  return <FigureSvg label="DIN-рейка: модуль контроллера под курсором поднимается, индикатор загорается" solids={solids} hits={hits} onActivate={activate} />;
}

// ── FIG 03 · Стойка: открытая стойка с 6 полками ─────────────────────
function Rack({ intensity = 0.6 }: FigureProps) {
  const { values, activate } = useWave(6, linear);
  const m = amplitude(intensity);
  const g: Grid = { s: 38, ox: 250, oy: 290 };
  const solids: Solid[] = [];
  const hits: Hit[] = [];

  pushBox(solids, faces(-0.1, -0.1, -0.2, 2.4, 1.9, 0.2, g), C.face, C.dim);
  pushBox(solids, faces(0, 0, 0, 0.12, 0.12, 4.45, g), C.face, C.dim);
  pushBox(solids, faces(2.08, 0, 0, 0.12, 0.12, 4.45, g), C.face, C.dim);
  for (let k = 0; k < 6; k++) {
    const v = values[k];
    const z = 0.3 + k * 0.68;
    const out = v * 1.4 * m;
    const hot = v > 0.66;
    pushBox(solids, faces(0.15, 0.1 + out, z, 1.9, 1.5, 0.42, g), C.face, C.figure, hot ? C.hotFill : C.face, hot ? C.hot : C.figure);
    solids.push({ pts: pts([iso(0.95, 1.6 + out, z + 0.21, g), iso(1.25, 1.6 + out, z + 0.21, g)]), fill: 'none', stroke: hot ? C.hot : C.dim });
    hits.push({ pts: hull(0.15, 0.1, z, 1.9, 2.4, 0.68, g), index: k });
  }
  pushBox(solids, faces(-0.05, -0.05, 4.45, 2.3, 1.75, 0.1, g), C.face, C.dim);
  hits.reverse();

  return <FigureSvg label="Стойка: полки выдвигаются волной от курсора" solids={solids} hits={hits} onActivate={activate} />;
}

// Публичные компоненты: ленивое монтирование + пропсы
export function FigureKipField({ intensity, className }: FigureProps) {
  return (
    <LazyFigure className={className}>
      <KipField intensity={intensity} />
    </LazyFigure>
  );
}
export function FigureDinRail({ intensity, className }: FigureProps) {
  return (
    <LazyFigure className={className}>
      <DinRail intensity={intensity} />
    </LazyFigure>
  );
}
export function FigureRack({ intensity, className }: FigureProps) {
  return (
    <LazyFigure className={className}>
      <Rack intensity={intensity} />
    </LazyFigure>
  );
}
