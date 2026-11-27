import { furrowRows, ridge, rng, waveLine } from "@/lib/geometry";
import { Sun } from "@/components/illustration/primitives";

/* ==========================================================================
   404 illustration: a ploughed field at dusk. The furrows run off the bottom
   and sides of the frame towards a low sun, but the ploughing stops partway
   up the field; one clay furrow (the brand's line) runs a little further and
   ends at a stake with a flag. Server-rendered SVG, decorative.
   Entrance is CSS only (not-found.css): the clay line opens from the bottom
   with a clip-path, the stake rises. Reduced motion shows the final frame.
   ========================================================================== */

const W = 1200;
const H = 520;
const HORIZON = 196;
const VANISH_X = 780;
const ROWS = 46;
/** Where the ploughing stops (a gentle wave across the field). */
const STOP = 330;
const LINE_ROW = 26;

/* Dusk sky in First Light's stage colour; the rest is the core palette. */
const C = {
  sky: "#efc3a4",
  sun: "#fbf7f0",
  far: "#a9b38c",
  near: "#4b5a32",
  soil: "#9b8670",
  fallow: "#e9ddc8",
  furrow: "#3a2a20",
  ridgeLight: "#e9ddc8",
  clay: "#a4472a",
  bark: "#5c4a3c",
  ochre: "#c88a2e",
  espresso: "#241913",
};

/** x of a straight furrow row at height y (rows are straight with bend 0). */
function rowX(t: number, y: number): number {
  const spread = W * 1.8;
  const bottomX = W / 2 - spread / 2 + t * spread;
  const k = (y - HORIZON) / (H + 4 - HORIZON);
  return VANISH_X + (bottomX - VANISH_X) * k;
}

export function FieldIllustration() {
  const rows = furrowRows({ width: W, height: H, rows: ROWS, horizon: HORIZON, vanishX: VANISH_X, bend: 0 });
  const stopEdge = waveLine(STOP, W + 80, 9, 1.6, 0.6, -40, 18);
  const ploughed = `${stopEdge}L${W + 40} ${H + 20}L-40 ${H + 20}Z`;
  const t = LINE_ROW / ROWS;
  const stakeY = STOP - 40;
  const stakeX = rowX(t, stakeY);
  const lineStartX = rowX(t, H + 4);
  const farRidge = ridge(
    [
      [-20, 160],
      [140, 134],
      [330, 152],
      [520, 118],
      [700, 150],
      [900, 128],
      [1060, 156],
      [1220, 138],
    ],
    HORIZON + 4,
  );
  const nearRidge = ridge(
    [
      [-20, 184],
      [180, 168],
      [420, 190],
      [640, 172],
      [880, 192],
      [1220, 174],
    ],
    HORIZON + 6,
  );
  // Grass tufts on the fallow ground, smaller towards the horizon (seeded, so server and client agree).
  const rand = rng(404);
  const tufts = Array.from({ length: 34 }, () => {
    const y = HORIZON + 14 + rand() * (STOP - HORIZON - 26);
    const k = 0.45 + ((y - HORIZON) / (STOP - HORIZON)) * 0.8;
    return { x: Math.round(rand() * W), y: Math.round(y), k: Math.round(k * 100) / 100 };
  });
  const birds: Array<[number, number, number]> = [
    [470, 62, 1],
    [502, 78, 0.8],
    [540, 58, 0.9],
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="nf-svg" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="nf-ploughed">
          <path d={ploughed} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill={C.sky} />
      <g className="nf-sun">
        <Sun cx={300} cy={160} r={58} fill={C.sun} rings={3} ringGap={18} ringStroke="#f4ecdf" />
      </g>
      {birds.map(([x, y, s]) => (
        <path
          key={x}
          d={`M${x - 9 * s} ${y - 4 * s}Q${x - 4 * s} ${y - 6 * s} ${x} ${y}Q${x + 4 * s} ${y - 6 * s} ${x + 9 * s} ${y - 4 * s}`}
          fill="none"
          stroke={C.bark}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ))}
      <path d={farRidge} fill={C.far} />
      <path d={nearRidge} fill={C.near} />

      {/* The field: fallow (unploughed) up top, ploughed rows below the wavy stop line */}
      <rect x="0" y={HORIZON} width={W} height={H - HORIZON} fill={C.fallow} />
      {[0.3, 0.55, 0.8].map((k, i) => (
        <path
          key={k}
          d={waveLine(HORIZON + (STOP - HORIZON) * k, W, 3 + i, 2.2, i, 0, 16)}
          fill="none"
          stroke={C.soil}
          strokeOpacity="0.5"
          strokeWidth="1"
        />
      ))}
      <g fill="none" stroke={C.near} strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round">
        {tufts.map((t) => (
          <path
            key={`${t.x}-${t.y}`}
            d={`M${t.x - 5 * t.k} ${t.y}l${2 * t.k} ${-7 * t.k}M${t.x} ${t.y}v${-9 * t.k}M${t.x + 5 * t.k} ${t.y}l${-2 * t.k} ${-7 * t.k}`}
          />
        ))}
      </g>
      <path d={ploughed} fill={C.soil} />
      <g clipPath="url(#nf-ploughed)" fill="none" strokeLinecap="round">
        {rows.map((d, i) => (
          <path key={i} d={d} stroke={C.furrow} strokeOpacity="0.5" strokeWidth="2.6" />
        ))}
        {rows.map((d, i) => (
          <path key={`h${i}`} d={d} stroke={C.ridgeLight} strokeOpacity="0.35" strokeWidth="1.2" transform="translate(4 0)" />
        ))}
      </g>
      <path d={stopEdge} fill="none" stroke={C.furrow} strokeOpacity="0.35" strokeWidth="1.4" strokeDasharray="2 7" strokeLinecap="round" />

      {/* The line that runs a little further, then stops */}
      <g className="nf-line">
        <path
          d={`M${lineStartX.toFixed(1)} ${H + 4}L${stakeX.toFixed(1)} ${stakeY + 6}`}
          fill="none"
          stroke={C.clay}
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
      <g transform={`translate(${stakeX.toFixed(1)} ${stakeY}) scale(1.35)`}>
        <g className="nf-stake">
          <ellipse cx="0" cy="8" rx="14" ry="3.5" fill={C.furrow} fillOpacity="0.3" />
          <rect x="-2.5" y="-62" width="5" height="70" rx="1.5" fill={C.bark} />
          <path d="M2.5 -60H58L48 -46L58 -32H2.5Z" fill={C.ochre} />
          <text x="26" y="-45.5" textAnchor="middle" dominantBaseline="middle" className="nf-flag-text">
            404
          </text>
        </g>
      </g>
    </svg>
  );
}
