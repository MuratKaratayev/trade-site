// Движок изометрических фигур. Геометрия и константы перенесены 1:1 из скрипта
// брендбука «03 · Моушн» (Brand-03-Motion.dc.html). Цвета — CSS-токены, а не хекс.

export const FALLOFF = [1, 0.31, 0.09] as const; // сила по кольцам от элемента под курсором
export const STAGGER = 50; // мс на кольцо
export const DURATION = 600; // мс, вход и возврат

/** cubic-bezier → функция прогресса (бинарный поиск по x, как в брендбуке) */
function makeBezier(x1: number, y1: number, x2: number, y2: number) {
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let t = x;
    for (let i = 0; i < 26; i++) {
      t = (lo + hi) / 2;
      const cx = 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
      if (cx < x) lo = t;
      else hi = t;
    }
    return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
  };
}
export const EASE = makeBezier(0.32, 0.72, 0, 1);

export type Grid = { s: number; ox: number; oy: number };
type Pt = [number, number];

/** X = ox + (x − y)·cos30°·s, Y = oy + (x + y)·sin30°·s − z·s */
export function iso(x: number, y: number, z: number, g: Grid): Pt {
  return [g.ox + (x - y) * 0.8660254 * g.s, g.oy + (x + y) * 0.5 * g.s - z * g.s];
}

export function pts(a: Pt[]): string {
  return a.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
}

/** Видимые грани коробки: left (y = y+d), right (x = x+w), top */
export function faces(x: number, y: number, z: number, w: number, d: number, h: number, g: Grid) {
  const z1 = z + h;
  return {
    left: pts([iso(x, y + d, z, g), iso(x + w, y + d, z, g), iso(x + w, y + d, z1, g), iso(x, y + d, z1, g)]),
    right: pts([iso(x + w, y, z, g), iso(x + w, y + d, z, g), iso(x + w, y + d, z1, g), iso(x + w, y, z1, g)]),
    top: pts([iso(x, y, z1, g), iso(x + w, y, z1, g), iso(x + w, y + d, z1, g), iso(x, y + d, z1, g)]),
  };
}

/** Выпуклая оболочка коробки в покое — статичная зона наведения (без дребезга) */
export function hull(x: number, y: number, z: number, w: number, d: number, h: number, g: Grid): string {
  const p: Pt[] = [];
  for (const a of [0, w]) for (const b of [0, d]) for (const c of [0, h]) p.push(iso(x + a, y + b, z + c, g));
  p.sort((m, n) => m[0] - n[0] || m[1] - n[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [];
  const upper: Pt[] = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  upper.pop();
  lower.pop();
  return pts(lower.concat(upper));
}

// Цвета фигур — только токены
export const C = {
  face: 'var(--surface)',
  figure: 'var(--figure)',
  dim: 'var(--figure-dim)',
  hot: 'var(--accent-text)',
  hotFill: 'var(--figure-hot)',
} as const;

export type Solid = { pts: string; fill: string; stroke: string };
export type Hit = { pts: string; index: number };

export function pushBox(
  list: Solid[],
  f: ReturnType<typeof faces>,
  fill: string,
  stroke: string,
  topFill?: string,
  topStroke?: string,
) {
  list.push({ pts: f.left, fill, stroke });
  list.push({ pts: f.right, fill, stroke });
  list.push({ pts: f.top, fill: topFill ?? fill, stroke: topStroke ?? stroke });
}

/** Амплитуда: m = 0.35 + 1.1 · intensity (как в брендбуке) */
export const amplitude = (intensity: number) => 0.35 + 1.1 * Math.min(1, Math.max(0, intensity));

/** Размер холста всех трёх фигур в брендбуке */
export const VIEWBOX = { w: 458, h: 420 };
