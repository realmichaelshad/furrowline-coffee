/* ==========================================================================
   npm run brand
   Exports the identity from the same source the site renders:
   - brand/logo.svg, logo-reversed.svg, logo-stacked.svg, wordmark.svg,
     icon.svg (the mark), palette.json
   - src/app/icon.svg, src/app/apple-icon.png, src/app/favicon.ico
   - public/icons/icon-192.png, icon-512.png, icon-maskable-512.png
   - src/app/opengraph-image.jpg (+ .alt.txt), the social share card
   - public/textures/<id>.svg contour textures (src/content/textures.ts)
     and public/textures/grain.webp, the film-grain tile
   - public/packaging/<slug>[--<variant>].webp (800 × 1150), every product's art
     pre-rendered for cards and rows (see <ProductImage>)
   PNGs are rendered with Playwright (the pinned Chromium in this repo).
   Re-run after changing the logo, packaging art, textures or palette.
   ========================================================================== */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium, type Page } from "playwright";
import sharp from "sharp";
import { Logo } from "../src/components/brand/Logo";
import { MARK_BOX, MARK_D } from "../src/components/brand/mark-data";
import { Bag } from "../src/components/packaging/Bag";
import { ProductArt } from "../src/components/packaging/ProductArt";
import { PRODUCTS, getProduct, type CoffeeProduct } from "../src/content/products";
import { TEXTURES, type TextureSpec } from "../src/content/textures";
import { contourRings } from "../src/lib/geometry";
import { SITE } from "../src/content/site";

const ROOT = path.resolve(import.meta.dirname, "..");
const out = (...p: string[]) => path.join(ROOT, ...p);

export const PALETTE = {
  core: [
    { name: "Espresso", hex: "#241913", role: "Ink: text, dark surfaces, footer" },
    { name: "Loam", hex: "#3a2a20", role: "Deep surface" },
    { name: "Bark", hex: "#5c4a3c", role: "Secondary text on light" },
    { name: "Parchment", hex: "#f4ecdf", role: "Page background" },
    { name: "Linen", hex: "#fbf7f0", role: "Raised surfaces: cards, drawer, inputs" },
    { name: "Oat", hex: "#e9ddc8", role: "Alternate section background" },
    { name: "Clay", hex: "#a4472a", role: "Primary accent, calls to action, the mark" },
    { name: "Clay deep", hex: "#8e3a20", role: "Hover and pressed clay" },
    { name: "Peach", hex: "#efa47a", role: "Accent on dark surfaces" },
    { name: "Moss", hex: "#4b5a32", role: "Secondary accent, success" },
    { name: "Ochre", hex: "#c88a2e", role: "Highlights, badges" },
    { name: "Mist", hex: "#c9b9a3", role: "Secondary text on dark" },
  ],
  coffees: [
    { name: "First Light", hex: "#f0b48f", stage: "#efc3a4", ink: "#241913" },
    { name: "Honey Ridge", hex: "#b4412f", stage: "#9e3a2a", ink: "#fbf1e4" },
    { name: "Highland Almanac", hex: "#db8a35", stage: "#d9963f", ink: "#241913" },
    { name: "Deep Field", hex: "#3b1c22", stage: "#2b1418", ink: "#f4ecdf" },
  ],
  type: {
    display: "Fraunces (Google Fonts, OFL), optical size on, weight 330-420, SOFT 50",
    text: "Instrument Sans (Google Fonts, OFL), weight 400-600",
    label: "DM Mono 500 (Google Fonts, OFL), uppercase, +0.14em tracking",
  },
};

function svgDoc(markup: string): string {
  // renderToStaticMarkup omits the namespace React adds implicitly in the DOM.
  const withNs = markup.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
  return `<?xml version="1.0" encoding="UTF-8"?>\n${withNs.replace(/ style="aspect-ratio:[^"]*"/, "")}\n`;
}

function markSvg({ size, bg, fg, radius, scale }: { size: number; bg?: string; fg: string; radius?: number; scale: number }) {
  const h = size * scale;
  const s = h / MARK_BOX.height;
  const w = MARK_BOX.width * s;
  const bgRect = bg ? `<rect width="${size}" height="${size}" rx="${radius ?? 0}" fill="${bg}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${bgRect}<path fill="${fg}" transform="translate(${((size - w) / 2).toFixed(2)} ${((size - h) / 2).toFixed(2)}) scale(${s.toFixed(5)}) translate(${-MARK_BOX.x} ${-MARK_BOX.y})" d="${MARK_D}"/></svg>`;
}

/** Packs PNG buffers into a .ico container (PNG-compressed entries, Vista+). */
function toIco(pngs: Array<{ size: number; data: Buffer }>): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries: Buffer[] = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const FONT_CSS = `
@font-face { font-family: "Fraunces"; src: url("${pathToFileURL(out("src/fonts/fraunces-roman.woff2"))}") format("woff2"); font-weight: 300 700; }
@font-face { font-family: "Fraunces"; font-style: italic; src: url("${pathToFileURL(out("src/fonts/fraunces-italic.woff2"))}") format("woff2"); font-weight: 300 700; }
@font-face { font-family: "Instrument Sans"; src: url("${pathToFileURL(out("src/fonts/instrument-sans.woff2"))}") format("woff2"); font-weight: 400 700; }
@font-face { font-family: "DM Mono"; src: url("${pathToFileURL(out("src/fonts/dm-mono-500.woff2"))}") format("woff2"); font-weight: 500; }
:root { --font-display: "Fraunces", Georgia, serif; --font-sans: "Instrument Sans", sans-serif; --font-mono: "DM Mono", monospace;
  --color-clay: #a4472a; --color-peach: #efa47a; --color-parchment: #f4ecdf; --color-espresso: #241913; }
* { margin: 0; box-sizing: border-box; }
`;

function ogHtml(): string {
  const firstLight = getProduct("first-light") as CoffeeProduct;
  const bag = renderToStaticMarkup(createElement(Bag, { coffee: firstLight, decorative: true, shadow: false }));
  const logo = renderToStaticMarkup(
    createElement(Logo, { variant: "horizontal", decorative: true, textColor: "#f4ecdf", markColor: "#efa47a" }),
  );
  const photo = pathToFileURL(out("public/photos/hero-pour.webp"));
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONT_CSS}
  body { width: 1200px; height: 630px; overflow: hidden; background: #241913; font-family: var(--font-sans); }
  .photo { position: absolute; inset: 0; background: url("${photo}") 62% 46% / cover no-repeat; }
  .wash { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(20 13 9 / .82) 0%, rgb(20 13 9 / .55) 38%, rgb(20 13 9 / 0) 62%), linear-gradient(0deg, rgb(20 13 9 / .45), rgb(20 13 9 / 0) 40%); }
  .copy { position: absolute; left: 72px; top: 70px; bottom: 64px; display: flex; flex-direction: column; justify-content: space-between; color: #f4ecdf; }
  .logo svg { height: 46px; width: auto; display: block; }
  h1 { font-family: var(--font-display); font-weight: 330; font-size: 92px; line-height: .9; letter-spacing: -0.035em; }
  h1 em { color: #efa47a; font-style: italic; font-weight: 380; }
  .meta { font-family: var(--font-mono); font-size: 15px; letter-spacing: .16em; text-transform: uppercase; color: rgb(244 236 223 / .78); }
  .bag { position: absolute; right: 86px; bottom: 44px; width: 230px; transform: rotate(-7deg); filter: drop-shadow(0 26px 30px rgb(20 12 8 / .5)); }
  .bag svg { width: 100%; height: auto; display: block; }
  </style></head><body><div class="photo"></div><div class="wash"></div>
  <div class="copy"><div class="logo">${logo}</div><h1>Follow<br><em>the line</em><br>from farm to cup.</h1><p class="meta">Small-batch roasters · Est. ${SITE.founded}</p></div>
  <div class="bag">${bag}</div></body></html>`;
}

function textureSvg(spec: TextureSpec): string {
  const paths = spec.hills.flatMap((hill) => contourRings(hill)).map((d) => `<path d="${d}"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${spec.width} ${spec.height}" fill="none" stroke="#000" stroke-width="${spec.stroke ?? 1.4}">${paths.join("")}</svg>\n`;
}

async function renderPackaging(page: Page) {
  fs.mkdirSync(out("public/packaging"), { recursive: true });
  await page.setViewportSize({ width: 800, height: 1150 });
  const jobs: Array<{ file: string; markup: string }> = [];
  for (const product of PRODUCTS) {
    const variants = product.type === "coffee" ? [undefined] : (product.variants?.map((v) => v.id) ?? [undefined]);
    for (const variant of variants) {
      const markup = renderToStaticMarkup(createElement(ProductArt, { product, variant, decorative: true, shadow: false }));
      jobs.push({ file: `${product.slug}${variant ? `--${variant}` : ""}.webp`, markup });
    }
  }
  for (const job of jobs) {
    const tmp = out(".qa/pack.html");
    fs.writeFileSync(
      tmp,
      `<!doctype html><html><head><meta charset="utf-8"><style>${FONT_CSS} html,body{background:transparent} svg{display:block;width:800px;height:1150px}</style></head><body>${job.markup}</body></html>`,
    );
    await page.goto(pathToFileURL(tmp).href);
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: 800, height: 1150 } });
    await sharp(png).webp({ quality: 88, alphaQuality: 90, effort: 6 }).toFile(out("public/packaging", job.file));
  }
  return jobs.length;
}

async function renderGrain(page: Page) {
  // Warm, slightly transparent noise; tiles seamlessly (stitchTiles).
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.14 0 0 0 0 0.1 0 0 0 0 0.07 0 0 0 0.9 -0.32"/></filter><rect width="160" height="160" filter="url(#n)"/></svg>`;
  await page.setViewportSize({ width: 160, height: 160 });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  const png = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: 160, height: 160 } });
  await sharp(png).webp({ quality: 72, alphaQuality: 80 }).toFile(out("public/textures/grain.webp"));
}

async function main() {
  fs.mkdirSync(out("brand"), { recursive: true });
  fs.mkdirSync(out("public/icons"), { recursive: true });
  fs.mkdirSync(out("public/textures"), { recursive: true });
  for (const [id, spec] of Object.entries(TEXTURES)) fs.writeFileSync(out("public/textures", `${id}.svg`), textureSvg(spec));

  const logo = (props: Record<string, unknown>) => svgDoc(renderToStaticMarkup(createElement(Logo, { ...props })));
  fs.writeFileSync(out("brand/logo.svg"), logo({ variant: "horizontal", textColor: "#241913", markColor: "#a4472a" }));
  fs.writeFileSync(out("brand/logo-reversed.svg"), logo({ variant: "horizontal", textColor: "#f4ecdf", markColor: "#efa47a" }));
  fs.writeFileSync(out("brand/logo-stacked.svg"), logo({ variant: "stacked", textColor: "#241913", markColor: "#a4472a" }));
  fs.writeFileSync(out("brand/wordmark.svg"), logo({ variant: "wordmark", textColor: "#241913" }));
  fs.writeFileSync(out("brand/icon.svg"), `<?xml version="1.0" encoding="UTF-8"?>\n${markSvg({ size: 512, fg: "#a4472a", scale: 0.86 })}\n`);
  fs.writeFileSync(out("brand/palette.json"), `${JSON.stringify(PALETTE, null, 2)}\n`);

  // Favicon: parchment mark on a clay tile reads in light and dark browser chrome.
  const tile = (size: number, scale = 0.66) => markSvg({ size, bg: "#a4472a", fg: "#f4ecdf", radius: size * 0.22, scale });
  fs.writeFileSync(out("src/app/icon.svg"), tile(64));

  const browser = await chromium.launch(
    fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {},
  );
  try {
    const page = await browser.newPage();
    const png = async (svg: string, size: number) => {
      await page.setViewportSize({ width: size, height: size });
      await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg style="display:block;width:${size}px;height:${size}px" `)}</body></html>`);
      return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
    };
    // Square, unrounded tile for Apple (iOS rounds it) and the maskable icon (safe zone 80%).
    const square = (size: number, scale: number) => markSvg({ size, bg: "#a4472a", fg: "#f4ecdf", scale });
    fs.writeFileSync(out("src/app/apple-icon.png"), await png(square(180, 0.6), 180));
    fs.writeFileSync(out("public/icons/icon-192.png"), await png(tile(192), 192));
    fs.writeFileSync(out("public/icons/icon-512.png"), await png(tile(512), 512));
    fs.writeFileSync(out("public/icons/icon-maskable-512.png"), await png(square(512, 0.5), 512));
    const ico = [];
    for (const size of [16, 32, 48]) ico.push({ size, data: await png(tile(size, size <= 16 ? 0.74 : 0.68), size) });
    fs.writeFileSync(out("src/app/favicon.ico"), toIco(ico));

    // Open Graph card
    const tmp = out(".qa/og.html");
    fs.mkdirSync(path.dirname(tmp), { recursive: true });
    fs.writeFileSync(tmp, ogHtml());
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.goto(pathToFileURL(tmp).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    fs.writeFileSync(out("src/app/opengraph-image.jpg"), await page.screenshot({ type: "jpeg", quality: 86 }));
    await renderGrain(page);
    const packs = await renderPackaging(page);
    console.log(`rendered ${packs} packaging images`);
    // next/image keeps optimised copies keyed by URL, and these file names never change: drop the cache so
    // the next `next start` serves the new art instead of the old renders.
    fs.rmSync(out(".next/cache/images"), { recursive: true, force: true });
    fs.writeFileSync(
      out("src/app/opengraph-image.alt.txt"),
      "Furrowline Coffee Roasters: a slow pour-over in morning light beside a First Light coffee bag, with the line 'Follow the line from farm to cup.'",
    );
  } finally {
    await browser.close();
  }
  console.log("brand assets written: brand/, src/app icons + OG image, public/icons/, public/textures/, public/packaging/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
