import type { ReactNode } from "react";
import { contourRings } from "@/lib/geometry";
import { Mark } from "@/components/brand/Mark";

/* ==========================================================================
   Illustrated town plan of Alder Bend: a one-off inline SVG in the palette.
   The Mill Race river, Mill Race Road, the side streets, the rail line, the
   Commons in contour rings and ploughed fields across the water. The roastery
   sits at the exact centre of the viewBox, so with preserveAspectRatio
   "slice" the HTML pin stays at 50% / 50% at every crop (4:5 on phones,
   3:2 on tablets, the full plan on desktop). The SVG is decorative; the pin
   is a real, focusable link with a label on hover and focus.
   ========================================================================== */

const W = 1200;
const H = 640;

const STREETS = {
  millRace: "M-40 380C260 366 420 352 600 352S980 336 1240 312",
  orchard: "M-40 196C300 186 700 176 1240 150",
  weir: "M574 -40L556 700",
  depot: "M904 -40L884 700",
  commons: "M262 -40L248 700",
};
const RAIL = "M-40 92C380 80 760 66 1240 40";
const RIVER = "M-40 494C200 472 380 522 600 488S980 432 1240 454";
const RIVER_PATH = "M-40 450C200 430 380 478 600 446S980 392 1240 412";

const COLORS = {
  ground: "#e9ddc8",
  block: "#f4ecdf",
  street: "#fbf7f0",
  casing: "#c9b9a3",
  building: "rgb(92 74 60 / 0.13)",
  buildingLine: "rgb(92 74 60 / 0.38)",
  water: "#a9b38c",
  moss: "#4b5a32",
  bark: "#5c4a3c",
  espresso: "#241913",
  dune: "#9b8670",
  clay: "#a4472a",
};

const BLOCKS: Array<[number, number, number, number]> = [
  [-20, 102, 264, 74],
  [268, 98, 284, 76],
  [584, 92, 294, 78],
  [910, 80, 310, 74],
  [-20, 200, 262, 160],
  [582, 184, 296, 152],
  [908, 168, 312, 158],
];

const BUILDINGS: Array<[number, number, number, number]> = [
  [10, 114, 60, 48],
  [84, 112, 70, 52],
  [168, 116, 58, 46],
  [282, 110, 80, 52],
  [376, 108, 70, 58],
  [462, 112, 76, 50],
  [598, 104, 62, 56],
  [674, 104, 90, 58],
  [780, 100, 84, 60],
  [1070, 92, 70, 52],
  [1152, 90, 60, 50],
  [0, 214, 90, 60],
  [104, 212, 120, 54],
  [0, 288, 70, 56],
  [86, 284, 140, 58],
  [594, 196, 118, 36],
  [744, 288, 120, 42],
  [922, 182, 96, 64],
  [1032, 180, 80, 58],
  [1124, 176, 90, 62],
  [924, 258, 180, 58],
  [1120, 252, 96, 62],
];

const FIELDS: Array<{ x: number; y: number; w: number; h: number; pattern: string }> = [
  { x: -20, y: 534, w: 296, h: 130, pattern: "furrow-a" },
  { x: 290, y: 544, w: 276, h: 120, pattern: "furrow-b" },
  { x: 580, y: 528, w: 326, h: 136, pattern: "furrow-c" },
  { x: 920, y: 506, w: 300, h: 158, pattern: "furrow-a" },
];

const TREES: Array<[number, number, number]> = [
  [300, 214, 9],
  [330, 236, 7],
  [520, 214, 8],
  [500, 322, 9],
  [292, 318, 8],
  [530, 296, 7],
  [470, 232, 6],
  [40, 412, 9],
  [120, 404, 7],
  [196, 416, 8],
  [330, 410, 8],
  [430, 420, 7],
  [700, 398, 9],
  [780, 392, 7],
  [960, 378, 8],
  [1040, 372, 9],
  [1130, 362, 7],
];

/** Street crossings of the river: short parapet lines either side of the deck. */
const BRIDGES: Array<{ x: number; y: number }> = [
  { x: 251, y: 494 },
  { x: 561, y: 492 },
  { x: 888, y: 452 },
];

function Label({
  path,
  offset,
  children,
  className = "map-label",
  anchor = "middle",
  dy,
}: {
  path: string;
  offset: string;
  children: ReactNode;
  className?: string;
  anchor?: "start" | "middle" | "end";
  /** Shift off the line (negative = above it). */
  dy?: number;
}) {
  return (
    <text className={className} dominantBaseline="middle" textAnchor={anchor} dy={dy}>
      <textPath href={`#${path}`} startOffset={offset}>
        {children}
      </textPath>
    </text>
  );
}

function MapArt() {
  const park = contourRings({ cx: 410, cy: 268, r: 118, levels: 7, stretch: 1.55, wobble: 0.2, seed: 8 });
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="map-svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path id="map-street-millrace" d={STREETS.millRace} />
        <path id="map-street-orchard" d={STREETS.orchard} />
        <path id="map-river" d={RIVER} />
        <path id="map-river-path" d={RIVER_PATH} />
        <path id="map-rail" d={RAIL} />
        {[
          ["furrow-a", 24],
          ["furrow-b", -18],
          ["furrow-c", 72],
        ].map(([id, angle]) => (
          <pattern key={id} id={String(id)} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
            <line x1="0" y1="6" x2="12" y2="6" stroke={COLORS.dune} strokeOpacity="0.6" strokeWidth="1" strokeLinecap="round" />
          </pattern>
        ))}
        <pattern id="map-lot" width="14" height="14" patternUnits="userSpaceOnUse">
          <line x1="7" y1="0" x2="7" y2="9" stroke={COLORS.casing} strokeWidth="1.5" />
        </pattern>
        <clipPath id="map-park-clip">
          <rect x="266" y="194" width="288" height="150" rx="18" />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill={COLORS.ground} />

      {/* Fields across the river: ploughed rows, hedgerow edges */}
      {FIELDS.map((f) => (
        <g key={f.x}>
          <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="8" fill={COLORS.block} />
          <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="8" fill={`url(#${f.pattern})`} stroke={COLORS.moss} strokeOpacity="0.35" strokeWidth="1.2" />
        </g>
      ))}

      {/* Town blocks and building footprints */}
      {BLOCKS.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="10" fill={COLORS.block} />
      ))}
      {BUILDINGS.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="3" fill={COLORS.building} stroke={COLORS.buildingLine} strokeWidth="1" />
      ))}

      {/* The Commons: a park drawn as a contour hill */}
      <rect x="266" y="194" width="288" height="150" rx="18" fill={COLORS.water} fillOpacity="0.32" />
      <g clipPath="url(#map-park-clip)" fill="none" stroke={COLORS.moss} strokeOpacity="0.42" strokeWidth="1.1">
        {park.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <path d="M272 338C340 300 420 290 470 250S530 206 548 198" fill="none" stroke={COLORS.bark} strokeOpacity="0.45" strokeWidth="1.6" strokeDasharray="1 6" strokeLinecap="round" />

      {/* Parking behind the roastery */}
      <rect x="728" y="196" width="138" height="78" rx="4" fill={COLORS.street} stroke={COLORS.casing} />
      <rect x="732" y="200" width="130" height="30" fill="url(#map-lot)" />
      <rect x="732" y="242" width="130" height="28" fill="url(#map-lot)" />

      {/* Trees */}
      {TREES.map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={r} fill={COLORS.moss} fillOpacity="0.5" />
          <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill={COLORS.block} fillOpacity="0.35" />
        </g>
      ))}

      {/* The Mill Race */}
      <path d={RIVER} fill="none" stroke={COLORS.moss} strokeOpacity="0.25" strokeWidth="74" />
      <path d={RIVER} fill="none" stroke={COLORS.water} strokeOpacity="0.85" strokeWidth="64" />
      {[-16, 0, 16].map((dy, i) => (
        <path
          key={dy}
          d={RIVER}
          transform={`translate(${i * 40 - 40} ${dy})`}
          fill="none"
          stroke={COLORS.block}
          strokeOpacity="0.7"
          strokeWidth="1.4"
          strokeDasharray={i === 1 ? "26 38" : "14 46"}
          strokeLinecap="round"
        />
      ))}
      <path d={RIVER_PATH} fill="none" stroke={COLORS.bark} strokeOpacity="0.55" strokeWidth="2.4" strokeDasharray="2 8" strokeLinecap="round" />

      {/* Rail line: ties, then a pair of rails */}
      <path d={RAIL} fill="none" stroke={COLORS.bark} strokeOpacity="0.55" strokeWidth="13" strokeDasharray="2.5 9" />
      <path d={RAIL} fill="none" stroke={COLORS.espresso} strokeWidth="6" />
      <path d={RAIL} fill="none" stroke={COLORS.ground} strokeWidth="2.6" />
      <rect x="930" y="92" width="122" height="50" rx="3" fill={COLORS.building} stroke={COLORS.buildingLine} />

      {/* Streets: casing, then the road; Mill Race Road is the wide one */}
      <g fill="none" strokeLinecap="round">
        {[STREETS.orchard, STREETS.weir, STREETS.depot, STREETS.commons].map((d) => (
          <path key={d} d={d} stroke={COLORS.casing} strokeWidth="28" />
        ))}
        <path d={STREETS.millRace} stroke={COLORS.casing} strokeWidth="38" />
        {[STREETS.orchard, STREETS.weir, STREETS.depot, STREETS.commons].map((d) => (
          <path key={`${d}-top`} d={d} stroke={COLORS.street} strokeWidth="22" />
        ))}
        <path d={STREETS.millRace} stroke={COLORS.street} strokeWidth="32" />
      </g>

      {/* Bridges */}
      {BRIDGES.map(({ x, y }) => (
        <g key={x} stroke={COLORS.espresso} strokeOpacity="0.7" strokeWidth="2.2" strokeLinecap="round">
          <line x1={x - 16} y1={y - 34} x2={x - 16} y2={y + 34} />
          <line x1={x + 16} y1={y - 34} x2={x + 16} y2={y + 34} />
        </g>
      ))}

      {/* The roastery: clay footprint on the corner of Mill Race Road and Weir Street */}
      <rect x="586" y="242" width="128" height="88" rx="4" fill={COLORS.clay} />
      <g stroke={COLORS.block} strokeOpacity="0.55" strokeWidth="1.2">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={598 + i * 24} y1="254" x2={598 + i * 24} y2="318" />
        ))}
      </g>

      {/* Parking and bike signs */}
      <g transform="translate(796 236)">
        <rect x="-13" y="-13" width="26" height="26" rx="6" fill={COLORS.espresso} />
        <text className="map-sign" textAnchor="middle" dominantBaseline="central" y="1">
          P
        </text>
      </g>
      <g transform="translate(742 312)" fill="none" stroke={COLORS.espresso} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="-8" cy="4" r="6" />
        <circle cx="10" cy="4" r="6" />
        <path d="M-8 4 0 -6h8L10 4M0 -6l-2 -4h-3M8 -6l2 -3" />
      </g>

      {/* Labels */}
      <Label path="map-street-millrace" offset="61%">
        MILL RACE ROAD
      </Label>
      <Label path="map-street-millrace" offset="3%" anchor="start">
        ← TO THE VALLEY
      </Label>
      <Label path="map-street-millrace" offset="97%" anchor="end">
        TO THE HILLS →
      </Label>
      <Label path="map-street-orchard" offset="58%">
        ORCHARD LANE
      </Label>
      <Label path="map-street-orchard" offset="14%">
        ORCHARD LANE
      </Label>
      <Label path="map-river" offset="40%" className="map-water">
        The Mill Race
      </Label>
      <Label path="map-river" offset="86%" className="map-water">
        The Mill Race
      </Label>
      <Label path="map-river-path" offset="55%" className="map-label map-label-sm" dy={-13}>
        RIVER PATH
      </Label>
      <Label path="map-rail" offset="40%" className="map-label map-label-sm" dy={-17}>
        RAIL LINE
      </Label>
      <text className="map-label" transform="translate(569 132) rotate(-88.6)" textAnchor="middle" dominantBaseline="middle">
        WEIR ST
      </text>
      <text className="map-label" transform="translate(897 252) rotate(-88.6)" textAnchor="middle" dominantBaseline="middle">
        DEPOT ST
      </text>
      <text className="map-label" transform="translate(255 140) rotate(-88.6)" textAnchor="middle" dominantBaseline="middle">
        COMMONS RD
      </text>
      <text className="map-label map-label-sm" x="991" y="118" textAnchor="middle" dominantBaseline="middle">
        DEPOT
      </text>
      <text className="map-park" x="410" y="272" textAnchor="middle" dominantBaseline="middle">
        The Commons
      </text>
    </svg>
  );
}

function Compass() {
  return (
    <svg viewBox="0 0 64 64" className="map-compass" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30" fill="#fbf7f0" stroke="#5c4a3c" strokeOpacity="0.5" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#5c4a3c" strokeOpacity="0.25" strokeDasharray="1 3" />
      <path d="M32 10 38 32 32 30 26 32Z" fill="#a4472a" />
      <path d="M32 54 26 32 32 34 38 32Z" fill="#5c4a3c" fillOpacity="0.45" />
      <text x="32" y="6.5" textAnchor="middle" dominantBaseline="middle" className="map-compass-n">
        N
      </text>
    </svg>
  );
}

export function TownMap() {
  return (
    <figure className="town-map">
      <div className="map-frame" data-reveal="clip">
        <div className="map-inner">
          <MapArt />
          <div className="map-compass-wrap">
            <Compass />
          </div>
          <div className="map-scale" aria-hidden="true">
            <span className="map-scale-bar">
              <span />
              <span />
            </span>
            <span className="map-scale-label">About 200 m</span>
          </div>
          <a href="#visit-address" className="map-pin">
            <span className="map-pin-pulse" aria-hidden="true" />
            <span className="map-pin-head" aria-hidden="true">
              <Mark className="h-5 w-auto" color="var(--color-peach)" />
            </span>
            <span className="map-pin-tag" aria-hidden="true">
              Furrowline
            </span>
            <span className="map-pin-card">
              <span className="display block text-[1.2rem] leading-tight">Furrowline Roastery &amp; Café</span>
              <span className="mt-1 block text-micro text-bark">Corner door, step-free. Directions below.</span>
              <span className="mt-1 block font-mono text-[0.6875rem] tracking-[0.12em] text-bark uppercase">
                Mill Race Rd &amp; Weir St
              </span>
            </span>
          </a>
        </div>
      </div>
      <figcaption className="map-caption">
        <span className="sr-only">
          Illustrated map of Alder Bend. The roastery is on the corner of Mill Race Road and Weir Street, on the north bank
          of the Mill Race river, with the Commons park to the west, parking behind the building and the rail depot to the
          north-east.
        </span>
        <span aria-hidden="true" className="map-legend">
          <span>
            <i className="map-key map-key-roastery" /> Roastery &amp; café
          </span>
          <span>
            <i className="map-key map-key-parking">P</i> Parking
          </span>
          <span>
            <i className="map-key map-key-path" /> River path
          </span>
          <span>
            <i className="map-key map-key-rail" /> Rail line
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
