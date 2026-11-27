import { contourRings, furrowRows, polar, type Hill } from "@/lib/geometry";

/* ==========================================================================
   Illustration primitives. Server-safe (no hooks, no state): compose them
   inside any <svg>. See DESIGN.md › Illustration for the rules.
   ========================================================================== */

interface StrokeProps {
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  className?: string;
}

/** Topographic rings for one or more hills. */
export function Contours({
  hills,
  stroke = "currentColor",
  strokeWidth = 1,
  opacity = 1,
  className,
}: StrokeProps & { hills: Hill[] }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} className={className}>
      {hills.flatMap((hill, h) =>
        contourRings(hill).map((d, i) => <path key={`${h}-${i}`} d={d} vectorEffect="non-scaling-stroke" />),
      )}
    </g>
  );
}

/** Ploughed rows converging on the horizon. */
export function Furrows({
  width,
  height,
  rows,
  horizon,
  vanishX,
  bend,
  stroke = "currentColor",
  strokeWidth = 1.5,
  opacity = 1,
  className,
}: StrokeProps & { width: number; height: number; rows: number; horizon: number; vanishX?: number; bend?: number }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} className={className} strokeLinecap="round">
      {furrowRows({ width, height, rows, horizon, vanishX, bend }).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

/** Sun or moon disc with optional ray rings. */
export function Sun({
  cx,
  cy,
  r,
  fill,
  rings = 0,
  ringStroke,
  ringGap = 10,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  rings?: number;
  ringStroke?: string;
  ringGap?: number;
}) {
  return (
    <g>
      {Array.from({ length: rings }, (_, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r + ringGap * (i + 1)}
          fill="none"
          stroke={ringStroke ?? fill}
          strokeWidth={1.2}
          opacity={0.55 - i * 0.12}
        />
      ))}
      <circle cx={cx} cy={cy} r={r} fill={fill} />
    </g>
  );
}

/** Crescent moon. */
export function Crescent({ cx, cy, r, fill, bite = 0.42 }: { cx: number; cy: number; r: number; fill: string; bite?: number }) {
  const d = `M${cx} ${cy - r}A${r} ${r} 0 1 0 ${cx} ${cy + r}A${r * (1 - bite * 0.2)} ${r} 0 1 1 ${cx} ${cy - r}Z`;
  return <path d={d} fill={fill} transform={`rotate(-28 ${cx} ${cy})`} />;
}

/** Five-petal blossom (jasmine, coffee flower). */
export function Blossom({
  cx,
  cy,
  r,
  petal = "#fffaf0",
  center = "#e9b949",
  rotate = 0,
}: {
  cx: number;
  cy: number;
  r: number;
  petal?: string;
  center?: string;
  rotate?: number;
}) {
  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`}>
      {[0, 72, 144, 216, 288].map((a) => {
        const [tx, ty] = polar(cx, cy, r * 0.62, a - 90);
        return <ellipse key={a} cx={tx} cy={ty} rx={r * 0.34} ry={r * 0.58} fill={petal} transform={`rotate(${a} ${tx} ${ty})`} />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.2} fill={center} />
    </g>
  );
}

/** A coffee cherry cluster on a stem. */
export function Cherries({
  x,
  y,
  scale = 1,
  fill = "#b4412f",
  highlight = "#f4ecdf",
  stem = "#4b5a32",
}: {
  x: number;
  y: number;
  scale?: number;
  fill?: string;
  highlight?: string;
  stem?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0C6 14 4 26 -6 38M0 0C10 10 18 22 20 34" fill="none" stroke={stem} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M2 2C14 -6 28 -4 34 4C24 10 12 10 2 2Z" fill={stem} />
      {[
        [-8, 46, 10],
        [21, 42, 9.5],
      ].map(([cx, cy, r]) => (
        <g key={`${cx}`}>
          <circle cx={cx} cy={cy} r={r} fill={fill} />
          <ellipse cx={(cx ?? 0) - 3.5} cy={(cy ?? 0) - 3.5} rx={2.6} ry={1.8} fill={highlight} opacity={0.75} />
        </g>
      ))}
    </g>
  );
}

/** Small scattered stars for night skies, deterministic. */
export function Stars({
  points,
  fill,
}: {
  points: Array<[number, number, number?]>;
  fill: string;
}) {
  return (
    <g fill={fill}>
      {points.map(([x, y, r = 1.1], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

/** Coffee bean silhouette with a centre crease, for scatter and patterns. */
export function Bean({
  x,
  y,
  r = 8,
  rotate = 0,
  fill,
  crease,
}: {
  x: number;
  y: number;
  r?: number;
  rotate?: number;
  fill: string;
  crease: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <ellipse rx={r * 0.72} ry={r} fill={fill} />
      <path
        d={`M${-r * 0.08} ${-r * 0.92}C${r * 0.42} ${-r * 0.35} ${-r * 0.42} ${r * 0.35} ${r * 0.08} ${r * 0.92}`}
        fill="none"
        stroke={crease}
        strokeWidth={r * 0.16}
        strokeLinecap="round"
      />
    </g>
  );
}
