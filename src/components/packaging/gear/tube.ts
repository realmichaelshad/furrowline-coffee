/* ==========================================================================
   Geometry for the gear illustrations: tubes (spouts, handles, straps) drawn
   as filled outlines along a chain of cubic Béziers, with an optional taper,
   plus the light-facing offset lines used for highlights and rim light.
   Light comes from the upper left, as on the coffee bags.
   ========================================================================== */

export type Pt = readonly [number, number];
export type Cubic = readonly [Pt, Pt, Pt, Pt];

/** Direction the light comes from (unit vector pointing towards it). */
const LIGHT: Pt = [-0.6, -0.8];

function at(c: Cubic, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return [a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0], a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1]];
}

/** Evenly spaced (in t) points along a chain of cubics; joints are not repeated. */
export function sample(chain: readonly Cubic[], perSegment = 28): Pt[] {
  const pts: Pt[] = [];
  chain.forEach((c, s) => {
    for (let i = s === 0 ? 0 : 1; i <= perSegment; i++) pts.push(at(c, i / perSegment));
  });
  return pts;
}

/** Unit normals (left of travel) for each point. */
function normals(pts: readonly Pt[]): Pt[] {
  return pts.map((_, i) => {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(pts.length - 1, i + 1)]!;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    return [-dy / len, dx / len] as Pt;
  });
}

const fmt = (p: Pt) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

/** Width at fraction `t` (0 = start, 1 = end) of a tube tapering linearly from w0 to w1. */
const widthAt = (w0: number, w1: number, t: number) => w0 + (w1 - w0) * t;

/** Closed outline of a tube along `pts`, tapering from w0 to w1. */
export function tubePath(pts: readonly Pt[], w0: number, w1 = w0): string {
  const n = normals(pts);
  const last = pts.length - 1 || 1;
  const left = pts.map((p, i) => {
    const h = widthAt(w0, w1, i / last) / 2;
    return [p[0] + n[i]![0] * h, p[1] + n[i]![1] * h] as Pt;
  });
  const right = pts.map((p, i) => {
    const h = widthAt(w0, w1, i / last) / 2;
    return [p[0] - n[i]![0] * h, p[1] - n[i]![1] * h] as Pt;
  });
  return `M${left.map(fmt).join("L")}L${right.reverse().map(fmt).join("L")}Z`;
}

/**
 * A line running along the tube, shifted towards the light (`amount` > 0) or
 * away from it (< 0), as a fraction of the half-width. The shift follows how
 * squarely each part of the tube faces the light, so it never jumps sides.
 */
export function lightLine(pts: readonly Pt[], w0: number, w1: number, amount: number): string {
  const n = normals(pts);
  const last = pts.length - 1 || 1;
  const shifted = pts.map((p, i) => {
    const facing = n[i]![0] * LIGHT[0] + n[i]![1] * LIGHT[1];
    const h = (widthAt(w0, w1, i / last) / 2) * amount * facing;
    return [p[0] + n[i]![0] * h, p[1] + n[i]![1] * h] as Pt;
  });
  return `M${shifted.map(fmt).join("L")}`;
}

/** A plain polyline through offset points (fixed side), e.g. stitching along a strap. */
export function offsetLine(pts: readonly Pt[], offset: number): string {
  const n = normals(pts);
  return `M${pts.map((p, i) => fmt([p[0] + n[i]![0] * offset, p[1] + n[i]![1] * offset])).join("L")}`;
}

/** Deterministic pseudo-random numbers (Park-Miller), for speckles and fibres. */
export function seeded(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
