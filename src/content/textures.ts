import type { Hill } from "@/lib/geometry";
import { ORIGINS, ROUTE_MAP, ROUTE_MAP_PHONE, projectOn, projectRoute } from "./origins";

/* ==========================================================================
   Contour textures. Big topographic backdrops would cost tens of KB of
   inline SVG each (and again in the RSC payload), so they are generated
   once by `npm run brand` into public/textures/<id>.svg and drawn with
   <Texture id="..."> as a CSS mask filled with currentColor (any colour,
   zero HTML weight, cached by the browser).
   Add an entry here, run `npm run brand`, then use it.
   ========================================================================== */

export interface TextureSpec {
  width: number;
  height: number;
  hills: Hill[];
  /** Stroke width in viewBox units. */
  stroke?: number;
}

export const TEXTURES = {
  /** Signature showcase panels, one per coffee. */
  "panel-1": {
    width: 1440,
    height: 900,
    hills: [
      { cx: 1060, cy: 470, r: 330, levels: 13, stretch: 1.25, wobble: 0.17, seed: 11 },
      { cx: 180, cy: 860, r: 210, levels: 7, stretch: 1.6, wobble: 0.2, seed: 5 },
    ],
  },
  "panel-2": {
    width: 1440,
    height: 900,
    hills: [
      { cx: 1080, cy: 430, r: 340, levels: 13, stretch: 1.3, wobble: 0.19, seed: 22 },
      { cx: 140, cy: 820, r: 220, levels: 7, stretch: 1.5, wobble: 0.2, seed: 10 },
    ],
  },
  "panel-3": {
    width: 1440,
    height: 900,
    hills: [
      { cx: 1040, cy: 500, r: 320, levels: 12, stretch: 1.35, wobble: 0.16, seed: 33 },
      { cx: 200, cy: 880, r: 230, levels: 8, stretch: 1.55, wobble: 0.22, seed: 15 },
    ],
  },
  "panel-4": {
    width: 1440,
    height: 900,
    hills: [
      { cx: 1100, cy: 460, r: 350, levels: 14, stretch: 1.2, wobble: 0.18, seed: 44 },
      { cx: 160, cy: 840, r: 200, levels: 6, stretch: 1.6, wobble: 0.21, seed: 20 },
    ],
  },
  footer: {
    width: 1440,
    height: 700,
    hills: [
      { cx: 1180, cy: 210, r: 260, levels: 14, stretch: 1.3, wobble: 0.18, seed: 4 },
      { cx: 220, cy: 640, r: 200, levels: 9, stretch: 1.5, wobble: 0.2, seed: 9 },
    ],
  },
  menu: {
    width: 400,
    height: 400,
    hills: [{ cx: 220, cy: 220, r: 150, levels: 12, stretch: 1.25, wobble: 0.2, seed: 21 }],
    stroke: 1,
  },
  /** Contour hills under each origin on the Home route map (same projection). */
  "route-hills": {
    width: ROUTE_MAP.width,
    height: ROUTE_MAP.height,
    stroke: 1,
    hills: ORIGINS.map((o, i) => {
      const [cx, cy] = projectRoute(o.lat, o.lon);
      return { cx, cy, r: o.photo ? 46 : 30, levels: o.photo ? 6 : 4, stretch: 1.35, wobble: 0.22, seed: 30 + i };
    }),
  },
  /** The same hills for the taller phone map (ROUTE_MAP_PHONE). */
  "route-hills-phone": {
    width: ROUTE_MAP_PHONE.width,
    height: ROUTE_MAP_PHONE.height,
    stroke: 2.4,
    hills: ORIGINS.map((o, i) => {
      const [cx, cy] = projectOn(ROUTE_MAP_PHONE, o.lat, o.lon);
      return { cx, cy, r: o.photo ? 96 : 62, levels: o.photo ? 6 : 4, stretch: 1.2, wobble: 0.22, seed: 30 + i };
    }),
  },
  /** General-purpose section backdrops for any page. */
  "wide-a": {
    width: 1440,
    height: 900,
    hills: [
      { cx: 1120, cy: 380, r: 300, levels: 12, stretch: 1.3, wobble: 0.18, seed: 51 },
      { cx: 120, cy: 900, r: 240, levels: 8, stretch: 1.6, wobble: 0.2, seed: 52 },
    ],
  },
  "wide-b": {
    width: 1440,
    height: 900,
    hills: [
      { cx: 300, cy: 420, r: 300, levels: 12, stretch: 1.35, wobble: 0.17, seed: 61 },
      { cx: 1340, cy: 60, r: 180, levels: 6, stretch: 1.4, wobble: 0.22, seed: 62 },
    ],
  },
  "square-a": {
    width: 800,
    height: 800,
    hills: [{ cx: 400, cy: 420, r: 300, levels: 12, stretch: 1.15, wobble: 0.18, seed: 71 }],
  },
} satisfies Record<string, TextureSpec>;

export type TextureId = keyof typeof TEXTURES;

export function textureUrl(id: TextureId): string {
  return `/textures/${id}.svg`;
}
