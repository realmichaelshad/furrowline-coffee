import { useId } from "react";
import { MARK_BOX, MARK_D } from "@/components/brand/mark-data";

/* ==========================================================================
   Takeaway cup mockup (SVG, viewBox 0 0 260 420). Seen from a little above,
   lit from the top-left:
   - tapered clay paper body with cylindrical shading and a highlight streak
   - a ribbed espresso lid with a raised drinking plateau and sip slot
   - a corrugated kraft sleeve; the mark is printed on it and wrapped around
     the cylinder (sliced into strips, each compressed by the cosine of its
     angle, so the print narrows toward the edges), plus a line of type set
     on the sleeve's own curve
   - contact and cast shadows falling to the bottom-right
   ========================================================================== */

const CX = 130;
/** Ellipse ratio (ry / rx) for every horizontal circle on the cup: the camera sits a little above. */
const E = 0.2;
const TOP = { y: 92, r: 100 };
const BOTTOM = { y: 380, r: 73 };
const SLEEVE = { top: 186, bottom: 302 };

const r1 = (n: number) => Math.round(n * 100) / 100;

/** Body radius at height y (linear taper). */
function radiusAt(y: number): number {
  const t = (y - TOP.y) / (BOTTOM.y - TOP.y);
  return TOP.r + (BOTTOM.r - TOP.r) * t;
}

/** Front half of the horizontal circle at height y, as an SVG arc from left to right. */
function frontArc(y: number, reverse = false): string {
  const r = radiusAt(y);
  const ry = r * E;
  return reverse
    ? `A${r1(r)} ${r1(ry)} 0 0 1 ${r1(CX - r)} ${r1(y)}`
    : `A${r1(r)} ${r1(ry)} 0 0 0 ${r1(CX + r)} ${r1(y)}`;
}

/** Band of the cylinder between two heights (front face only). */
function band(yTop: number, yBottom: number): string {
  const a = radiusAt(yTop);
  const b = radiusAt(yBottom);
  return `M${r1(CX - a)} ${r1(yTop)}${frontArc(yTop)}L${r1(CX + b)} ${r1(yBottom)}${frontArc(yBottom, true)}Z`;
}

/** Point on the front of the cylinder at angle t (0 = left edge, PI = right edge) and height y. */
function onCylinder(t: number, y: number): [number, number] {
  const r = radiusAt(y);
  return [CX - r * Math.cos(t), y + r * E * Math.sin(t)];
}

/* The printed mark, wrapped: unwrapped width W at radius R, sliced into strips. */
const PRINT = { h: 58, cy: 236, strips: 14, offset: -10 };

function wrappedStrips() {
  const markW = (MARK_BOX.width * PRINT.h) / MARK_BOX.height;
  const R = radiusAt(PRINT.cy);
  const s = PRINT.h / MARK_BOX.height;
  const strips: Array<{ x0: number; x1: number; transform: string }> = [];
  for (let i = 0; i < PRINT.strips; i++) {
    // Unwrapped (arc-length) coordinates, centred on the front of the cup.
    const u0 = PRINT.offset - markW / 2 + (markW * i) / PRINT.strips;
    const u1 = PRINT.offset - markW / 2 + (markW * (i + 1)) / PRINT.strips;
    const p0 = R * Math.sin(u0 / R);
    const p1 = R * Math.sin(u1 / R);
    const a = (p1 - p0) / (u1 - u0);
    const um = (u0 + u1) / 2;
    // Points away from the front sit a touch higher on the visible ellipse.
    const dy = R * E * (Math.cos(um / R) - 1);
    // Local mark coords → unwrapped → projected.
    const ux = PRINT.offset - markW / 2;
    const tx = CX + p0 - a * u0 + a * ux;
    const ty = PRINT.cy - PRINT.h / 2 + dy;
    strips.push({
      x0: CX + p0 - 0.15,
      x1: CX + p1 + 0.15,
      transform: `translate(${r1(tx)} ${r1(ty)}) scale(${r1(a * s * 1000) / 1000} ${r1(s * 1000) / 1000}) translate(${-MARK_BOX.x} ${-MARK_BOX.y})`,
    });
  }
  return strips;
}

export function Cup({ className, title = "Furrowline takeaway cup" }: { className?: string; title?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (s: string) => `${uid}-${s}`;
  const body = band(TOP.y, BOTTOM.y);
  const sleeve = band(SLEEVE.top, SLEEVE.bottom);
  const strips = wrappedStrips();

  // Sleeve corrugation: vertical ribs evenly spaced in angle, so they bunch up toward the edges.
  const ribs = Array.from({ length: 44 }, (_, i) => {
    const t = ((i + 0.5) / 44) * Math.PI;
    const [xa, ya] = onCylinder(t, SLEEVE.top + 1.5);
    const [xb, yb] = onCylinder(t, SLEEVE.bottom - 1.5);
    return `M${r1(xa)} ${r1(ya)}L${r1(xb)} ${r1(yb)}`;
  }).join("");

  // Lid geometry
  const lip = { y: 80, r: 107, h: 13 };
  const plateau = { y: 64, r: 86, h: 10 };
  const lipRidges = Array.from({ length: 52 }, (_, i) => {
    const t = ((i + 0.5) / 52) * Math.PI;
    const x = CX - lip.r * Math.cos(t);
    const y = lip.y + lip.r * E * Math.sin(t);
    return `M${r1(x)} ${r1(y + 2)}V${r1(y + lip.h - 2)}`;
  }).join("");

  const lipBand = `M${CX - lip.r} ${lip.y}A${lip.r} ${r1(lip.r * E)} 0 0 0 ${CX + lip.r} ${lip.y}V${lip.y + lip.h}A${lip.r} ${r1(lip.r * E)} 0 0 1 ${CX - lip.r} ${lip.y + lip.h}Z`;
  const plateauBand = `M${CX - plateau.r} ${plateau.y}A${plateau.r} ${r1(plateau.r * E)} 0 0 0 ${CX + plateau.r} ${plateau.y}V${plateau.y + plateau.h}A${plateau.r} ${r1(plateau.r * E)} 0 0 1 ${CX - plateau.r} ${plateau.y + plateau.h}Z`;

  // Type on the sleeve's curve (a path along the front ellipse at that height).
  const textY = 287;
  const tr = radiusAt(textY);
  const textPath = `M${r1(CX - tr)} ${textY}A${r1(tr)} ${r1(tr * E)} 0 0 0 ${r1(CX + tr)} ${textY}`;

  return (
    <svg viewBox="0 0 260 420" className={className} role="img" aria-label={title} focusable="false" overflow="visible">
      <defs>
        <linearGradient id={id("cyl")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#241913" stopOpacity="0.42" />
          <stop offset="0.07" stopColor="#241913" stopOpacity="0.16" />
          <stop offset="0.2" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.28" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="0.55" stopColor="#241913" stopOpacity="0" />
          <stop offset="0.8" stopColor="#241913" stopOpacity="0.18" />
          <stop offset="1" stopColor="#241913" stopOpacity="0.46" />
        </linearGradient>
        <linearGradient id={id("lid")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.4" />
          <stop offset="0.15" stopColor="#fff" stopOpacity="0.24" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={id("lidtop")} x1="0" x2="0.9" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={id("vshade")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#241913" stopOpacity="0.35" />
          <stop offset="0.07" stopColor="#241913" stopOpacity="0" />
          <stop offset="0.85" stopColor="#241913" stopOpacity="0" />
          <stop offset="1" stopColor="#241913" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id={id("contact")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#241913" stopOpacity="0.55" />
          <stop offset="1" stopColor="#241913" stopOpacity="0" />
        </radialGradient>
        <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={id("streak")} x="-50%" y="-10%" width="200%" height="120%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <clipPath id={id("body")}>
          <path d={body} />
        </clipPath>
        <clipPath id={id("sleeve")}>
          <path d={sleeve} />
        </clipPath>
        <path id={id("mark")} d={MARK_D} />
        <path id={id("arc")} d={textPath} />
        {strips.map((st, i) => (
          <clipPath key={i} id={id(`s${i}`)}>
            <rect x={r1(st.x0)} y={SLEEVE.top} width={r1(st.x1 - st.x0)} height={SLEEVE.bottom - SLEEVE.top + 20} />
          </clipPath>
        ))}
      </defs>

      {/* Cast shadow (to the bottom-right) and contact shadow */}
      <path
        d={`M${CX - 60} ${BOTTOM.y + 6}C${CX + 20} ${BOTTOM.y - 8} ${CX + 120} ${BOTTOM.y - 4} ${CX + 128} ${BOTTOM.y + 16}C${CX + 110} ${BOTTOM.y + 30} ${CX - 30} ${BOTTOM.y + 30} ${CX - 60} ${BOTTOM.y + 6}Z`}
        fill="#241913"
        opacity="0.28"
        filter={`url(#${id("soft")})`}
      />
      <ellipse cx={CX + 6} cy={BOTTOM.y + 3} rx={BOTTOM.r + 6} ry={BOTTOM.r * E + 4} fill={`url(#${id("contact")})`} />

      {/* Body */}
      <path d={body} fill="#a4472a" />
      <g clipPath={`url(#${id("body")})`}>
        {/* Rolled base rim */}
        <path d={band(BOTTOM.y - 7, BOTTOM.y + 1)} fill="#8e3a20" />
        <path d={`M${r1(CX - radiusAt(BOTTOM.y - 7))} ${BOTTOM.y - 7}${frontArc(BOTTOM.y - 7)}`} fill="none" stroke="#fff" strokeOpacity="0.18" />
        {/* Sleeve */}
        <path d={sleeve} fill="#9b8670" />
        <path d={sleeve} fill="#c88a2e" opacity="0.38" />
        <g clipPath={`url(#${id("sleeve")})`}>
          <path d={ribs} stroke="#241913" strokeOpacity="0.09" strokeWidth="0.9" fill="none" />
          {/* Wrapped mark, one strip at a time */}
          {strips.map((st, i) => (
            <g key={i} clipPath={`url(#${id(`s${i}`)})`}>
              <use href={`#${id("mark")}`} transform={st.transform} fill="#241913" fillOpacity="0.9" />
            </g>
          ))}
          <text fill="#241913" fillOpacity="0.88" style={{ fontFamily: "var(--font-mono)", fontSize: 7.2, letterSpacing: "0.32em" }}>
            <textPath href={`#${id("arc")}`} startOffset="50%" textAnchor="middle">
              FURROWLINE · ALDER BEND
            </textPath>
          </text>
          {/* Sleeve rolled edges */}
          <path d={`M${r1(CX - radiusAt(SLEEVE.top))} ${SLEEVE.top + 1}${frontArc(SLEEVE.top + 1)}`} fill="none" stroke="#fff" strokeOpacity="0.35" />
          <path d={`M${r1(CX - radiusAt(SLEEVE.bottom))} ${SLEEVE.bottom - 1}${frontArc(SLEEVE.bottom - 1)}`} fill="none" stroke="#241913" strokeOpacity="0.25" />
        </g>
        {/* Shadow the sleeve's lower edge casts on the cup */}
        <path d={band(SLEEVE.bottom, SLEEVE.bottom + 5)} fill="#241913" opacity="0.22" />
        {/* Cylinder shading over everything printed on the body */}
        <path d={body} fill={`url(#${id("cyl")})`} />
        <path d={body} fill={`url(#${id("vshade")})`} />
        {/* Highlight streak */}
        <path
          d={`M${r1(CX - radiusAt(TOP.y) * 0.74)} ${TOP.y + 10}L${r1(CX - radiusAt(TOP.y) * 0.64)} ${TOP.y + 10}L${r1(CX - radiusAt(BOTTOM.y) * 0.62)} ${BOTTOM.y - 14}L${r1(CX - radiusAt(BOTTOM.y) * 0.7)} ${BOTTOM.y - 14}Z`}
          fill="#fff"
          opacity="0.3"
          filter={`url(#${id("streak")})`}
        />
      </g>

      {/* Lid (espresso plastic): its shadow on the cup, ribbed lip, top, raised plateau, sip slot */}
      <path d={band(TOP.y - 2, TOP.y + 9)} fill="#241913" opacity="0.42" />
      <path d={lipBand} fill="#3a2a20" />
      <path d={lipRidges} stroke="#fbf7f0" strokeOpacity="0.1" strokeWidth="1.1" />
      <path d={lipBand} fill={`url(#${id("lid")})`} />
      <path d={`M${CX - lip.r} ${lip.y + lip.h}A${lip.r} ${r1(lip.r * E)} 0 0 0 ${CX + lip.r} ${lip.y + lip.h}`} fill="none" stroke="#000" strokeOpacity="0.35" />
      <ellipse cx={CX} cy={lip.y} rx={lip.r} ry={lip.r * E} fill="#241913" />
      <ellipse cx={CX} cy={lip.y} rx={lip.r} ry={lip.r * E} fill={`url(#${id("lidtop")})`} />
      <ellipse cx={CX} cy={lip.y} rx={lip.r - 0.6} ry={lip.r * E - 0.6} fill="none" stroke="#fbf7f0" strokeOpacity="0.22" />
      <ellipse cx={CX} cy={lip.y + 1.5} rx={lip.r - 10} ry={(lip.r - 10) * E} fill="none" stroke="#000" strokeOpacity="0.3" />
      {/* Raised plateau */}
      <path d={plateauBand} fill="#3a2a20" />
      <path d={plateauBand} fill={`url(#${id("lid")})`} />
      <ellipse cx={CX} cy={plateau.y} rx={plateau.r} ry={plateau.r * E} fill="#3a2a20" />
      <ellipse cx={CX} cy={plateau.y} rx={plateau.r} ry={plateau.r * E} fill={`url(#${id("lidtop")})`} />
      <ellipse cx={CX} cy={plateau.y} rx={plateau.r - 0.5} ry={plateau.r * E - 0.5} fill="none" stroke="#fbf7f0" strokeOpacity="0.28" />
      {/* Sip slot and its recess */}
      <ellipse cx={CX - 4} cy={plateau.y + 10} rx="24" ry="5.5" fill="#000" opacity="0.18" />
      <rect x={CX - 15} y={plateau.y + 7.5} width="22" height="4.6" rx="2.3" fill="#000" opacity="0.85" />
      <path d={`M${CX - 13} ${plateau.y + 12.6}h18`} stroke="#fbf7f0" strokeOpacity="0.32" strokeWidth="0.8" />
    </svg>
  );
}
