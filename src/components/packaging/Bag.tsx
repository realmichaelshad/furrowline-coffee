import { useId } from "react";
import type { CoffeeProduct } from "@/content/products";
import { ROAST_LEVELS } from "@/content/products";
import { MARK_D, MARK_BOX } from "@/components/brand/mark-data";
import { Motif, MOTIF_H, MOTIF_W } from "./motifs";

/* ==========================================================================
   Coffee bag illustration: a stand-up pouch with crimped seal, degassing
   valve, soft cylinder shading, and a label with an arched landscape window.
   viewBox 0 0 320 460 (bag body 22-298 wide, 20-432 tall, shadow below).
   ========================================================================== */

export const BAG_VIEWBOX = "0 0 320 460";

const BODY =
  "M40 22H280L285 62C291 160 296 300 298 394C299 416 288 430 266 432H54C32 430 21 416 22 394C24 300 29 160 35 62Z";
const WINDOW = { x: 70, y: 112, w: MOTIF_W, h: MOTIF_H };
const ARCH = `M${WINDOW.x} ${WINDOW.y + WINDOW.h}V${WINDOW.y + 90}A90 90 0 0 1 ${WINDOW.x + WINDOW.w} ${WINDOW.y + 90}V${WINDOW.y + WINDOW.h}Z`;

/** DM Mono is monospaced: every glyph advances 0.6 em, plus the tracking. */
const monoWidth = (text: string, size: number, tracking: number) => text.length * size * (0.6 + tracking);

/** The label's measure for small print: the rule spans 66-254 (188 units), less 8 units clear at each end. */
const LABEL_MEASURE = 172;

function nameLines(name: string): string[] {
  const words = name.split(" ");
  if (words.length <= 2) return words;
  return [words.slice(0, -1).join(" "), words[words.length - 1]!];
}

export interface BagProps {
  coffee: Pick<CoffeeProduct, "name" | "palette" | "art" | "originLabel" | "processLabel" | "roast" | "notes"> & {
    signatureIndex?: number;
  };
  className?: string;
  /** "simple" drops the small print, for thumbnails under ~120px. */
  detail?: "full" | "simple";
  /** Accessible label; defaults to "<name> coffee bag". Pass decorative for aria-hidden. */
  title?: string;
  decorative?: boolean;
  /** Draw the soft floor shadow. */
  shadow?: boolean;
}

export function Bag({ coffee, className, detail = "full", title, decorative = false, shadow = true }: BagProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { palette } = coffee;
  const roastStep = ROAST_LEVELS.find((r) => r.id === coffee.roast)?.step ?? 2;
  const roastLabel = ROAST_LEVELS.find((r) => r.id === coffee.roast)?.label ?? "";
  const lines = nameLines(coffee.name);
  const ink = palette.ink;
  const markScale = 18 / MARK_BOX.height;
  // The notes line shares the bottom rule with the roast bars: shrink long notes to fit 160 units.
  const notesText = coffee.notes.join(", ").toLowerCase();
  const notesSize = Math.min(11.5, 160 / (notesText.length * 0.47));
  // Process and roast share one line when it fits the label's measure; longer pairs (blends, decaf)
  // stack, and the small print tightens up while the footer drops a few units to make room.
  const roastLine = `${roastLabel} roast`;
  const specLine = `${coffee.processLabel} · ${roastLine}`.toUpperCase();
  const specLines =
    monoWidth(specLine, 8, 0.16) <= LABEL_MEASURE
      ? [specLine]
      : [coffee.processLabel.toUpperCase(), roastLine.toUpperCase()];
  const stacked = specLines.length > 1;
  const originY = (lines.length > 1 ? 364 : 334) - (stacked ? 4 : 0);
  const specY = originY + (stacked ? 13 : 14);
  const footerY = stacked ? 4 : 0;

  return (
    <svg
      viewBox={BAG_VIEWBOX}
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : (title ?? `${coffee.name} coffee bag`)}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${uid}-shade`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.07" stopColor="#000" stopOpacity="0.08" />
          <stop offset="0.2" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.32" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="0.62" stopColor="#000" stopOpacity="0" />
          <stop offset="0.86" stopColor="#000" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id={`${uid}-fold`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.12" />
          <stop offset="0.14" stopColor="#000" stopOpacity="0" />
          <stop offset="0.86" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id={`${uid}-floor`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#241913" stopOpacity="0.42" />
          <stop offset="1" stopColor="#241913" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-body`}>
          <path d={BODY} />
        </clipPath>
        <clipPath id={`${uid}-arch`}>
          <path d={ARCH} />
        </clipPath>
      </defs>

      {shadow && <ellipse cx="160" cy="440" rx="150" ry="14" fill={`url(#${uid}-floor)`} />}

      <g clipPath={`url(#${uid}-body)`}>
        <rect width="320" height="460" fill={palette.bag} />

        {/* Crimped seal band */}
        <rect x="0" y="22" width="320" height="34" fill="#000" opacity="0.08" />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1="30" x2="290" y1={27 + i * 4} y2={27 + i * 4} stroke="#000" strokeOpacity="0.12" strokeWidth="1" />
        ))}
        <line x1="30" x2="290" y1="58" y2="58" stroke="#fff" strokeOpacity="0.25" strokeWidth="1" />

        {/* Brand row */}
        <path d={MARK_D} fill={ink} transform={`translate(58 72) scale(${markScale}) translate(${-MARK_BOX.x} ${-MARK_BOX.y})`} />
        <text
          x="76"
          y="85.5"
          fill={ink}
          style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: "0.22em" }}
        >
          FURROWLINE
        </text>
        <text
          x="262"
          y="85.5"
          textAnchor="end"
          fill={ink}
          style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: "0.16em" }}
        >
          {coffee.signatureIndex ? `N° 0${coffee.signatureIndex}` : "SMALL BATCH"}
        </text>
        <circle cx="160" cy="80" r="7.5" fill="#000" opacity="0.14" />
        <circle cx="160" cy="80" r="4.5" fill="none" stroke={ink} strokeOpacity="0.5" strokeWidth="1" />

        {/* Arched landscape window */}
        <g clipPath={`url(#${uid}-arch)`}>
          <g transform={`translate(${WINDOW.x} ${WINDOW.y})`}>
            <Motif art={coffee.art} palette={palette} />
          </g>
        </g>
        <path d={ARCH} fill="none" stroke={ink} strokeOpacity="0.85" strokeWidth="1.4" />

        {/* Name */}
        <text
          x="160"
          textAnchor="middle"
          fill={ink}
          style={{ fontFamily: "var(--font-display)", fontSize: 38, letterSpacing: "-0.02em", fontWeight: 420 }}
        >
          {lines.map((line, i) => (
            <tspan key={line} x="160" y={300 + i * 36}>
              {line}
            </tspan>
          ))}
        </text>

        {detail === "full" && (
          <>
            <text
              x="160"
              y={originY}
              textAnchor="middle"
              fill={ink}
              style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em" }}
            >
              {coffee.originLabel.toUpperCase()}
            </text>
            <text
              x="160"
              textAnchor="middle"
              fill={ink}
              opacity="0.8"
              style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.16em" }}
            >
              {specLines.map((line, i) => (
                <tspan key={line} x="160" y={specY + i * 10.5}>
                  {line}
                </tspan>
              ))}
            </text>
            <line x1="66" x2="254" y1={392 + footerY} y2={392 + footerY} stroke={ink} strokeOpacity="0.4" strokeWidth="1" />
            <text
              x="66"
              y={410 + footerY}
              fill={ink}
              style={{ fontFamily: "var(--font-display)", fontSize: notesSize, fontStyle: "italic" }}
            >
              {notesText}
            </text>
            {/* Roast scale: four furrow bars */}
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={232 + i * 6}
                y={402 + footerY}
                width="3.2"
                height="10"
                rx="1"
                fill={ink}
                opacity={i < roastStep ? 0.9 : 0.25}
              />
            ))}
          </>
        )}

        {/* Shading */}
        <rect width="320" height="460" fill={`url(#${uid}-shade)`} />
        <rect width="320" height="460" fill={`url(#${uid}-fold)`} />
        <path d="M96 60C94 180 98 320 92 430" stroke="#fff" strokeOpacity="0.07" strokeWidth="10" fill="none" />
        <path d="M226 60C230 200 224 330 230 430" stroke="#000" strokeOpacity="0.05" strokeWidth="14" fill="none" />
      </g>

      {/* Tear notches */}
      <path d="M35 62L41 66L35.5 70" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="1" />
      <path d="M285 62L279 66L284.5 70" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  );
}
