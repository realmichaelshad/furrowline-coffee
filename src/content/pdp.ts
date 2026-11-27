import type { PhotoSlot } from "./photos";
import type { TextureId } from "./textures";

/* ==========================================================================
   Product page content that isn't part of the catalog itself: which photos
   sit where on each product page, the origin and blend stories, "How to use
   it" for gear, and the FAQ. Keyed by product slug. The catalog stays in
   products.ts; this file only art-directs /shop/[slug].
   ========================================================================== */

export interface StageView {
  /** Second view in the sticky product stage (the first is always the art). */
  photo: PhotoSlot;
  /** Switcher labels: [art view, photo view]. */
  labels: [string, string];
}

/** The stage's photo view. Chosen so no photo repeats on the same page. */
export const STAGE_VIEWS: Record<string, StageView> = {
  "first-light": { photo: "origin-ethiopia", labels: ["Bag", "Origin"] },
  "honey-ridge": { photo: "origin-colombia", labels: ["Bag", "Origin"] },
  "highland-almanac": { photo: "origin-guatemala", labels: ["Bag", "Origin"] },
  "deep-field": { photo: "espresso-bar", labels: ["Bag", "On bar"] },
  "slow-acre-decaf": { photo: "cherries", labels: ["Bag", "Harvest"] },
  "harvest-lantern": { photo: "cupping", labels: ["Bag", "Cupping"] },
  "field-day": { photo: "roastery", labels: ["Bag", "Roastery"] },
  "contour-dripper": { photo: "brew-gear", labels: ["Object", "In use"] },
  "steady-pour-kettle": { photo: "brew-gear", labels: ["Object", "In use"] },
  "field-hand-grinder": { photo: "brew-gear", labels: ["Object", "In use"] },
  "contour-enamel-mug": { photo: "latte", labels: ["Object", "In use"] },
  "field-canvas-tote": { photo: "storefront", labels: ["Object", "In use"] },
};

/** Contour print behind the product on the stage and the origin band. */
export const STAGE_TEXTURE: Record<string, TextureId> = {
  "first-light": "panel-1",
  "honey-ridge": "panel-2",
  "highland-almanac": "panel-3",
  "deep-field": "panel-4",
  "slow-acre-decaf": "panel-2",
  "harvest-lantern": "panel-3",
  "field-day": "panel-4",
};

export interface OriginStory {
  /** Photo in the arch frame. */
  photo: PhotoSlot;
  /** One or two sentences in the brand voice. */
  lead: string;
}

/** Single-origin coffees: the origin band. */
export const ORIGIN_STORIES: Record<string, OriginStory> = {
  "first-light": {
    photo: "origin-ethiopia",
    lead: "Coffee in Guji grows half-wild under tall shade trees, on terraces cut into the hills. We have bought from the same washing station since 2018 and go back every January.",
  },
  "honey-ridge": {
    photo: "origin-colombia",
    lead: "Finca Alto del Mirlo sits on a slope so steep that every row follows the contour of the hill. The Quinteros have sold us their honey lots every harvest since 2017.",
  },
  "highland-almanac": {
    photo: "origin-guatemala",
    lead: "Warm air rising from the lowlands keeps frost off these high limestone slopes. Each family rakes its own lot into rows on a patio beside the house.",
  },
  "slow-acre-decaf": {
    photo: "origin-colombia",
    lead: "Grown by smallholders around Pitalito, then decaffeinated a few hours away with sugarcane, water and steam. It comes back to us with its sweetness intact.",
  },
  "harvest-lantern": {
    photo: "hands-sorting",
    lead: "Nine hundred families deliver cherry to one wet mill near Othaya. Every lot is sorted by hand, fermented twice and dried on raised tables for up to three weeks.",
  },
};

/** Blends: the blend band. */
export const BLEND_STORIES: Record<string, { photo: PhotoSlot; lead: string }> = {
  "deep-field": {
    photo: "beans-roasting",
    lead: "Each component goes through the drum on its own and rests for a day before we blend, so the Brazil gets the longer roast it needs and the Colombian keeps its fruit.",
  },
  "field-day": {
    photo: "beans-roasting",
    lead: "Two coffees, roasted separately and blended after. The Brazil brings cocoa and body; the Colombian keeps the cup clean when it sits on ice for a day.",
  },
};

export interface HowTo {
  photo: PhotoSlot;
  /** Heading as [plain, italic] so it can be set like every other title. */
  title: [string, string];
  steps: string[];
}

/** Gear and merch: "How to use it". */
export const HOW_TO: Record<string, HowTo> = {
  "contour-dripper": {
    photo: "hero-pour",
    title: ["Brew a", "clean cup."],
    steps: [
      "Fold a size 02 filter along its seam, seat it in the cone and rinse it with hot water. Tip the rinse water away.",
      "Add 22 g of medium-fine coffee, shake the bed level and pour 60 g of water. Let it bloom for 45 seconds.",
      "Pour the rest in slow circles up to 360 g, keeping the water about two-thirds of the way up the cone.",
      "Let it drain flat. The whole brew takes three to three and a half minutes.",
    ],
  },
  "steady-pour-kettle": {
    photo: "hero-pour",
    title: ["Pour slow,", "pour steady."],
    steps: [
      "Fill to the line inside, 0.9 litres, and heat it on any hob. Watch the lid thermometer, not the steam.",
      "Take it off at 94°C for light roasts and 90°C for darker ones.",
      "Tilt slowly from the handle. The gooseneck gives a pencil-thin stream at a gentle angle.",
      "Dry it upside down after use to keep the inside bright.",
    ],
  },
  "field-hand-grinder": {
    photo: "hero-pour",
    title: ["Grind just", "before you brew."],
    steps: [
      "Turn the dial at the base until the burrs touch, then count clicks back: 8 for espresso, 18 for pour-over, 28 for French press.",
      "Load up to 30 g of beans and fit the handle.",
      "Turn at an even pace, about one turn a second. Thirty grams takes forty turns.",
      "Brush the burrs out once a week. Never wash them with water.",
    ],
  },
  "contour-enamel-mug": {
    photo: "cafe-interior",
    title: ["Look after", "the enamel."],
    steps: [
      "Warm it with a splash of hot water first: steel pulls the heat out of coffee quickly.",
      "It holds 12 oz, room for a flat white or a long pour-over.",
      "Hand wash with a soft sponge. Skip the scourer and the contour print stays sharp for years.",
    ],
  },
  "field-canvas-tote": {
    photo: "roastery",
    title: ["Carry", "the weekly shop."],
    steps: [
      "Two 12 oz bags fit in the main body with a loaf on top. The inside pocket holds a third bag upright.",
      "The long handles sit on the shoulder, even over a winter coat.",
      "Wash it cold, inside out, and line dry. It softens a little more every time.",
    ],
  },
};

export interface Faq {
  q: string;
  a: string;
}

export const COFFEE_FAQ: Faq[] = [
  {
    q: "When will my coffee be roasted?",
    a: "We roast on Tuesdays and Fridays and ship within 48 hours of the drum. Order by Monday night for the Tuesday roast, or Thursday night for Friday. The roast date is stamped on every bag.",
  },
  {
    q: "How does subscribe and save work?",
    a: "Choose a size, a grind and a rhythm: every 2, 3 or 4 weeks. Every delivery is 10% off and roasted to order. Skip a delivery, pause or cancel whenever you like. There is no minimum term.",
  },
  {
    q: "Whole bean or ground?",
    a: "Whole bean keeps its aroma for weeks; ground coffee is at its best for about ten days. If you don't own a grinder yet, we grind to order for $1 and match the grind to your brewer.",
  },
  {
    q: "How should I store it?",
    a: "Keep the bag sealed, at room temperature and out of the sun. The one-way valve lets the beans breathe out without letting air in. Skip the fridge: it adds moisture and smells.",
  },
];

export const GEAR_FAQ: Faq[] = [
  {
    q: "Can I return gear?",
    a: "Yes. Send back anything unused in its box within 30 days for a full refund. If something breaks in the first year from normal use, we replace it.",
  },
  {
    q: "When will it ship?",
    a: "Gear ships from the roastery within 48 hours, packed in recycled paper. Shipping is free on orders over $45.",
  },
  {
    q: "Can it ride along with a subscription?",
    a: "Add it to the same order as a coffee subscription and it ships in the box with your first delivery.",
  },
];
