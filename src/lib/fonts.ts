import localFont from "next/font/local";

// Self-hosted subsets of the OFL families shipped in @fontsource-variable/fraunces,
// @fontsource-variable/instrument-sans and @fontsource/dm-mono (Latin + punctuation only).
// Fraunces is used at display sizes, so the optical-size axis is fixed at 120 (SOFT 50): that halves
// the files. Roman keeps a 300-600 weight axis; the italic is a single instance at wght 380 (WONK on).

export const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces-roman.woff2", style: "normal", weight: "300 600" },
    { path: "../fonts/fraunces-italic.woff2", style: "italic", weight: "300 600" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const instrumentSans = localFont({
  src: [{ path: "../fonts/instrument-sans.woff2", style: "normal", weight: "400 700" }],
  variable: "--font-instrument",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const dmMono = localFont({
  src: [{ path: "../fonts/dm-mono-500.woff2", style: "normal", weight: "500" }],
  variable: "--font-dm-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "Menlo", "monospace"],
  adjustFontFallback: false,
});

export const fontVariables = `${fraunces.variable} ${instrumentSans.variable} ${dmMono.variable}`;
