/* ==========================================================================
   Photography manifest
   Every photo on the site has a named slot. Drop a file named
   public/photos/<slot>.webp|.jpg|.jpeg|.png and the next build uses it.
   Until then <Photo slot="..."> renders an illustrated fallback in the
   brand palette (src/components/photo/fallbacks).
   The `brief` is the shot list entry for each image; `focus` is the
   subject's position, used as the default crop (object-position).
   ========================================================================== */

export const PHOTO_SLOTS = [
  "hero-pour",
  "roastery",
  "founder",
  "beans-roasting",
  "origin-ethiopia",
  "origin-colombia",
  "origin-guatemala",
  "cherries",
  "cupping",
  "cafe-interior",
  "storefront",
  "espresso-bar",
  "brew-gear",
  "latte",
  "hands-sorting",
] as const;

export type PhotoSlot = (typeof PHOTO_SLOTS)[number];
export type PhotoAspect = "3:2" | "2:3" | "1:1";

export interface PhotoSpec {
  slot: PhotoSlot;
  aspect: PhotoAspect;
  /** Default object-position: keeps the subject in frame for every crop. */
  focus: string;
  /** Recommended minimum pixel size of the source file. */
  minSize: string;
  alt: string;
  /** Placeholder colour shown while the image loads. */
  tone: string;
  usedOn: string[];
  /** Shot list entry: subject, light, palette, framing. */
  brief: string;
}

/** The photo each signature coffee is staged with (showcase panels, the quiz match). */
export const SIGNATURE_PHOTO: Partial<Record<string, PhotoSlot>> = {
  "first-light": "origin-ethiopia",
  "honey-ridge": "origin-colombia",
  "highland-almanac": "origin-guatemala",
  "deep-field": "beans-roasting",
};

export const PHOTOS: Record<PhotoSlot, PhotoSpec> = {
  "hero-pour": {
    slot: "hero-pour",
    aspect: "3:2",
    focus: "64% 46%",
    minSize: "2400 × 1600",
    alt: "Water poured from a black gooseneck kettle into a speckled ceramic dripper, steam rising in low morning sun.",
    tone: "#453322",
    usedOn: ["Home hero"],
    brief:
      "Close, low-angle shot of a slow pour-over: a matte black gooseneck kettle pouring a thin stream into a cream ceramic cone dripper on a glass carafe. Early morning side light from a window on the left, visible steam, dark wooden counter, blurred warm background. Calm, quiet, premium.",
  },
  roastery: {
    slot: "roastery",
    aspect: "3:2",
    focus: "62% 55%",
    minSize: "2400 × 1600",
    alt: "The Furrowline roastery: a cast-iron drum roaster and its cooling tray of fresh beans in a sunlit brick warehouse, sacks of green coffee stacked by the windows.",
    tone: "#614935",
    usedOn: ["Home story teaser", "Our Story"],
    brief:
      "Wide interior of a small coffee roastery inside a converted timber seed barn: a 15-kilo cast-iron drum roaster with a copper-toned hopper, freshly roasted beans spinning in the round cooling tray, burlap sacks stacked on a pallet, shafts of light through tall barn doors, a little roasting haze in the air.",
  },
  founder: {
    slot: "founder",
    aspect: "2:3",
    focus: "46% 28%",
    minSize: "1600 × 2400",
    alt: "Nadia Ferrer, Furrowline's founder and head roaster, holding a scoop of green coffee beside the roaster.",
    tone: "#6c5642",
    usedOn: ["Our Story founder section"],
    brief:
      "Environmental portrait of a woman in her late thirties, the founder and head roaster: canvas work apron over a rust-coloured shirt, sleeves rolled, relaxed and confident, looking slightly off camera. Standing beside a drum roaster in a timber barn, soft window light from the side, background softly blurred. Vertical framing, waist up.",
  },
  "beans-roasting": {
    slot: "beans-roasting",
    aspect: "1:1",
    focus: "45% 55%",
    minSize: "2000 × 2000",
    alt: "Freshly roasted beans tumbling from the drum into the cooling tray as the brass stirring arm turns.",
    tone: "#694732",
    usedOn: ["Home story teaser", "Our Story", "Deep Field showcase panel"],
    brief:
      "Overhead close-up of freshly roasted medium-dark coffee beans turning in a roaster's cooling tray, the stirring arm leaving curved trails through the beans like furrows in a field. Glossy, rich browns, a few wisps of smoke, crisp detail on the beans.",
  },
  "origin-ethiopia": {
    slot: "origin-ethiopia",
    aspect: "3:2",
    focus: "50% 55%",
    minSize: "2400 × 1600",
    alt: "Ripe coffee cherries under shade trees in the Guji highlands of Ethiopia, mist in the valleys at sunrise.",
    tone: "#725e3c",
    usedOn: ["First Light product page", "Home coffee showcase"],
    brief:
      "Landscape at sunrise in the highlands of southern Ethiopia: small coffee plots growing under tall shade trees on gently terraced hillsides, morning mist in the valleys, warm peach light on the ridges, a footpath curving along the contour of the hill. No people in close-up.",
  },
  "origin-colombia": {
    slot: "origin-colombia",
    aspect: "3:2",
    focus: "45% 50%",
    minSize: "2400 × 1600",
    alt: "Rows of coffee shrubs and banana plants following the contour of a steep Andean slope in Huila, Colombia.",
    tone: "#61583a",
    usedOn: ["Honey Ridge product page", "Home coffee showcase"],
    brief:
      "Very steep Andean hillside in Huila, Colombia, covered in neat rows of coffee shrubs that follow the contour of the slope, a small farmhouse with a red tin roof, drying beds of honey-processed coffee glowing amber in the foreground, clouds sitting on distant ridges, late afternoon golden light.",
  },
  "origin-guatemala": {
    slot: "origin-guatemala",
    aspect: "3:2",
    focus: "46% 48%",
    minSize: "2400 × 1600",
    alt: "A farmer raking coffee into rows on a sunlit drying patio below a volcano in Huehuetenango, Guatemala.",
    tone: "#846853",
    usedOn: ["Highland Almanac product page", "Home coffee showcase"],
    brief:
      "High plateau landscape in Huehuetenango, Guatemala: parchment coffee spread in raked lines across a sunlit concrete drying patio, the rake marks forming parallel furrows; coffee trees and pines behind, pale limestone mountains in the distance, clear blue-gold morning.",
  },
  cherries: {
    slot: "cherries",
    aspect: "1:1",
    focus: "50% 45%",
    minSize: "2000 × 2000",
    alt: "A branch heavy with ripe red and yellow coffee cherries, glossy leaves beaded with dew.",
    tone: "#644926",
    usedOn: ["Home origin route (sourcing)", "Slow Acre Decaf product page"],
    brief:
      "Macro shot of a coffee branch with clusters of ripe cherries, mostly deep red with a few yellow and green, glossy dark green leaves, dew drops, soft backlight through the canopy, creamy out-of-focus background.",
  },
  cupping: {
    slot: "cupping",
    aspect: "3:2",
    focus: "55% 45%",
    minSize: "2400 × 1600",
    alt: "A cupping table: eight bowls of freshly ground coffee in rows, spoons and a notebook, a hand breaking the crust.",
    tone: "#735d4a",
    usedOn: ["Our Story process", "Harvest Lantern product page"],
    brief:
      "Coffee cupping session seen from a three-quarter overhead angle: a long oak table with neat rows of small stoneware cupping bowls, silver cupping spoons, little dishes of green and roasted beans, a paper score sheet without readable text, a hand lifting a spoon. Bright, even daylight.",
  },
  "cafe-interior": {
    slot: "cafe-interior",
    aspect: "3:2",
    focus: "60% 50%",
    minSize: "2400 × 1600",
    alt: "The Furrowline café: a long timber bar with an espresso machine, brass pendant lights and guests at tables by tall windows.",
    tone: "#836245",
    usedOn: ["Visit hero"],
    brief:
      "Interior of a warm, minimal café attached to a roastery: long oak bar with an espresso machine (no visible brand), clay-red tiled bar front, paper-globe pendant lights, shelves of plain coffee bags, a few people chatting softly out of focus, big windows with late-morning light.",
  },
  storefront: {
    slot: "storefront",
    aspect: "2:3",
    focus: "50% 45%",
    minSize: "1600 × 2400",
    alt: "The roastery's brick corner storefront at dusk, warm light inside and a bench and olive trees by the door.",
    tone: "#583722",
    usedOn: ["Visit page", "Field Canvas Tote product page"],
    brief:
      "Vertical shot of a small-town roastery storefront: dark-stained timber barn facade, big open sliding door, a blank cream hanging sign with no lettering, two wooden benches and potted olive trees outside, a bicycle leaning on the wall, soft overcast light.",
  },
  "espresso-bar": {
    slot: "espresso-bar",
    aspect: "3:2",
    focus: "55% 50%",
    minSize: "2400 × 1600",
    alt: "A barista locking in a portafilter as a double shot of espresso pours into a glass.",
    tone: "#6f4e34",
    usedOn: ["Wholesale hero"],
    brief:
      "Behind-the-bar view in a busy café: a barista's hands locking a portafilter into an espresso machine (no visible brand), two shots pouring into small ceramic cups, steam wand in the background, warm practical lighting, sense of a morning rush.",
  },
  "brew-gear": {
    slot: "brew-gear",
    aspect: "3:2",
    focus: "38% 45%",
    minSize: "2400 × 1600",
    alt: "Brewing gear on an oak table: a ceramic dripper, gooseneck kettle, hand grinder, glass server, scale and a bowl of beans.",
    tone: "#7e5936",
    usedOn: ["Product brew guide", "Shop banner", "Gear product pages"],
    brief:
      "Still life on an oat-coloured linen cloth over a wooden table: a cream ceramic cone dripper, a brushed steel gooseneck kettle, a hand coffee grinder with a walnut knob, a small scale, and a plain kraft coffee bag with no label. Soft daylight from the left, generous negative space on the right.",
  },
  latte: {
    slot: "latte",
    aspect: "1:1",
    focus: "50% 50%",
    minSize: "2000 × 2000",
    alt: "Two hands around a speckled stoneware cup of latte with a rosetta, rain on the window behind.",
    tone: "#71503b",
    usedOn: ["Home newsletter", "Contour Enamel Mug product page"],
    brief:
      "Top-down shot of a latte with a crisp rosetta in a speckled cream stoneware cup on a matching saucer, sitting on a warm-toned wooden table with a folded linen napkin and a few scattered beans. Soft, even daylight.",
  },
  "hands-sorting": {
    slot: "hands-sorting",
    aspect: "2:3",
    focus: "50% 42%",
    minSize: "1600 × 2400",
    alt: "Weathered hands sorting green coffee on a woven tray, picking out defective beans.",
    tone: "#815f3f",
    usedOn: ["Our Story"],
    brief:
      "Vertical close-up of weathered hands sorting green coffee beans spread on a woven bamboo tray, picking out defective beans, natural outdoor light with dappled leaf shadows, warm skin tones, pale green beans.",
  },
};

/** Numeric width / height for an aspect. */
export function aspectRatio(aspect: PhotoAspect): number {
  const [w, h] = aspect.split(":").map(Number) as [number, number];
  return w / h;
}

/** Optional hero video. Played muted and looped when present, never for reduced motion or Save-Data. */
export const HERO_VIDEO = {
  path: "/video/hero-loop.mp4",
  brief:
    "6 to 10 second seamless loop matching the hero-pour photo: the kettle stream pouring into the dripper, steam drifting, very slow camera push-in. 1920 × 1280 (3:2), H.264, no audio, under 4 MB.",
};
