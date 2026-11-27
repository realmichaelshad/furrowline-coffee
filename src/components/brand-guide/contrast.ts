/* ==========================================================================
   WCAG 2.1 contrast helpers for the brand guide's palette notes.
   The swatches print their own ratios ("14.6:1 · AAA") so the numbers on the
   sheet always match the hex values in brand/palette.json.
   ========================================================================== */

export type Rgb = readonly [number, number, number];

/** "#a4472a" or "a4472a" (also the 3-digit form) to 0-255 channels. */
export function hexToRgb(hex: string): Rgb {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`Not a hex colour: ${hex}`);
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Relative luminance (WCAG 2.1, sRGB). 0 for black, 1 for white. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two colours, 1 to 21. Order does not matter. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export type WcagLevel = "AAA" | "AA" | "AA large" | "Decorative";

/** WCAG level for normal-size text (large text needs 3:1 for AA, 4.5:1 for AAA). */
export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large";
  return "Decorative";
}

/** "14.6:1". One decimal, never rounded up across a WCAG threshold. */
export function formatRatio(ratio: number): string {
  let shown = Math.round(ratio * 10) / 10;
  for (const threshold of [3, 4.5, 7]) {
    if (ratio < threshold && shown >= threshold) shown = Math.floor(ratio * 10) / 10;
  }
  return `${shown.toFixed(1)}:1`;
}

/** The ink from `inks` with the highest contrast on `background`. */
export function bestInk(background: string, inks: readonly string[]): { ink: string; ratio: number } {
  if (inks.length === 0) throw new Error("bestInk needs at least one ink");
  let best = { ink: inks[0]!, ratio: contrastRatio(background, inks[0]!) };
  for (const ink of inks.slice(1)) {
    const ratio = contrastRatio(background, ink);
    if (ratio > best.ratio) best = { ink, ratio };
  }
  return best;
}
