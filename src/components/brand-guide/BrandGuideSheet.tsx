import type { CSSProperties } from "react";
import { LOGO_ASPECT, Logo } from "@/components/brand/Logo";
import { Mark } from "@/components/brand/Mark";
import { Stamp } from "@/components/brand/Stamp";
import { Bag } from "@/components/packaging/Bag";
import { Contours, Furrows } from "@/components/illustration/primitives";
import { SIGNATURE_COFFEES } from "@/content/products";
import { SITE } from "@/content/site";
import {
  COFFEE_SWATCHES,
  GUIDE_VERSION,
  PRIMARY_SWATCHES,
  SUPPORT_SWATCHES,
  VOICE_LINES,
  type Swatch,
} from "./guide-data";
import { ContourMask } from "./ContourMask";
import "./brand-guide.css";

/* ==========================================================================
   The one-page brand guide: a fixed 1280 × 769 composition on a 12-column
   grid (36 px margins), rendered to showcase/brand-guide.png by the
   showcase script. Six modules separated by hairline rules:
   (01) logo system and clear space   (02) colour
   (03) type   (04) packaging   (05) pattern and stamp   (06) voice
   Static: no motion, no lazy assets, so a screenshot is always complete.
   ========================================================================== */

/* Horizontal lockup geometry, in lockup units (see components/brand/Logo). */
const LOCKUP_H_UNITS = 2230;
const CAP_TOP_UNITS = 1520 - 1400;
const BASELINE_UNITS = 1520;

function ModuleHead({ index, title, note }: { index: number; title: string; note?: string }) {
  return (
    <div className="guide-head">
      <h3 className="guide-head-title">
        <span className="guide-head-index">({String(index).padStart(2, "0")})</span> {title}
      </h3>
      {note && <p className="guide-head-note">{note}</p>}
    </div>
  );
}

/* (01) Primary lockup with its clear-space diagram. */
function ClearSpace() {
  const tile = { w: 404, h: 192 };
  const lw = 252;
  const lh = lw / LOGO_ASPECT.horizontal;
  const x = (lh * 1400) / LOCKUP_H_UNITS; // clear-space unit: cap height of the wordmark
  const lx = (tile.w - lw) / 2;
  const ly = (tile.h - lh) / 2 - 6;
  const outer = { x: lx - x, y: ly - x, w: lw + 2 * x, h: lh + 2 * x };
  const capTop = ly + (CAP_TOP_UNITS / LOCKUP_H_UNITS) * lh;
  const baseline = ly + (BASELINE_UNITS / LOCKUP_H_UNITS) * lh;
  const fx = lx + lw + x / 2;
  const corners: Array<[number, number]> = [
    [outer.x, outer.y],
    [outer.x + outer.w - x, outer.y],
    [outer.x, outer.y + outer.h - x],
    [outer.x + outer.w - x, outer.y + outer.h - x],
  ];
  const r = (n: number) => Math.round(n * 10) / 10;
  return (
    <div className="guide-tile guide-tile-linen" style={{ width: tile.w, height: tile.h }}>
      <svg className="absolute inset-0" width={tile.w} height={tile.h} viewBox={`0 0 ${tile.w} ${tile.h}`} aria-hidden="true">
        <path
          fillRule="evenodd"
          fill="var(--color-clay)"
          fillOpacity="0.07"
          d={`M${r(outer.x)} ${r(outer.y)}h${r(outer.w)}v${r(outer.h)}h${r(-outer.w)}Z M${r(lx)} ${r(ly)}v${r(lh)}h${lw}v${r(-lh)}Z`}
        />
        <rect x={outer.x} y={outer.y} width={outer.w} height={outer.h} fill="none" stroke="var(--color-clay)" strokeDasharray="3 3" />
        <rect x={lx} y={ly} width={lw} height={lh} fill="none" stroke="var(--color-espresso)" strokeOpacity="0.28" strokeDasharray="2 2" />
        {corners.map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <rect x={cx} y={cy} width={x} height={x} fill="var(--color-clay)" fillOpacity="0.12" stroke="var(--color-clay)" strokeOpacity="0.55" />
            <text
              x={cx + x / 2}
              y={cy + x / 2 + 4.5}
              textAnchor="middle"
              fill="var(--color-clay-deep)"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 14 }}
            >
              x
            </text>
          </g>
        ))}
        {/* x = cap height */}
        <path
          d={`M${r(fx - 3)} ${r(capTop)}h6M${r(fx)} ${r(capTop)}V${r(baseline)}M${r(fx - 3)} ${r(baseline)}h6`}
          stroke="var(--color-clay)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
      <div className="absolute" style={{ left: lx, top: ly, width: lw }}>
        <Logo variant="horizontal" className="block h-auto w-full" title={`${SITE.name} primary logo`} />
      </div>
      <p className="guide-tile-label absolute bottom-[10px] left-[12px]">Primary lockup</p>
      <p className="guide-tile-label absolute right-[12px] bottom-[10px]">Clear space x = cap height</p>
    </div>
  );
}

function MinSizes() {
  const marks = [
    { h: 44, label: "44" },
    { h: 28, label: "28" },
    { h: 16, label: "16 px min" },
  ];
  const lockupW = 120;
  return (
    <div className="guide-minsizes">
      <div className="flex items-end gap-[22px]">
        {marks.map((m) => (
          <div key={m.h} className="flex flex-col items-start gap-[8px]">
            <div style={{ height: m.h }}>
              <Mark className="h-full w-auto" color="var(--color-clay)" />
            </div>
            <span className="guide-dim">{m.label}</span>
          </div>
        ))}
      </div>
      <div className="guide-minsizes-lockup">
        <div className="guide-dimline" style={{ width: lockupW }}>
          <span>{lockupW} px min</span>
        </div>
        <div style={{ width: lockupW }}>
          <Logo variant="horizontal" decorative className="block h-auto w-full" />
        </div>
        <span className="guide-dim">Smallest lockup</span>
      </div>
    </div>
  );
}

function BigSwatch({ s, width }: { s: Swatch; width: number }) {
  return (
    <div
      className="guide-swatch"
      style={{ width, background: s.hex, color: s.ink, boxShadow: s.name === "Parchment" ? "inset 0 0 0 1px var(--rule-strong)" : undefined }}
    >
      <p className="guide-swatch-name">{s.name}</p>
      <div>
        <p className="guide-swatch-hex">{s.hex}</p>
        <p className="guide-swatch-role">{s.role}</p>
        <p className="guide-swatch-ratio">
          {s.level} {s.ratio}
        </p>
      </div>
    </div>
  );
}

function Palette() {
  const widths = [150, 112, 112, 86];
  return (
    <div className="guide-palette">
      <div className="flex gap-[8px]">
        {PRIMARY_SWATCHES.map((s, i) => (
          <BigSwatch key={s.name} s={s} width={widths[i] ?? 100} />
        ))}
      </div>
      <div className="guide-chips">
        {SUPPORT_SWATCHES.map((s) => (
          <div
            key={s.name}
            className="guide-chip"
            style={{ background: s.hex, color: s.ink, boxShadow: s.name === "Linen" ? "inset 0 0 0 1px var(--rule)" : undefined }}
          >
            <span className="guide-chip-name">{s.name}</span>
            <span className="guide-chip-hex">{s.hex}</span>
          </div>
        ))}
      </div>
      <p className="guide-sublabel">Signature coffees · one colour per bag</p>
      <div className="guide-coffees">
        {COFFEE_SWATCHES.map((c) => (
          <div key={c.name} className="guide-coffee" style={{ background: c.hex, color: c.ink }}>
            <span className="guide-coffee-index">N° 0{c.index}</span>
            <span className="guide-coffee-name">{c.name}</span>
            <span className="guide-coffee-hex">{c.hex}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypePairing() {
  return (
    <div className="guide-type">
      <p className="guide-aa" aria-hidden="true">
        Aa<em>Aa</em>
      </p>
      <dl className="guide-type-list">
        <div>
          <dt className="font-display text-[19px] leading-none tracking-[-0.01em]">
            Fraunces <em className="text-clay">Italic</em>
          </dt>
          <dd>Display · 40–184 px</dd>
        </div>
        <div>
          <dt className="font-sans text-[15px] leading-none font-semibold">Instrument Sans</dt>
          <dd>Text &amp; UI · 13–21 px</dd>
        </div>
        <div>
          <dt className="font-mono text-[11.5px] leading-none tracking-[0.14em] uppercase">DM Mono</dt>
          <dd>Labels · 12 px · +0.14em</dd>
        </div>
      </dl>
    </div>
  );
}

/* Four bags (160 px tall, 111 wide) in a shallow arc across the 362 px panel. Each steps 84 px
   (0.76 of a bag), so the bag in front only ever covers the plain edge of the one behind: every
   name, origin line and brand row stays whole, even at thumbnail size. */
const FAN = [
  { x: -1.5, rot: -4, y: 8 },
  { x: 83, rot: -1.2, y: 0 },
  { x: 167.5, rot: 1.2, y: 0 },
  { x: 252, rot: 4, y: 8 },
];

function Packaging() {
  return (
    <div className="guide-pack">
      <ContourMask id="wide-a" size="864px 540px" position="-418px -166px" className="guide-pack-contours" />
      <div className="guide-pack-fan">
        {SIGNATURE_COFFEES.map((coffee, i) => {
          const f = FAN[i] ?? { x: 0, rot: 0, y: 0 };
          return (
            <div
              key={coffee.slug}
              className="guide-pack-bag"
              style={{ left: f.x, transform: `translateY(${f.y}px) rotate(${f.rot}deg)`, zIndex: i } as CSSProperties}
            >
              <Bag coffee={coffee} className="block h-full w-auto" title={`${coffee.name} bag`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Patterns() {
  return (
    <div className="guide-patterns">
      <div className="guide-pattern bg-clay">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 161 118" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <Contours
            hills={[
              { cx: 108, cy: 46, r: 70, levels: 10, stretch: 1.3, wobble: 0.22, seed: 7 },
              { cx: 12, cy: 112, r: 40, levels: 5, stretch: 1.4, wobble: 0.2, seed: 3 },
            ]}
            stroke="var(--color-linen)"
            opacity={0.75}
          />
        </svg>
        <p className="guide-pattern-label text-linen">Contour</p>
      </div>
      <div className="guide-pattern bg-espresso">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 161 118" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <Furrows width={161} height={118} rows={13} horizon={22} vanishX={112} bend={10} stroke="var(--color-mist)" strokeWidth={1.1} opacity={0.7} />
        </svg>
        <p className="guide-pattern-label text-mist">Furrow</p>
      </div>
      <div className="guide-stamp">
        <Stamp
          text="Small batch · Roasted Tuesday & Friday · Alder Bend · "
          color="var(--color-espresso)"
          markColor="var(--color-clay)"
          disc="var(--color-parchment)"
        />
      </div>
    </div>
  );
}

function Voice() {
  return (
    <div className="guide-voice">
      <p className="guide-voice-lead">
        Plain-spoken, specific, <em>warm.</em>
      </p>
      <ul className="guide-voice-list">
        {VOICE_LINES.map((v) => (
          <li key={v.label}>
            <span className="guide-dim">{v.label}</span>
            <q>{v.line}</q>
          </li>
        ))}
      </ul>
      <p className="guide-voice-rule">Short sentences, real numbers. No hype words, no exclamation marks.</p>
    </div>
  );
}

export function BrandGuideSheet() {
  return (
    <section data-sheet="brand-guide" className="guide-sheet" aria-labelledby="guide-sheet-title">
      <header className="guide-top">
        <div className="flex items-center gap-[14px]">
          <Mark className="h-[30px] w-auto" color="var(--color-clay)" />
          <h2 id="guide-sheet-title" className="guide-top-title">
            Brand <em>guidelines</em>
          </h2>
          <span className="guide-top-sep" aria-hidden="true" />
          <p className="guide-top-brand">{SITE.name}</p>
        </div>
        <p className="guide-top-meta">
          <span>Identity system</span>
          <span aria-hidden="true">·</span>
          <span>{GUIDE_VERSION.version}</span>
          <span aria-hidden="true">·</span>
          <span>{GUIDE_VERSION.date}</span>
        </p>
      </header>

      <div className="guide-row guide-row-1">
        <div className="guide-module guide-col-logo">
          <ModuleHead index={1} title="Logo" note="Furrowed bean · outlined Fraunces wordmark" />
          <div className="flex gap-[16px]">
            <div className="flex flex-col gap-[14px]">
              <ClearSpace />
              <MinSizes />
            </div>
            <div className="flex flex-1 flex-col gap-[12px]">
              <div className="guide-tile guide-tile-dark">
                <div className="w-[192px]">
                  <Logo
                    variant="horizontal"
                    markColor="var(--color-peach)"
                    textColor="var(--color-parchment)"
                    className="block h-auto w-full"
                    title={`${SITE.name} reversed logo`}
                  />
                </div>
                <p className="guide-tile-label absolute bottom-[10px] left-[12px]">Reversed · peach mark</p>
              </div>
              <div className="guide-tile guide-tile-clay">
                <div className="h-[86px]">
                  <Logo
                    variant="stacked"
                    markColor="var(--color-linen)"
                    textColor="var(--color-linen)"
                    className="block h-full w-auto"
                    title={`${SITE.name} stacked logo`}
                  />
                </div>
                <p className="guide-tile-label absolute bottom-[10px] left-[12px]">Stacked · one colour</p>
              </div>
            </div>
          </div>
        </div>

        <div className="guide-module guide-col-colour">
          <ModuleHead index={2} title="Colour" note="Contrast with the swatch's own ink" />
          <Palette />
        </div>
      </div>

      <div className="guide-row guide-row-2">
        <div className="guide-module guide-col-type">
          <ModuleHead index={3} title="Type" />
          <TypePairing />
        </div>
        <div className="guide-module guide-col-pack">
          <ModuleHead index={4} title="Packaging" note="The signature four" />
          <Packaging />
        </div>
        <div className="guide-module guide-col-pattern">
          <ModuleHead index={5} title="Pattern" />
          <Patterns />
        </div>
        <div className="guide-module guide-col-voice">
          <ModuleHead index={6} title="Voice" />
          <Voice />
        </div>
      </div>

      <footer className="guide-foot">
        <p>{SITE.conceptLine}</p>
        <p className="guide-foot-line">{SITE.tagline}</p>
        <p>Sheet 01 / 01</p>
      </footer>
    </section>
  );
}
