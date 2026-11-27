import { useId } from "react";
import type { GearArtKey } from "@/content/products";
import { Contours, Furrows } from "@/components/illustration/primitives";
import { MARK_BOX, MARK_D } from "@/components/brand/mark-data";
import { lightLine, offsetLine, sample, seeded, tubePath, type Cubic } from "./tube";

/* ==========================================================================
   Product illustrations for brewing gear and merch, drawn on the same
   320 × 460 canvas as the coffee bags (objects stand on y ≈ 430) so grids
   and stages line up. Modelled to the same level as the bags: cylinder
   shading with a key highlight on the left and reflected light on the right,
   real material cues (glazed speckled stoneware, glass, matte steel and
   brass, walnut grain, knurling, enamel with a rolled rim, woven canvas with
   sewn webbing), and occlusion where parts meet.
   Variant swatches (mug, dripper) recolour the body.
   ========================================================================== */

const INK = "#241913";
const PARCHMENT = "#f4ecdf";
const CLAY = "#a4472a";
const BRASS = ["#7a5520", "#e2bd72", "#b8893f", "#6a4718"] as const;
const WALNUT = ["#2e180c", "#8f5a37", "#6b3f26", "#3a2010"] as const;

function Floor({ id, rx = 120 }: { id: string; rx?: number }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-floor`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={INK} stopOpacity="0.38" />
          <stop offset="1" stopColor={INK} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="436" rx={rx} ry="13" fill={`url(#${id}-floor)`} />
    </>
  );
}

function Mark({ x, y, h, fill, opacity }: { x: number; y: number; h: number; fill: string; opacity?: number }) {
  const s = h / MARK_BOX.height;
  return (
    <path
      d={MARK_D}
      fill={fill}
      opacity={opacity}
      transform={`translate(${x} ${y}) scale(${s}) translate(${-MARK_BOX.x} ${-MARK_BOX.y})`}
    />
  );
}

/** Horizontal cylinder light: dark left edge, key highlight, falloff, reflected light, dark right edge. */
function CylinderShade({ id, strength = 1 }: { id: string; strength?: number }) {
  const k = (v: number) => Math.min(1, v * strength);
  return (
    <linearGradient id={id} x1="0" x2="1">
      <stop offset="0" stopColor="#000" stopOpacity={k(0.42)} />
      <stop offset="0.08" stopColor="#000" stopOpacity={k(0.12)} />
      <stop offset="0.2" stopColor="#fff" stopOpacity={k(0.26)} />
      <stop offset="0.3" stopColor="#fff" stopOpacity={k(0.06)} />
      <stop offset="0.62" stopColor="#000" stopOpacity={k(0.06)} />
      <stop offset="0.84" stopColor="#000" stopOpacity={k(0.24)} />
      <stop offset="0.93" stopColor="#fff" stopOpacity={k(0.08)} />
      <stop offset="1" stopColor="#000" stopOpacity={k(0.45)} />
    </linearGradient>
  );
}

function WoodGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" x2="1">
      <stop offset="0" stopColor={WALNUT[0]} />
      <stop offset="0.22" stopColor={WALNUT[1]} />
      <stop offset="0.5" stopColor={WALNUT[2]} />
      <stop offset="0.86" stopColor={WALNUT[3]} />
      <stop offset="0.94" stopColor="#5a3420" />
      <stop offset="1" stopColor={WALNUT[0]} />
    </linearGradient>
  );
}

function BrassGradient({ id, vertical = false }: { id: string; vertical?: boolean }) {
  return (
    <linearGradient id={id} x1="0" x2={vertical ? "0" : "1"} y1="0" y2={vertical ? "1" : "0"}>
      <stop offset="0" stopColor={BRASS[0]} />
      <stop offset="0.3" stopColor={BRASS[1]} />
      <stop offset="0.6" stopColor={BRASS[2]} />
      <stop offset="1" stopColor={BRASS[3]} />
    </linearGradient>
  );
}

/** Soft blur for speculars and occlusion. */
function Blur({ id, s }: { id: string; s: number }) {
  return (
    <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation={s} />
    </filter>
  );
}

/** A walnut tube (handle, knob arm) with grain-coloured core, key highlight and rim light. */
function WoodTube({ id, chain, w0, w1 = w0 }: { id: string; chain: Cubic[]; w0: number; w1?: number }) {
  const pts = sample(chain);
  return (
    <g>
      <path d={tubePath(pts, w0, w1)} fill={WALNUT[3]} />
      <path d={tubePath(pts, w0 * 0.72, w1 * 0.72)} fill={`url(#${id})`} opacity="0.9" />
      <path d={lightLine(pts, w0, w1, 0.5)} fill="none" stroke="#c99a72" strokeOpacity="0.55" strokeWidth={w0 * 0.16} strokeLinecap="round" />
      <path d={lightLine(pts, w0, w1, 0.62)} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth={w0 * 0.06} strokeLinecap="round" />
      <path d={lightLine(pts, w0, w1, -0.82)} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth={w0 * 0.14} strokeLinecap="round" />
    </g>
  );
}

/* ---- Contour Ceramic Dripper -------------------------------------------- */

const CARAFE = "M112 272C94 306 86 362 98 404C104 422 120 430 140 430H180C200 430 216 422 222 404C234 362 226 306 208 272Z";
const CONE = "M68 134C74 170 104 214 134 240H186C216 214 246 170 252 134Z";

function Dripper({ id, body }: { id: string; body: string }) {
  const dark = isDark(body);
  const speck = dark ? "#3a1a10" : "#5a4636";
  const rand = seeded(29);
  const specks = Array.from({ length: 90 }, () => ({ x: 70 + rand() * 180, y: 128 + rand() * 136, r: 0.45 + rand() * 0.9, o: 0.25 + rand() * 0.4 }));
  // Spiral ribs: evenly spaced around the cone, foreshortened towards the sides, twisting as they fall.
  const ribs = Array.from({ length: 15 }, (_, i) => {
    const a = (-78 + (i * 156) / 14) * (Math.PI / 180);
    const b = a + 0.32;
    const x1 = 160 + 90 * Math.sin(a);
    const y1 = 140 + 10 * Math.cos(a);
    const x2 = 160 + 26 * Math.sin(Math.max(-1.45, Math.min(1.45, b)));
    return { x1, y1, x2, y2: 238, edge: Math.abs(Math.sin(a)) };
  });
  const handle = sample([
    [
      [244, 152],
      [272, 148],
      [286, 168],
      [276, 190],
    ],
    [
      [276, 190],
      [270, 204],
      [254, 208],
      [238, 202],
    ],
  ]);
  const handleGlass = sample([
    [
      [220, 302],
      [252, 300],
      [258, 322],
      [254, 344],
    ],
    [
      [254, 344],
      [250, 366],
      [238, 378],
      [224, 380],
    ],
  ]);
  return (
    <>
      <defs>
        <CylinderShade id={`${id}-cyl`} />
        <CylinderShade id={`${id}-cyl-soft`} strength={0.6} />
        <linearGradient id={`${id}-coffee`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6e4026" />
          <stop offset="0.25" stopColor="#4a2816" />
          <stop offset="1" stopColor="#24120a" />
        </linearGradient>
        <radialGradient id={`${id}-crema`} cx="0.42" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#8c5a34" />
          <stop offset="0.7" stopColor="#5e3620" />
          <stop offset="1" stopColor="#a87648" />
        </radialGradient>
        <linearGradient id={`${id}-inside`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.34" />
          <stop offset="1" stopColor="#000" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id={`${id}-depth`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="0.75" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <clipPath id={`${id}-carafe`}>
          <path d={CARAFE} />
        </clipPath>
        <clipPath id={`${id}-cone`}>
          <path d={CONE} />
        </clipPath>
        <clipPath id={`${id}-mouth`}>
          <ellipse cx="160" cy="134" rx="81" ry="10.5" />
        </clipPath>
        <Blur id={`${id}-b1`} s={1.2} />
        <Blur id={`${id}-b3`} s={3} />
      </defs>

      {/* Glass server: coffee, refraction-dark edges, highlights, handle */}
      <g clipPath={`url(#${id}-carafe)`}>
        <rect x="80" y="352" width="160" height="90" fill={`url(#${id}-coffee)`} />
        <ellipse cx="160" cy="352" rx="70" ry="8" fill={`url(#${id}-crema)`} />
        <rect x="80" y="262" width="160" height="180" fill={`url(#${id}-cyl)`} opacity="0.55" />
        <path d="M104 300C96 334 96 380 106 410" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" filter={`url(#${id}-b1)`} />
        <path d="M116 296C110 320 108 344 110 362" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
        <path d="M214 300C222 336 222 376 212 408" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" />
        {[318, 334].map((y) => (
          <line key={y} x1="122" x2="134" y1={y} y2={y} stroke="#fff" strokeOpacity="0.55" strokeWidth="1.4" />
        ))}
      </g>
      <path d={CARAFE} fill="#fff" fillOpacity="0.1" stroke={INK} strokeOpacity="0.3" strokeWidth="1.4" />
      <path d="M140 429H180" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.5" />
      <path d={tubePath(handleGlass, 9)} fill="#fff" fillOpacity="0.16" stroke={INK} strokeOpacity="0.28" strokeWidth="1.2" />
      <path d={lightLine(handleGlass, 9, 9, 0.5)} fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="160" cy="272" rx="48" ry="7" fill="#fff" fillOpacity="0.14" stroke={INK} strokeOpacity="0.3" strokeWidth="1.2" />

      {/* Foot, sitting on the server's mouth */}
      <ellipse cx="160" cy="268" rx="50" ry="6" fill="#000" opacity="0.28" filter={`url(#${id}-b1)`} />
      <path d="M106 252H214V258C214 263 190 266 160 266C130 266 106 263 106 258Z" fill={body} />
      <path d="M106 252H214V258C214 263 190 266 160 266C130 266 106 263 106 258Z" fill={`url(#${id}-cyl)`} />
      <ellipse cx="160" cy="252" rx="54" ry="7" fill={body} />
      <ellipse cx="160" cy="252" rx="54" ry="7" fill="#fff" opacity="0.12" />
      <path d="M136 238V252H184V238Z" fill={body} />
      <path d="M136 238V252H184V238Z" fill={`url(#${id}-cyl)`} />
      <ellipse cx="160" cy="252" rx="26" ry="3.4" fill="#000" opacity="0.18" />

      {/* Handle (behind the cone's edge) */}
      <path d={tubePath(handle, 13)} fill={body} />
      <path d={tubePath(handle, 13)} fill="#000" opacity="0.12" />
      <path d={lightLine(handle, 13, 13, 0.55)} fill="none" stroke="#fff" strokeOpacity={dark ? 0.32 : 0.6} strokeWidth="2.4" strokeLinecap="round" />
      <path d={lightLine(handle, 13, 13, -0.75)} fill="none" stroke="#000" strokeOpacity="0.24" strokeWidth="2.6" strokeLinecap="round" />

      {/* Cone: glaze, spiral ribs, speckles, shading */}
      <path d={CONE} fill={body} />
      <g clipPath={`url(#${id}-cone)`}>
        {ribs.map((r, i) => (
          <g key={i} opacity={1 - r.edge * 0.55}>
            <path d={`M${r.x1 + 2.2} ${r.y1}Q${(r.x1 + r.x2) / 2 + 9} 196 ${r.x2 + 1.6} ${r.y2}`} fill="none" stroke="#000" strokeOpacity="0.16" strokeWidth="2.2" />
            <path d={`M${r.x1} ${r.y1}Q${(r.x1 + r.x2) / 2 + 7} 196 ${r.x2} ${r.y2}`} fill="none" stroke="#fff" strokeOpacity={dark ? 0.22 : 0.55} strokeWidth="1.5" />
          </g>
        ))}
        {specks.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={speck} opacity={s.o} />
        ))}
        <rect x="60" y="120" width="200" height="130" fill={`url(#${id}-cyl)`} />
        <rect x="60" y="120" width="200" height="130" fill={`url(#${id}-depth)`} />
        <path d="M92 150C102 182 118 206 136 226" fill="none" stroke="#fff" strokeOpacity={dark ? 0.25 : 0.5} strokeWidth="6" strokeLinecap="round" filter={`url(#${id}-b3)`} />
        <g transform="translate(0.8 0.8)">
          <Mark x={149} y={170} h={26} fill="#fff" opacity={dark ? 0.2 : 0.55} />
        </g>
        <Mark x={149} y={170} h={26} fill="#000" opacity={0.2} />
      </g>

      {/* Lip and the inside of the cone */}
      <ellipse cx="160" cy="134" rx="92" ry="14" fill={body} />
      <ellipse cx="160" cy="134" rx="92" ry="14" fill={`url(#${id}-cyl-soft)`} />
      <ellipse cx="160" cy="134" rx="81" ry="10.5" fill={body} />
      <g clipPath={`url(#${id}-mouth)`}>
        <rect x="70" y="120" width="180" height="30" fill={`url(#${id}-inside)`} />
        {/* Ribs on the far wall, running down towards the outlet */}
        {Array.from({ length: 13 }, (_, i) => {
          const a = Math.PI + ((i + 0.5) * Math.PI) / 13;
          const x = 160 + 81 * Math.cos(a);
          const y = 134 + 10.5 * Math.sin(a);
          return <path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)}L${(160 + (x - 160) * 0.45 + 4).toFixed(1)} ${(139 + (y - 134) * 0.2).toFixed(1)}`} stroke="#000" strokeOpacity="0.14" strokeWidth="1.3" />;
        })}
        <ellipse cx="160" cy="141" rx="30" ry="4" fill="#000" opacity="0.3" filter={`url(#${id}-b1)`} />
      </g>
      <path d="M70 136C84 145 120 149 160 149C200 149 236 145 250 136" fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="1.5" />
      <path d="M76 128C96 122 126 120 160 120C194 120 224 122 244 128" fill="none" stroke="#fff" strokeOpacity={dark ? 0.3 : 0.75} strokeWidth="1.6" strokeLinecap="round" />
    </>
  );
}

/* ---- Steady Pour Kettle (matte black, walnut, brass) ----------------------- */

const KETTLE = "M84 418C84 356 90 292 98 260C101 245 109 237 122 234H202C215 237 223 245 226 260C234 292 240 356 240 418Z";

function Kettle({ id }: { id: string }) {
  const spout = sample([
    [
      [100, 392],
      [68, 388],
      [54, 362],
      [54, 320],
    ],
    [
      [54, 320],
      [54, 276],
      [58, 248],
      [44, 226],
    ],
    [
      [44, 226],
      [36, 212],
      [24, 198],
      [9, 201],
    ],
  ]);
  const handle: Cubic[] = [
    [
      [232, 262],
      [262, 254],
      [294, 264],
      [295, 302],
    ],
    [
      [295, 302],
      [296, 340],
      [280, 370],
      [244, 384],
    ],
  ];
  const handlePts = sample(handle);
  const ticks = Array.from({ length: 9 }, (_, i) => (-135 + i * 33.75) * (Math.PI / 180));
  return (
    <>
      <defs>
        <linearGradient id={`${id}-matte`} x1="0" x2="1">
          <stop offset="0" stopColor="#100c0a" />
          <stop offset="0.1" stopColor="#272120" />
          <stop offset="0.21" stopColor="#4d4540" />
          <stop offset="0.32" stopColor="#2c2623" />
          <stop offset="0.68" stopColor="#1c1816" />
          <stop offset="0.88" stopColor="#3c312a" />
          <stop offset="1" stopColor="#0e0b09" />
        </linearGradient>
        <linearGradient id={`${id}-vert`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.16" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.84" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
        <WoodGradient id={`${id}-wood`} />
        <BrassGradient id={`${id}-brass`} />
        <radialGradient id={`${id}-dial`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fbf7f0" />
          <stop offset="1" stopColor="#e3d6c1" />
        </radialGradient>
        <clipPath id={`${id}-body`}>
          <path d={KETTLE} />
        </clipPath>
        <Blur id={`${id}-b2`} s={2} />
        <Blur id={`${id}-b5`} s={5} />
      </defs>

      {/* Gooseneck: a tapered tube from the base of the body */}
      <path d={tubePath(spout, 16, 7)} fill={`url(#${id}-matte)`} />
      <path d={tubePath(spout, 16, 7)} fill="#1a1513" opacity="0.6" />
      <path d={lightLine(spout, 16, 7, 0.55)} fill="none" stroke="#8a7e74" strokeOpacity="0.8" strokeWidth="2.6" strokeLinecap="round" />
      <path d={lightLine(spout, 16, 7, 0.7)} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.9" strokeLinecap="round" />
      <path d={lightLine(spout, 16, 7, -0.8)} fill="none" stroke="#7a5a3e" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="9.5" cy="201" rx="2.2" ry="3.4" fill="#0b0807" transform="rotate(-12 9.5 201)" />

      {/* Handle: walnut loop with brass ferrules */}
      <WoodTube id={`${id}-wood`} chain={handle} w0={17} />
      {[handlePts.slice(1, 5), handlePts.slice(-4)].map((seg, i) => (
        <g key={i}>
          <path d={tubePath(seg, 19.5)} fill={`url(#${id}-brass)`} stroke="#5a3c12" strokeOpacity="0.5" strokeWidth="0.8" />
          <path d={lightLine(seg, 19.5, 19.5, 0.5)} fill="none" stroke="#fff4d6" strokeOpacity="0.75" strokeWidth="1.6" />
        </g>
      ))}

      {/* Body */}
      <path d={KETTLE} fill={`url(#${id}-matte)`} />
      <g clipPath={`url(#${id}-body)`}>
        <rect x="80" y="230" width="170" height="200" fill={`url(#${id}-vert)`} />
        <rect x="103" y="244" width="11" height="176" fill="#fff" opacity="0.1" filter={`url(#${id}-b5)`} />
        <rect x="117" y="250" width="2.5" height="160" fill="#fff" opacity="0.12" filter={`url(#${id}-b2)`} />
        <rect x="222" y="250" width="9" height="170" fill="#d9963f" opacity="0.16" filter={`url(#${id}-b5)`} />
        <path d="M98 262C120 252 204 252 226 262" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="3" filter={`url(#${id}-b2)`} />
      </g>
      <Mark x={150} y={296} h={30} fill={PARCHMENT} opacity={0.88} />
      <text
        x="162"
        y="348"
        textAnchor="middle"
        fill={PARCHMENT}
        opacity="0.7"
        style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: "0.32em" }}
      >
        FURROWLINE
      </text>

      {/* Base ring */}
      <path d="M82 410H242C243 418 242 426 238 429C236 431 232 432 228 432H96C92 432 88 431 86 429C82 426 81 418 82 410Z" fill={`url(#${id}-matte)`} />
      <path d="M82 410H242" stroke="#8a7e74" strokeOpacity="0.55" strokeWidth="1" />
      <path d="M86 428H238" stroke="#000" strokeOpacity="0.6" strokeWidth="1.5" />

      {/* Shoulder, lid and thermometer */}
      <ellipse cx="162" cy="235" rx="45" ry="6.5" fill="#2a2421" />
      <path d="M118 235C120 216 138 206 162 206C186 206 204 216 206 235Z" fill={`url(#${id}-matte)`} />
      <path d="M118 235C120 216 138 206 162 206C186 206 204 216 206 235Z" fill={`url(#${id}-vert)`} />
      <path d="M127 228C130 216 144 210 158 209" fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M117 235.5C130 240 194 240 207 235.5" fill="none" stroke="#8a7e74" strokeOpacity="0.6" strokeWidth="1" />
      <rect x="158.5" y="194" width="7" height="13" fill={`url(#${id}-brass)`} />
      <circle cx="162" cy="190" r="13.5" fill={`url(#${id}-brass)`} />
      <circle cx="162" cy="190" r="10" fill={`url(#${id}-dial)`} />
      {ticks.map((a, i) => (
        <line
          key={i}
          x1={162 + Math.cos(a - Math.PI / 2) * 7.2}
          y1={190 + Math.sin(a - Math.PI / 2) * 7.2}
          x2={162 + Math.cos(a - Math.PI / 2) * 9}
          y2={190 + Math.sin(a - Math.PI / 2) * 9}
          stroke={INK}
          strokeWidth="0.7"
        />
      ))}
      <path d="M162 190L167.5 185" stroke={CLAY} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="162" cy="190" r="1.4" fill={INK} />
      <path d="M154.5 184.5A10 10 0 0 1 162 180.5" fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.3" strokeLinecap="round" />
    </>
  );
}

/* ---- Field Hand Grinder (steel, knurled grip, walnut catch cup) ------------ */

function Grinder({ id }: { id: string }) {
  const arm = sample([
    [
      [160, 108],
      [196, 104],
      [234, 96],
      [262, 92],
    ],
  ]);
  const rand = seeded(7);
  const grain = Array.from({ length: 11 }, (_, i) => {
    const x = 116 + i * 8.6 + rand() * 3;
    const w = 2 + rand() * 3;
    return `M${x} 274C${x + w} 310 ${x - w} 346 ${x + w * 0.6} 384S${x - w} 404 ${x} 412`;
  });
  return (
    <>
      <defs>
        <linearGradient id={`${id}-steel`} x1="0" x2="1">
          <stop offset="0" stopColor="#4d463f" />
          <stop offset="0.12" stopColor="#8e877e" />
          <stop offset="0.24" stopColor="#f4f1eb" />
          <stop offset="0.36" stopColor="#c8c1b7" />
          <stop offset="0.66" stopColor="#9a938a" />
          <stop offset="0.86" stopColor="#6c655d" />
          <stop offset="0.93" stopColor="#b0a698" />
          <stop offset="1" stopColor="#3e3832" />
        </linearGradient>
        <linearGradient id={`${id}-steel-dark`} x1="0" x2="1">
          <stop offset="0" stopColor="#2a2622" />
          <stop offset="0.24" stopColor="#8a837a" />
          <stop offset="0.4" stopColor="#5a534c" />
          <stop offset="0.86" stopColor="#3a342f" />
          <stop offset="0.94" stopColor="#6a6157" />
          <stop offset="1" stopColor="#221e1b" />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fbf8f2" />
          <stop offset="1" stopColor="#a39b90" />
        </linearGradient>
        <WoodGradient id={`${id}-wood`} />
        <CylinderShade id={`${id}-cyl`} strength={0.7} />
        <radialGradient id={`${id}-knob`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#b77a4f" />
          <stop offset="0.45" stopColor={WALNUT[2]} />
          <stop offset="1" stopColor={WALNUT[0]} />
        </radialGradient>
        <pattern id={`${id}-knurl`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="5" height="5" fill="none" />
          <path d="M0 0.5H5M0.5 0V5" stroke="#000" strokeOpacity="0.32" strokeWidth="1" />
          <path d="M0 1.6H5M1.6 0V5" stroke="#fff" strokeOpacity="0.2" strokeWidth="0.7" />
        </pattern>
        <clipPath id={`${id}-wood-clip`}>
          <rect x="112" y="272" width="96" height="140" />
        </clipPath>
        <Blur id={`${id}-b2`} s={2} />
      </defs>

      {/* Crank: arm, stem, walnut knob */}
      <rect x="153" y="96" width="14" height="22" rx="2" fill={`url(#${id}-steel-dark)`} />
      <path d={tubePath(arm, 9, 7)} fill="#35302b" />
      <path d={lightLine(arm, 9, 7, 0.5)} fill="none" stroke="#d9d3ca" strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M257 86H268V98C268 100 266 101 262.5 101C259 101 257 100 257 98Z" fill={`url(#${id}-steel-dark)`} />
      <ellipse cx="263" cy="86" rx="5.5" ry="2" fill="#8a837a" />
      <ellipse cx="263" cy="66" rx="17" ry="21" fill={`url(#${id}-knob)`} />
      <path d="M253 58C255 52 259 49 264 48" fill="none" stroke="#f3d2b4" strokeOpacity="0.55" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="263" cy="86" rx="9" ry="2.6" fill={WALNUT[0]} />
      <polygon points="152,108 156,101 164,101 168,108 164,115 156,115" fill={`url(#${id}-steel)`} stroke="#3e3832" strokeOpacity="0.6" strokeWidth="0.8" />

      {/* Lid cap */}
      <path d="M110 122H210V136H110Z" fill={`url(#${id}-steel-dark)`} />
      <ellipse cx="160" cy="122" rx="50" ry="8.5" fill={`url(#${id}-top)`} />
      <ellipse cx="160" cy="122" rx="22" ry="3.8" fill="#000" opacity="0.15" />
      <ellipse cx="160" cy="121" rx="12" ry="2.4" fill="#5d564e" />

      {/* Upper steel, knurled grip, collar */}
      <rect x="112" y="136" width="96" height="44" fill={`url(#${id}-steel)`} />
      <line x1="112" x2="208" y1="137" y2="137" stroke="#000" strokeOpacity="0.35" strokeWidth="1.5" />
      <rect x="112" y="180" width="96" height="84" fill={`url(#${id}-steel)`} />
      <rect x="112" y="180" width="96" height="84" fill={`url(#${id}-knurl)`} />
      <rect x="112" y="180" width="96" height="84" fill={`url(#${id}-cyl)`} />
      <line x1="112" x2="208" y1="180.5" y2="180.5" stroke="#fff" strokeOpacity="0.6" strokeWidth="1" />
      <line x1="112" x2="208" y1="182.5" y2="182.5" stroke="#000" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1="112" x2="208" y1="263" y2="263" stroke="#000" strokeOpacity="0.4" strokeWidth="1.5" />
      <rect x="110" y="264" width="100" height="9" rx="1.5" fill={`url(#${id}-steel)`} />
      <line x1="110" x2="210" y1="264.5" y2="264.5" stroke="#fff" strokeOpacity="0.7" strokeWidth="0.8" />
      <text
        x="160"
        y="162"
        textAnchor="middle"
        fill="#3a342f"
        opacity="0.75"
        style={{ fontFamily: "var(--font-mono)", fontSize: 6.5, letterSpacing: "0.3em" }}
      >
        FIELD · 38MM
      </text>

      {/* Walnut catch cup with grain and an engraved mark */}
      <rect x="112" y="273" width="96" height="140" fill={`url(#${id}-wood)`} />
      <g clipPath={`url(#${id}-wood-clip)`}>
        {grain.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={i % 3 === 0 ? "#1f0f07" : "#c08a5e"} strokeOpacity={i % 3 === 0 ? 0.3 : 0.16} strokeWidth={i % 3 === 0 ? 1.2 : 0.8} />
        ))}
        <rect x="112" y="273" width="96" height="140" fill={`url(#${id}-cyl)`} />
        <rect x="130" y="276" width="8" height="134" fill="#ffd9b5" opacity="0.14" filter={`url(#${id}-b2)`} />
        <line x1="112" x2="208" y1="274" y2="274" stroke="#000" strokeOpacity="0.45" strokeWidth="2" />
      </g>
      <g transform="translate(0.7 0.7)">
        <Mark x={148.5} y={318} h={28} fill="#e8b48a" opacity={0.35} />
      </g>
      <Mark x={148.5} y={318} h={28} fill="#1c0e06" opacity={0.7} />
      <text
        x="160"
        y="366"
        textAnchor="middle"
        fill="#1c0e06"
        opacity="0.6"
        style={{ fontFamily: "var(--font-mono)", fontSize: 6.5, letterSpacing: "0.3em" }}
      >
        FURROWLINE
      </text>

      {/* Base ring */}
      <path d="M110 412H210V424C210 428 207 431 203 431H117C113 431 110 428 110 424Z" fill={`url(#${id}-steel)`} />
      <line x1="110" x2="210" y1="412.5" y2="412.5" stroke="#fff" strokeOpacity="0.65" strokeWidth="0.8" />
      <path d="M113 430H207" stroke="#000" strokeOpacity="0.45" strokeWidth="1.5" />
    </>
  );
}

/* ---- Contour Enamel Mug ------------------------------------------------- */

const MUG = "M54 214V400C54 416 64 426 80 426H188C204 426 214 416 214 400V214Z";

function Mug({ id, body }: { id: string; body: string }) {
  const dark = isDark(body);
  const print = dark ? "#efa47a" : CLAY;
  const rim = dark ? "#c9b9a3" : "#2a201a";
  const handle = sample([
    [
      [212, 252],
      [250, 246],
      [276, 260],
      [277, 296],
    ],
    [
      [277, 296],
      [278, 330],
      [256, 348],
      [212, 344],
    ],
  ]);
  return (
    <>
      <defs>
        <CylinderShade id={`${id}-cyl`} strength={dark ? 0.9 : 1} />
        <linearGradient id={`${id}-wall`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.3" />
          <stop offset="1" stopColor="#000" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id={`${id}-coffee`} cx="0.42" cy="0.45" r="0.65">
          <stop offset="0" stopColor="#5e3620" />
          <stop offset="0.75" stopColor="#3a2014" />
          <stop offset="1" stopColor="#8a5a36" />
        </radialGradient>
        <clipPath id={`${id}-body`}>
          <path d={MUG} />
        </clipPath>
        <clipPath id={`${id}-mouth`}>
          <ellipse cx="134" cy="214" rx="78" ry="12.5" />
        </clipPath>
        <Blur id={`${id}-b1`} s={1.4} />
        <Blur id={`${id}-b3`} s={3} />
      </defs>

      {/* Tubular handle with welded ends */}
      <path d={tubePath(handle, 15)} fill={body} />
      <path d={tubePath(handle, 15)} fill="#000" opacity={dark ? 0.1 : 0.06} />
      <path d={lightLine(handle, 15, 15, 0.5)} fill="none" stroke="#fff" strokeOpacity={dark ? 0.32 : 0.85} strokeWidth="2.6" strokeLinecap="round" />
      <path d={lightLine(handle, 15, 15, 0.7)} fill="none" stroke="#fff" strokeOpacity={dark ? 0.3 : 0.6} strokeWidth="0.9" strokeLinecap="round" />
      <path d={lightLine(handle, 15, 15, -0.72)} fill="none" stroke="#000" strokeOpacity={dark ? 0.5 : 0.22} strokeWidth="3.4" strokeLinecap="round" />
      <ellipse cx="214" cy="252" rx="5" ry="9" fill={body} />
      <ellipse cx="214" cy="344" rx="5" ry="9" fill={body} />
      <ellipse cx="214" cy="252" rx="5" ry="9" fill="#000" opacity="0.16" />
      <ellipse cx="214" cy="344" rx="5" ry="9" fill="#000" opacity="0.16" />

      {/* Body: enamel, contour print, gloss */}
      <path d={MUG} fill={body} />
      <g clipPath={`url(#${id}-body)`}>
        <g transform="translate(14 236)">
          <Contours hills={[{ cx: 80, cy: 86, r: 78, levels: 8, stretch: 1.3, wobble: 0.22, seed: 11 }]} stroke={print} strokeWidth={1.35} />
        </g>
        <rect x="40" y="200" width="190" height="240" fill={`url(#${id}-cyl)`} />
        <path d="M54 404C54 418 64 426 80 426H188C204 426 214 418 214 404" fill="none" stroke={rim} strokeWidth="6" />
        <path d="M58 412C64 420 72 422 82 422H186" fill="none" stroke="#fff" strokeOpacity={dark ? 0.2 : 0.35} strokeWidth="1" />
        <rect x="68" y="226" width="13" height="180" fill="#fff" opacity={dark ? 0.16 : 0.5} filter={`url(#${id}-b3)`} />
        <rect x="87" y="228" width="3" height="170" fill="#fff" opacity={dark ? 0.16 : 0.4} filter={`url(#${id}-b1)`} />
        <rect x="198" y="230" width="7" height="170" fill="#fff" opacity={dark ? 0.08 : 0.14} filter={`url(#${id}-b3)`} />
        <rect x="40" y="214" width="190" height="14" fill="#000" opacity="0.08" filter={`url(#${id}-b3)`} />
      </g>

      {/* Mouth: inner wall, coffee, rolled rim (with one honest chip) */}
      <ellipse cx="134" cy="214" rx="80" ry="14" fill={body} />
      <g clipPath={`url(#${id}-mouth)`}>
        <rect x="50" y="198" width="170" height="34" fill={`url(#${id}-wall)`} />
        <ellipse cx="134" cy="225" rx="76" ry="11" fill={`url(#${id}-coffee)`} />
        <ellipse cx="114" cy="223" rx="20" ry="3" fill="#fff" opacity="0.16" filter={`url(#${id}-b1)`} />
      </g>
      <ellipse cx="134" cy="214" rx="80" ry="14" fill="none" stroke={rim} strokeWidth="5" />
      <path d="M62 216C70 224 100 228 134 228C168 228 198 224 206 216" fill="none" stroke="#fff" strokeOpacity={dark ? 0.35 : 0.45} strokeWidth="1.2" />
      <path d="M70 205C86 200 108 198 134 198" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round" />
      <path d="M178 226.5C181 225 184 225.5 186 226.8C184.5 228.6 181 229 178 226.5Z" fill={dark ? "#1a120e" : "#3b2c22"} opacity="0.85" />
    </>
  );
}

/* ---- Field Canvas Tote ---------------------------------------------------- */

const TOTE = "M60 198Q110 206 160 205Q210 206 260 198C266 262 272 342 276 418C276 426 270 430 262 430H58C50 430 44 426 44 418C48 342 54 262 60 198Z";
const TOTE_INSIDE = "M64 186Q160 180 256 186L260 200Q160 208 60 200Z";

function Tote({ id }: { id: string }) {
  const front = sample([
    [
      [96, 210],
      [96, 132],
      [120, 92],
      [160, 92],
    ],
    [
      [160, 92],
      [200, 92],
      [224, 132],
      [224, 210],
    ],
  ]);
  const back = sample([
    [
      [108, 190],
      [110, 122],
      [134, 86],
      [168, 86],
    ],
    [
      [168, 86],
      [204, 86],
      [222, 124],
      [222, 190],
    ],
  ]);
  const canvas = "#ecdfc3";
  const webbing = "#d6c29b";
  const ink = CLAY;
  return (
    <>
      <defs>
        <linearGradient id={`${id}-shade`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.2" />
          <stop offset="0.1" stopColor="#000" stopOpacity="0.04" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.86" stopColor="#000" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.26" />
        </linearGradient>
        <linearGradient id={`${id}-vert`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.1" />
          <stop offset="0.12" stopColor="#000" stopOpacity="0" />
          <stop offset="0.82" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${id}-inside`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3a2414" stopOpacity="0.1" />
          <stop offset="1" stopColor="#3a2414" stopOpacity="0.45" />
        </linearGradient>
        <pattern id={`${id}-weave`} width="2.4" height="2.4" patternUnits="userSpaceOnUse">
          <rect width="2.4" height="1.2" fill="#5a4630" opacity="0.045" />
          <rect width="1.2" height="2.4" fill="#fff" opacity="0.07" />
        </pattern>
        <filter id={`${id}-fibre`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85 0.12" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 0.36  0 0 0 0 0.26  0 0 0 0 0.14  0 0 0 0.5 -0.14" />
        </filter>
        <clipPath id={`${id}-panel`}>
          <path d={TOTE} />
        </clipPath>
        <clipPath id={`${id}-arch`}>
          <path d="M116 362V302A44 44 0 0 1 204 302V362Z" />
        </clipPath>
        <Blur id={`${id}-b2`} s={2} />
        <Blur id={`${id}-b4`} s={4} />
      </defs>

      {/* Back handle and the inside of the bag */}
      <path d={tubePath(back, 17)} fill="#bba57d" />
      <path d={offsetLine(back, 0)} fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="9" />
      <path d={TOTE_INSIDE} fill="#b39c76" />
      <path d={TOTE_INSIDE} fill={`url(#${id}-inside)`} />

      {/* Front panel */}
      <path d={TOTE} fill={canvas} />
      <g clipPath={`url(#${id}-panel)`}>
        <rect x="40" y="190" width="240" height="245" fill={`url(#${id}-weave)`} />
        <rect x="40" y="190" width="240" height="245" filter={`url(#${id}-fibre)`} opacity="0.5" />

        {/* Screen print: furrows in an arch, mark and name, in clay ink */}
        <g opacity="0.92">
          <g clipPath={`url(#${id}-arch)`}>
            <rect x="116" y="258" width="88" height="104" fill="#efe3cb" />
            <g transform="translate(116 258)">
              <Furrows width={88} height={104} rows={13} horizon={34} stroke={ink} strokeWidth={2.1} />
            </g>
            <circle cx="160" cy="290" r="11" fill={ink} />
          </g>
          <path d="M116 362V302A44 44 0 0 1 204 302V362Z" fill="none" stroke={ink} strokeWidth="1.8" />
          <Mark x={152} y={232} h={18} fill={ink} />
          <text x="160" y="382" textAnchor="middle" fill={ink} style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.32em" }}>
            FURROWLINE
          </text>
          <text x="160" y="395" textAnchor="middle" fill={ink} opacity="0.85" style={{ fontFamily: "var(--font-mono)", fontSize: 5.6, letterSpacing: "0.34em" }}>
            COFFEE ROASTERS
          </text>
        </g>
        <rect x="40" y="190" width="240" height="245" fill={`url(#${id}-weave)`} opacity="0.7" />

        {/* Folds: a soft vertical crease and the slump at the base */}
        <path d="M156 210C152 250 150 300 154 352" fill="none" stroke="#000" strokeOpacity="0.1" strokeWidth="10" filter={`url(#${id}-b4)`} />
        <path d="M164 214C161 252 160 300 163 350" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="5" filter={`url(#${id}-b2)`} />
        <path d="M62 404C84 394 104 396 124 410" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="6" filter={`url(#${id}-b2)`} />
        <path d="M258 402C238 392 218 396 202 410" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="6" filter={`url(#${id}-b2)`} />
        <path d="M44 414Q160 404 276 414V432H44Z" fill="#5a4024" opacity="0.12" />
        <path d="M46 414Q160 404 274 414" fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="3 2.4" />

        {/* Top hem with stitching */}
        <path d="M58 198Q110 206 160 205Q210 206 262 198L263 214Q210 222 160 221Q110 222 57 214Z" fill="#000" opacity="0.07" />
        <path d="M58 214Q110 222 160 221Q210 222 263 214" fill="none" stroke="#000" strokeOpacity="0.16" strokeWidth="1.2" />
        <path d="M58 210Q110 218 160 217Q210 218 263 210" fill="none" stroke="#6b5a40" strokeOpacity="0.55" strokeWidth="0.8" strokeDasharray="3 2.2" />

        {/* Strap tails sewn to the front: shadow, webbing, box-X stitching */}
        {[96, 224].map((x) => (
          <g key={x}>
            <rect x={x - 6} y="200" width="18" height="70" fill="#000" opacity="0.16" filter={`url(#${id}-b2)`} />
            <rect x={x - 9} y="198" width="18" height="70" fill={webbing} />
            <rect x={x - 9} y="198" width="18" height="70" fill={`url(#${id}-weave)`} />
            <line x1={x - 9} x2={x - 9} y1="198" y2="268" stroke="#fff" strokeOpacity="0.4" strokeWidth="1" />
            <line x1={x + 9} x2={x + 9} y1="198" y2="268" stroke="#000" strokeOpacity="0.22" strokeWidth="1.2" />
            <line x1={x - 9} x2={x + 9} y1="268" y2="268" stroke="#000" strokeOpacity="0.25" strokeWidth="1.2" />
            <g fill="none" stroke="#6b5a40" strokeOpacity="0.6" strokeWidth="0.8" strokeDasharray="2.6 2">
              <path d={`M${x - 6} 236H${x + 6}V262H${x - 6}ZM${x - 6} 236L${x + 6} 262M${x + 6} 236L${x - 6} 262`} />
              <path d={`M${x - 6} 200V232M${x + 6} 200V232`} />
            </g>
          </g>
        ))}

        <rect x="40" y="190" width="240" height="245" fill={`url(#${id}-shade)`} />
        <rect x="40" y="190" width="240" height="245" fill={`url(#${id}-vert)`} />
      </g>

      {/* Front handle: webbing with thickness, stitched edges and a highlight */}
      <path d={tubePath(front, 18)} fill="#a8936c" transform="translate(1.5 2.5)" />
      <path d={tubePath(front, 18)} fill={webbing} />
      <path d={tubePath(front, 18)} fill={`url(#${id}-weave)`} />
      <path d={offsetLine(front, 6)} fill="none" stroke="#6b5a40" strokeOpacity="0.5" strokeWidth="0.8" strokeDasharray="2.6 2" />
      <path d={offsetLine(front, -6)} fill="none" stroke="#6b5a40" strokeOpacity="0.5" strokeWidth="0.8" strokeDasharray="2.6 2" />
      <path d={lightLine(front, 18, 18, 0.85)} fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.4" />
      <path d={lightLine(front, 18, 18, -0.9)} fill="none" stroke="#000" strokeOpacity="0.2" strokeWidth="1.4" />
    </>
  );
}

/** Rough luminance check for variant bodies (dark glazes get softer highlights). */
function isDark(hex: string): boolean {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 140;
}

export function GearArt({
  art,
  variant,
  swatch,
  className,
  title,
  decorative,
  shadow = true,
}: {
  art: GearArtKey;
  variant?: string;
  /** Body colour for variants (mug, dripper). */
  swatch?: string;
  className?: string;
  title?: string;
  decorative?: boolean;
  /** Draw the soft floor shadow (cards and the product stage draw their own). */
  shadow?: boolean;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const body = swatch ?? (variant === "clay" ? CLAY : variant === "espresso" ? INK : "#f1e8da");
  const floor: Record<GearArtKey, number> = { dripper: 92, kettle: 130, grinder: 80, mug: 120, tote: 134 };
  return (
    <svg
      viewBox="0 0 320 460"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
    >
      {shadow && <Floor id={id} rx={floor[art]} />}
      {art === "dripper" && <Dripper id={id} body={body} />}
      {art === "kettle" && <Kettle id={id} />}
      {art === "grinder" && <Grinder id={id} />}
      {art === "mug" && <Mug id={id} body={body} />}
      {art === "tote" && <Tote id={id} />}
    </svg>
  );
}
