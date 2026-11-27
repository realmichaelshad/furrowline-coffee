import palette from "../../../brand/palette.json";
import { bestInk, contrastRatio, formatRatio, wcagLevel, type WcagLevel } from "./contrast";

/* ==========================================================================
   Content for the brand guide sheet and its breakdown. Colours come straight
   from brand/palette.json (the same file the exports are built from), and
   each swatch's contrast note is computed from the hex values.
   ========================================================================== */

const INKS = {
  espresso: "#241913",
  parchment: "#f4ecdf",
  linen: "#fbf7f0",
} as const;

const INK_NAME: Record<string, string> = {
  [INKS.espresso]: "Espresso",
  [INKS.parchment]: "Parchment",
  [INKS.linen]: "Linen",
};

export interface Swatch {
  name: string;
  hex: string;
  role: string;
  /** Text colour used on the swatch (highest-contrast brand ink). */
  ink: string;
  inkName: string;
  ratio: string;
  level: WcagLevel;
}

/* Text on each swatch: espresso or parchment (the documented pairs), linen on the clays. */
function inksFor(name: string): readonly string[] {
  return name.startsWith("Clay") ? [INKS.espresso, INKS.linen] : [INKS.espresso, INKS.parchment];
}

function swatch(name: string, hex: string, role: string, inks: readonly string[] = inksFor(name)): Swatch {
  const best = bestInk(hex, inks);
  return {
    name,
    hex: hex.toUpperCase(),
    role,
    ink: best.ink,
    inkName: INK_NAME[best.ink] ?? "Ink",
    ratio: formatRatio(best.ratio),
    level: wcagLevel(best.ratio),
  };
}

const CORE = Object.fromEntries(palette.core.map((c) => [c.name, c])) as Record<string, (typeof palette.core)[number]>;

function core(name: string, role?: string): Swatch {
  const c = CORE[name];
  if (!c) throw new Error(`Unknown palette colour: ${name}`);
  return swatch(c.name, c.hex, role ?? c.role);
}

/** The four colours that carry the identity, shown large. */
export const PRIMARY_SWATCHES: Swatch[] = [
  core("Espresso", "Ink, dark surfaces"),
  core("Parchment", "Page and paper"),
  core("Clay", "Accent, the mark"),
  core("Moss", "Success, subscriptions"),
];

/** Supporting colours, shown as chips. */
export const SUPPORT_SWATCHES: Swatch[] = ["Loam", "Bark", "Oat", "Linen", "Clay deep", "Peach", "Ochre", "Mist"].map((n) =>
  core(n),
);

/** Every core colour (the breakdown lists all of them). */
export const ALL_CORE_SWATCHES: Swatch[] = palette.core.map((c) => swatch(c.name, c.hex, c.role));

export interface CoffeeSwatch extends Swatch {
  index: number;
  stage: string;
}

export const COFFEE_SWATCHES: CoffeeSwatch[] = palette.coffees.map((c, i) => ({
  ...swatch(c.name, c.hex, "Bag and showcase colour", [c.ink]),
  index: i + 1,
  stage: c.stage.toUpperCase(),
}));

/** Contrast of a pair, for the notes in the breakdown. */
export function pairNote(fg: string, bg: string): string {
  const ratio = contrastRatio(fg, bg);
  return `${formatRatio(ratio)} · ${wcagLevel(ratio)}`;
}

export const TYPE_SPECS = [
  {
    family: "Fraunces",
    role: "Display",
    detail: "Headlines, product names, prices in big moments. Optical size on, soft. Italic for the one word that matters.",
    sizes: "40 – 184 px",
    className: "font-display",
  },
  {
    family: "Instrument Sans",
    role: "Text & UI",
    detail: "Body copy, buttons, forms and navigation. Short lines, generous leading.",
    sizes: "13 – 21 px",
    className: "font-sans",
  },
  {
    family: "DM Mono",
    role: "Labels",
    detail: "Eyebrows, numbering, coordinates and meta lines. Uppercase, tracked +0.14em.",
    sizes: "12 px",
    className: "font-mono",
  },
] as const;

export const VOICE_LINES = [
  { label: "Headline", line: "Follow the line from farm to cup." },
  { label: "Product", line: "Jasmine, bergamot and white peach from the Guji highlands." },
  { label: "Process", line: "Every batch is roasted by hand, by ear and by smell, twice a week." },
] as const;

export const VOICE_MORE = [
  {
    label: "Empty cart",
    line: "Nothing in the hopper yet. Start with a signature coffee, or let three quick questions pick one for you.",
  },
  { label: "Form error", line: "That doesn't look like an email address. Check for a missing @ or dot." },
  { label: "Success", line: "You're on the list. The first letter goes out on the next roast day." },
] as const;

export const VOICE_RULES = [
  "Short sentences. Real numbers.",
  "Farms, weather, roast days and what's in the cup.",
  "No hype words, no exclamation marks.",
] as const;

export const GUIDE_VERSION = { version: "v1.0", date: "October 2026" } as const;
