/* ==========================================================================
   Deterministic geometry helpers for the illustration system:
   contour rings (topographic hills), furrow rows and smooth curves.
   Everything is seeded so server and client render identical paths.
   ========================================================================== */

export type Pt = readonly [number, number];

/** Small, fast seeded PRNG (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One decimal is sub-pixel at every size the illustrations are drawn; it keeps inline SVG small. */
const r2 = (n: number) => Math.round(n * 10) / 10;

/** Smooth closed path through points (Catmull-Rom converted to cubic Béziers). */
export function closedCurve(points: Pt[], tension = 1): string {
  const n = points.length;
  if (n < 3) return "";
  const p = (i: number) => points[((i % n) + n) % n]!;
  let d = `M${r2(p(0)[0])} ${r2(p(0)[1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = p(i - 1);
    const p1 = p(i);
    const p2 = p(i + 1);
    const p3 = p(i + 2);
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += `C${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(p2[0])} ${r2(p2[1])}`;
  }
  return d + "Z";
}

/** Smooth open path through points. */
export function openCurve(points: Pt[], tension = 1): string {
  const n = points.length;
  if (n < 2) return "";
  const p = (i: number) => points[Math.max(0, Math.min(n - 1, i))]!;
  let d = `M${r2(p(0)[0])} ${r2(p(0)[1])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = p(i - 1);
    const p1 = p(i);
    const p2 = p(i + 1);
    const p3 = p(i + 2);
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension;
    d += `C${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(p2[0])} ${r2(p2[1])}`;
  }
  return d;
}

export interface Hill {
  /** Centre of the hill. */
  cx: number;
  cy: number;
  /** Radius of the outermost ring. */
  r: number;
  /** Number of rings. */
  levels: number;
  /** Horizontal stretch (1 = round). */
  stretch?: number;
  /** Ring wobble, 0 to ~0.35. */
  wobble?: number;
  seed?: number;
  /** Shifts inner rings towards a peak offset, for an asymmetric summit. */
  peak?: Pt;
}

/**
 * Concentric, organically distorted rings that read like a topographic map.
 * Returns one closed path per level, outermost first.
 */
export function contourRings(hill: Hill): string[] {
  const { cx, cy, r, levels, stretch = 1.4, wobble = 0.18, seed = 1, peak = [0, 0] } = hill;
  const rand = rng(seed);
  // A few low-frequency harmonics shared by every ring, drifting with depth.
  const harmonics = Array.from({ length: 4 }, (_, k) => ({
    k: k + 2,
    amp: wobble * (0.55 + rand() * 0.45) / (k + 1),
    phase: rand() * Math.PI * 2,
    drift: (rand() - 0.5) * 1.6,
  }));
  const rings: string[] = [];
  const steps = 40;
  for (let level = 0; level < levels; level++) {
    const t = level / levels; // 0 outermost
    const rr = r * (1 - t * 0.92);
    const ox = cx + peak[0] * t;
    const oy = cy + peak[1] * t;
    const pts: Pt[] = [];
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      let f = 1;
      for (const h of harmonics) f += h.amp * Math.sin(h.k * a + h.phase + h.drift * t) * (1 - t * 0.4);
      pts.push([ox + Math.cos(a) * rr * f * stretch, oy + Math.sin(a) * rr * f]);
    }
    rings.push(closedCurve(pts));
  }
  return rings;
}

export interface FurrowOptions {
  width: number;
  height: number;
  rows: number;
  /** Vertical position of the horizon (rows converge here). */
  horizon: number;
  /** x of the vanishing point. */
  vanishX?: number;
  /** Bend of the rows (a gentle hill). */
  bend?: number;
}

/** Ploughed-field rows converging on a vanishing point. One open path per row. */
export function furrowRows({ width, height, rows, horizon, vanishX = width / 2, bend = 0 }: FurrowOptions): string[] {
  const out: string[] = [];
  const spread = width * 1.8;
  for (let i = 0; i <= rows; i++) {
    const t = i / rows;
    const bx = width / 2 - spread / 2 + t * spread;
    const mx = (bx + vanishX) / 2 + bend * (t - 0.5) * 2 * (1 - Math.abs(t - 0.5));
    const my = horizon + (height - horizon) * 0.45;
    out.push(openCurve([[vanishX, horizon], [mx, my], [bx, height + 4]]));
  }
  return out;
}

/** Horizontal wavy line across a width, for terraces and water. */
export function waveLine(y: number, width: number, amp: number, freq: number, phase = 0, x0 = 0, steps = 14): string {
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = x0 + (i / steps) * width;
    pts.push([x, y + Math.sin((i / steps) * Math.PI * 2 * freq + phase) * amp]);
  }
  return openCurve(pts);
}

/** Closed band below a wave (a hill or terrace silhouette filled to the bottom). */
export function hillShape(
  y: number,
  width: number,
  height: number,
  amp: number,
  freq: number,
  phase = 0,
  x0 = 0,
): string {
  const top = waveLine(y, width, amp, freq, phase, x0);
  return `${top}L${r2(x0 + width)} ${r2(height)}L${r2(x0)} ${r2(height)}Z`;
}

/** Ridge silhouette from explicit peak points, filled to `bottom`. */
export function ridge(points: Pt[], bottom: number): string {
  const first = points[0]!;
  const last = points[points.length - 1]!;
  return `${openCurve(points, 0.85)}L${r2(last[0])} ${r2(bottom)}L${r2(first[0])} ${r2(bottom)}Z`;
}

/** Points on a circle, handy for rays, petals and stars. */
export function polar(cx: number, cy: number, r: number, angleDeg: number): Pt {
  const a = (angleDeg * Math.PI) / 180;
  return [r2(cx + Math.cos(a) * r), r2(cy + Math.sin(a) * r)];
}
