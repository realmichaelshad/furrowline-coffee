/* ==========================================================================
   Projective mapping of a flat w × h element onto a quadrilateral, as a CSS
   matrix3d(). The brand board uses it to "paint" the logo onto the timber
   fascia in the storefront photograph: the fascia's four corners were
   measured on the photo, and the lockup is warped to sit exactly on them.
   Apply with transform-origin: 0 0.
   ========================================================================== */

export type Point = readonly [number, number];
/** Corners in order: top-left, top-right, bottom-right, bottom-left. */
export type Quad = readonly [Point, Point, Point, Point];

/** 3 × 3 homography, row-major: [a, b, c, d, e, f, g, h] with the last entry fixed at 1. */
export type Homography = readonly [number, number, number, number, number, number, number, number];

/**
 * Homography that maps the rectangle (0,0)-(w,h) onto `quad`
 * (Heckbert's square-to-quad, pre-scaled by the rectangle size).
 */
export function rectToQuad(w: number, h: number, quad: Quad): Homography {
  if (w <= 0 || h <= 0) throw new Error("rectToQuad needs a positive size");
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;

  let g = 0;
  let k = 0;
  if (Math.abs(dx3) > 1e-12 || Math.abs(dy3) > 1e-12) {
    const den = dx1 * dy2 - dx2 * dy1;
    if (Math.abs(den) < 1e-12) throw new Error("Degenerate quad");
    g = (dx3 * dy2 - dx2 * dy3) / den;
    k = (dx1 * dy3 - dx3 * dy1) / den;
  }
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + k * x3;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + k * y3;
  // Unit square → quad, composed with rect → unit square (u = x / w, v = y / h).
  return [a / w, b / h, x0, d / w, e / h, y0, g / w, k / h];
}

/** Where the point (x, y) of the element lands. */
export function applyHomography(m: Homography, [x, y]: Point): [number, number] {
  const [a, b, c, d, e, f, g, h] = m;
  const wDen = g * x + h * y + 1;
  return [(a * x + b * y + c) / wDen, (d * x + e * y + f) / wDen];
}

const fmt = (n: number) => String(Math.round(n * 1e6) / 1e6);

/** CSS transform for the homography (column-major matrix3d). */
export function toMatrix3d(m: Homography): string {
  const [a, b, c, d, e, f, g, h] = m;
  return `matrix3d(${[a, d, 0, g, b, e, 0, h, 0, 0, 1, 0, c, f, 0, 1].map(fmt).join(", ")})`;
}

/** Convenience: the CSS transform that warps a w × h box onto `quad`. */
export function quadTransform(w: number, h: number, quad: Quad): string {
  return toMatrix3d(rectToQuad(w, h, quad));
}
