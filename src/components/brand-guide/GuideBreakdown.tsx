import type { CSSProperties, ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Mark } from "@/components/brand/Mark";
import { Stamp } from "@/components/brand/Stamp";
import { Furrows } from "@/components/illustration/primitives";
import { Texture } from "@/components/illustration/Texture";
import { ProductImage } from "@/components/product/ProductImage";
import { Button, ArrowLink } from "@/components/ui/Button";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import { ROAST_LEVELS, SIGNATURE_COFFEES } from "@/content/products";
import { SITE } from "@/content/site";
import { ALL_CORE_SWATCHES, COFFEE_SWATCHES, TYPE_SPECS, VOICE_LINES, VOICE_MORE, VOICE_RULES, pairNote } from "./guide-data";

/* ==========================================================================
   The guide, readable at any width: the same six parts as the sheet, each
   with a sticky intro on the left (desktop) and the detail on the right.
   ========================================================================== */

function Part({
  id,
  index,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  index: number;
  eyebrow: string;
  title: ReactNode[];
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="guide-part">
      <div className="guide-page-shell">
        <div className="grid-editorial gap-y-10">
          <div className="col-span-4 md:col-span-4">
            <div className="guide-part-intro">
              <Eyebrow index={index} className="mb-5 text-bark">
                {eyebrow}
              </Eyebrow>
              <Lines id={`${id}-title`} lines={title} className="display text-h1" />
              <p data-reveal="rise" data-reveal-delay={120} className="mt-5 max-w-[36ch] text-body text-bark">
                {lead}
              </p>
            </div>
          </div>
          <div className="col-span-4 md:col-span-8">{children}</div>
        </div>
      </div>
    </section>
  );
}

function Tile({ className, label, children, style }: { className: string; label: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <figure className="guide-note-tile" data-reveal="rise">
      <div className={`guide-note-tile-art ${className}`} style={style}>
        {children}
      </div>
      <figcaption className="mt-3 text-small text-bark">{label}</figcaption>
    </figure>
  );
}

function LogoPart() {
  const rules = [
    { term: "Clear space", def: "Keep the cap height of the wordmark (x) clear on every side of any lockup." },
    {
      term: "Minimum size",
      def: "Mark 16 px. Horizontal lockup 120 px wide; below that, drop the descriptor and use the compact lockup.",
    },
    {
      term: "Colour",
      def: "Clay mark and espresso type on light grounds. Peach mark and parchment type on espresso and photographs. One colour anywhere else.",
    },
    { term: "Don't", def: "Recolour it outside the palette, stretch it, add effects, or set the wordmark in live type." },
  ];
  return (
    <Part
      id="guide-logo"
      index={1}
      eyebrow="Logo"
      title={["The furrowed", <em key="em">bean.</em>]}
      lead="A coffee bean ploughed with four S-shaped furrows, next to a wordmark cut from Fraunces and outlined, so the logo never depends on a font being installed."
    >
      <div className="grid gap-x-[var(--spacing-grid)] gap-y-8 sm:grid-cols-2">
        <Tile className="bg-linen shadow-[inset_0_0_0_1px_var(--rule)]" label="Primary lockup. The default on light grounds.">
          <Logo variant="horizontal" className="h-auto w-[74%]" title={`${SITE.name} primary logo`} />
        </Tile>
        <Tile className="bg-espresso" label="Reversed. On espresso and over photography.">
          <Logo
            variant="horizontal"
            markColor="var(--color-peach)"
            textColor="var(--color-parchment)"
            className="h-auto w-[74%]"
            title={`${SITE.name} reversed logo`}
          />
        </Tile>
        <Tile className="bg-clay" label="Stacked, one colour. Packaging, signage and square formats.">
          <Logo
            variant="stacked"
            markColor="var(--color-linen)"
            textColor="var(--color-linen)"
            className="h-[62%] w-auto"
            title={`${SITE.name} stacked logo`}
          />
        </Tile>
        <Tile className="bg-oat" label="The mark alone. Favicon, stamps and small spaces; 16 px at the smallest.">
          <div className="flex items-end gap-[8%]">
            <Mark className="h-[clamp(4rem,9vw,7rem)] w-auto" color="var(--color-clay)" title="Furrowline mark" />
            <Mark className="h-[clamp(2.5rem,5vw,4rem)] w-auto" color="var(--color-espresso)" />
            <Mark className="h-4 w-auto" color="var(--color-clay)" />
          </div>
        </Tile>
      </div>
      <dl className="mt-12 grid gap-x-[var(--spacing-grid)] sm:grid-cols-2">
        {rules.map((r) => (
          <div key={r.term} className="rule-t py-5" data-reveal="rise">
            <dt className="eyebrow mb-2 text-clay-deep">{r.term}</dt>
            <dd className="max-w-[44ch] text-small text-bark">{r.def}</dd>
          </div>
        ))}
      </dl>
    </Part>
  );
}

function ColourPart() {
  return (
    <Part
      id="guide-colour"
      index={2}
      eyebrow="Colour"
      title={["Twelve colours,", <em key="em">four coffees.</em>]}
      lead="Earth tones from the roastery floor: espresso ink on parchment, clay for the one thing to press, moss for anything that went well. Every text pairing passes WCAG AA."
    >
      <ul className="guide-swatch-grid">
        {ALL_CORE_SWATCHES.map((s) => (
          <li key={s.name} data-reveal="rise">
            <div
              className="guide-note-swatch"
              style={{ background: s.hex, color: s.ink, boxShadow: s.name === "Linen" || s.name === "Parchment" ? "inset 0 0 0 1px var(--rule)" : undefined }}
            >
              <span className="display text-[1.375rem] leading-none">{s.name}</span>
              <span className="font-mono text-[0.75rem] tracking-[0.08em]">{s.hex}</span>
            </div>
            <p className="mt-2.5 text-small">{s.role}</p>
            <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.08em] text-bark uppercase">
              {s.inkName} text <span className="whitespace-nowrap">{s.ratio} {s.level}</span>
            </p>
          </li>
        ))}
      </ul>
      <h3 className="eyebrow mt-14 mb-5 text-bark">Signature coffees · bag and stage</h3>
      <ul className="grid grid-cols-2 gap-[var(--spacing-grid)] lg:grid-cols-4">
        {COFFEE_SWATCHES.map((c) => (
          <li key={c.name} data-reveal="rise">
            <div className="guide-note-coffee" style={{ color: c.ink }}>
              <span className="guide-note-coffee-bag" style={{ background: c.hex }} />
              <span className="guide-note-coffee-stage" style={{ background: c.stage }} />
              <span className="relative font-mono text-[0.6875rem] tracking-[0.1em]">N° 0{c.index}</span>
              <span className="display relative text-[1.375rem] leading-none">{c.name}</span>
            </div>
            <p className="mt-2.5 font-mono text-[0.6875rem] tracking-[0.08em] text-bark uppercase">
              Bag {c.hex} · Stage {c.stage}
            </p>
            <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.08em] text-bark uppercase">Label ink {pairNote(c.ink, c.hex)}</p>
          </li>
        ))}
      </ul>
    </Part>
  );
}

function TypePart() {
  const scale = [184, 124, 84, 64, 44, 28, 21, 17, 15, 13];
  return (
    <Part
      id="guide-type"
      index={3}
      eyebrow="Type"
      title={["Three families,", <em key="em">one voice.</em>]}
      lead="An oversized, soft serif for the moments that matter, a plain sans for reading and doing, and a mono for the labels a roaster would stencil on a sack."
    >
      <div className="grid gap-0">
        {TYPE_SPECS.map((t, i) => (
          <div key={t.family} className="rule-t grid gap-4 py-8 md:grid-cols-8 md:gap-[var(--spacing-grid)]" data-reveal="rise">
            <div className="md:col-span-3">
              <p className="eyebrow text-clay-deep">
                {t.role} · {t.sizes}
              </p>
              <p className={`${t.className} mt-2 text-h3`}>{t.family}</p>
              <p className="mt-2 max-w-[36ch] text-small text-bark">{t.detail}</p>
            </div>
            <div className="md:col-span-5">
              {i === 0 && (
                <p className="display text-[clamp(2.75rem,5.4vw,4.75rem)] leading-[0.95] tracking-[-0.03em]">
                  Follow <em className="text-clay">the line</em> from farm to cup.
                </p>
              )}
              {i === 1 && (
                <p className="text-lead">
                  Seasonal coffee from twelve partner farms, roasted twice a week and at your door two days later. Every
                  bag says where it grew, who grew it and the day we roasted it.
                </p>
              )}
              {i === 2 && (
                <p className="eyebrow grid gap-2 text-[0.8125rem]">
                  <span>N° 01 · Guji, Ethiopia</span>
                  <span>1,950 – 2,200 m · Washed</span>
                  <span>Roasted Tuesday · Batch 15 kg</span>
                </p>
              )}
            </div>
          </div>
        ))}
        <div className="rule-t pt-8" data-reveal="rise">
          <p className="eyebrow mb-5 text-bark">Scale, in px</p>
          <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-3" aria-label="Type scale">
            {scale.map((px) => (
              <li key={px} className="display leading-none" style={{ fontSize: `${Math.max(13, Math.min(px, 64)) / 16}rem` }}>
                {px}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Part>
  );
}

function PackagingPart() {
  const anatomy = [
    "Crimped seal with tear notches and a one-way valve.",
    "An arched window onto the landscape the coffee grew in.",
    "Name in Fraunces, origin and process in DM Mono.",
    "Tasting notes in italic and a four-bar roast scale.",
  ];
  return (
    <Part
      id="guide-packaging"
      index={4}
      eyebrow="Packaging"
      title={["One pouch,", <em key="em">four landscapes.</em>]}
      lead="Every coffee gets its own colour and a small landscape inside the same arch: terraces at sunrise for Guji, honey-lit ridges for Huila, a raked patio for Huehuetenango, a ploughed night field for the house blend."
    >
      <ul className="grid grid-cols-2 gap-[var(--spacing-grid)] lg:grid-cols-4">
        {SIGNATURE_COFFEES.map((c) => (
          <li key={c.slug} data-reveal="rise">
            <div className="guide-note-bag" style={{ background: c.palette.stage }}>
              <div className="w-[72%]">
                <ProductImage product={c} sizes="(min-width: 64rem) 12vw, 32vw" />
              </div>
            </div>
            <p className="display mt-3 text-h3">{c.name}</p>
            <p className="mt-1 text-small text-bark">
              {c.originLabel} · {ROAST_LEVELS.find((r) => r.id === c.roast)?.label} roast
            </p>
          </li>
        ))}
      </ul>
      <ol className="mt-12 grid gap-x-[var(--spacing-grid)] sm:grid-cols-2">
        {anatomy.map((a, i) => (
          <li key={a} className="rule-t flex gap-4 py-5 text-small text-bark" data-reveal="rise">
            <span className="eyebrow text-clay-deep">0{i + 1}</span>
            <span>{a}</span>
          </li>
        ))}
      </ol>
    </Part>
  );
}

function PatternPart() {
  return (
    <Part
      id="guide-pattern"
      index={5}
      eyebrow="Pattern and stamp"
      title={["Contour", <em key="em">and furrow.</em>]}
      lead="Two patterns drawn from the land: topographic rings for the hills the farms sit on, and furrow rows for the plough. Both are quiet backdrops, never the main event. The roast stamp signs off packaging and photos."
    >
      <div className="grid gap-[var(--spacing-grid)] sm:grid-cols-3">
        <Tile className="relative bg-clay" label="Contour. Rings at 1 px, one colour, cropped off the edge.">
          <Texture id="square-a" className="text-linen/70" />
        </Tile>
        <Tile className="relative bg-espresso" label="Furrow. Rows converging on a horizon, 1 to 1.5 px.">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <Furrows width={300} height={300} rows={18} horizon={70} vanishX={200} bend={18} stroke="var(--color-mist)" strokeWidth={1.2} opacity={0.7} />
          </svg>
        </Tile>
        <Tile className="bg-oat" label="Roast stamp. Turns slowly where motion is welcome.">
          <Stamp
            className="w-[62%]"
            color="var(--color-espresso)"
            markColor="var(--color-clay)"
            disc="var(--color-parchment)"
            spin
          />
        </Tile>
      </div>
    </Part>
  );
}

function VoicePart() {
  return (
    <Part
      id="guide-voice"
      index={6}
      eyebrow="Voice"
      title={["Plain-spoken,", "specific,", <em key="em">warm.</em>]}
      lead="We talk like the people at the roaster: about farms, weather, roast days and what is in the cup."
    >
      <ul className="grid gap-x-[var(--spacing-grid)] sm:grid-cols-3">
        {VOICE_RULES.map((r, i) => (
          <li key={r} className="rule-t py-5" data-reveal="rise">
            <span className="eyebrow text-clay-deep">0{i + 1}</span>
            <p className="mt-2 text-small">{r}</p>
          </li>
        ))}
      </ul>
      <ul className="mt-10 grid gap-[var(--spacing-grid)] md:grid-cols-2">
        {[...VOICE_LINES, ...VOICE_MORE].map((v) => (
          <li key={v.label} className="guide-note-voice" data-reveal="rise">
            <span className="eyebrow text-bark">{v.label}</span>
            <q className="display mt-3 block text-[1.5rem] leading-[1.2] italic">{v.line}</q>
          </li>
        ))}
      </ul>
    </Part>
  );
}

export function GuideBreakdown() {
  return (
    <div className="guide-notes">
      <LogoPart />
      <ColourPart />
      <TypePart />
      <PackagingPart />
      <PatternPart />
      <VoicePart />
      <section aria-labelledby="guide-next-title" className="guide-page-shell pt-section-sm pb-section">
        <div className="guide-next on-dark" data-reveal="rise">
          <div>
            <p className="eyebrow text-mist">Next</p>
            <h2 id="guide-next-title" className="display mt-4 text-h1 text-parchment">
              See it on a cup, a pouch <em className="text-peach">and the sign.</em>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href="/brand-board" variant="light" size="lg" icon="arrow" magnetic>
              Open the brand board
            </Button>
            <ArrowLink href="/shop" className="text-parchment">
              Shop the coffee
            </ArrowLink>
          </div>
        </div>
      </section>
    </div>
  );
}
