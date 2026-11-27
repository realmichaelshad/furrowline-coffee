import type { PhotoSlot } from "./photos";

/* ==========================================================================
   Catalog types
   Prices are integer cents everywhere. Pricing rules live in src/lib/pricing.ts.
   ========================================================================== */

export type ProductType = "coffee" | "gear" | "merch";
export type RoastLevel = "light" | "medium" | "medium-dark" | "dark";
export type ProcessKey = "washed" | "honey" | "natural" | "decaf" | "blend";
export type SizeId = "12oz" | "2lb" | "5lb";
export type GrindId = "whole" | "espresso" | "filter" | "press" | "coldbrew";

/** Which packaging illustration a coffee uses (see src/components/packaging). */
export type CoffeeArtKey =
  | "first-light"
  | "honey-ridge"
  | "highland-almanac"
  | "deep-field"
  | "slow-acre"
  | "harvest-lantern"
  | "field-day";

/** Which product illustration a gear or merch item uses (see src/components/packaging/gear). */
export type GearArtKey = "dripper" | "kettle" | "grinder" | "mug" | "tote";

export interface CoffeePalette {
  /** Bag colour and showcase background. */
  bag: string;
  /** Deeper/alternative tone used for full-bleed showcase backgrounds. */
  stage: string;
  /** Text colour that passes AA on `bag` and `stage`. */
  ink: string;
  /** Illustration accent. */
  accent: string;
  /** Background of the label window on the bag. */
  window: string;
  /** Secondary illustration tones. */
  tones: [string, string, string];
}

export interface Origin {
  country: string;
  region: string;
  producer: string;
  altitude: string;
  varieties: string[];
  harvest: string;
  /** Approximate pin position on the origin route map, 0-100 in both axes. */
  mapPin?: { x: number; y: number };
}

export interface BlendComponent {
  origin: string;
  process: string;
  share: number;
}

export interface BrewRecipe {
  method: "Pour-over" | "Espresso" | "French press" | "Cold brew" | "Travel press" | "Drip machine";
  dose: string;
  water: string;
  grind: string;
  time: string;
  note: string;
}

export interface TasteProfile {
  /** 1 (low) to 5 (high). */
  acidity: number;
  sweetness: number;
  body: number;
}

interface ProductBase {
  slug: string;
  name: string;
  /** One line under the name, in the brand voice. */
  tagline: string;
  /** Two or three short paragraphs. */
  description: string[];
  badge?: "Signature" | "Limited" | "New" | "Decaf" | "Bestseller";
  /** A photo slot that pairs with this product (origin, gear, etc.). */
  photo?: PhotoSlot;
}

export interface CoffeeProduct extends ProductBase {
  type: "coffee";
  signature: boolean;
  /** Position in the signature four (1-4), when signature. */
  signatureIndex?: number;
  roast: RoastLevel;
  process: ProcessKey;
  processLabel: string;
  /** Short origin label for cards: "Guji, Ethiopia". */
  originLabel: string;
  origin: Origin | null;
  blend?: BlendComponent[];
  notes: [string, string, string];
  profile: TasteProfile;
  /** Price per size in cents. A missing size is not sold. */
  prices: Partial<Record<SizeId, number>>;
  art: CoffeeArtKey;
  palette: CoffeePalette;
  brew: BrewRecipe[];
  /** Roast days, harvest info, cupping score... */
  facts: Array<{ label: string; value: string }>;
}

export interface GearProduct extends ProductBase {
  type: "gear" | "merch";
  price: number;
  art: GearArtKey;
  /** Card and product-stage colour, and a text colour that passes AA on it. */
  palette: { stage: string; ink: string };
  specs: Array<{ label: string; value: string }>;
  variants?: Array<{ id: string; label: string; swatch: string }>;
}

export type Product = CoffeeProduct | GearProduct;

/* ==========================================================================
   Options shared by every coffee
   ========================================================================== */

export const SIZES: Array<{ id: SizeId; label: string; detail: string }> = [
  { id: "12oz", label: "12 oz", detail: "340 g · about 22 cups" },
  { id: "2lb", label: "2 lb", detail: "907 g · about 60 cups" },
  { id: "5lb", label: "5 lb", detail: "2.27 kg · café size" },
];

export const GRINDS: Array<{ id: GrindId; label: string; detail: string; surcharge: number }> = [
  { id: "whole", label: "Whole bean", detail: "Best flavour. Grind just before you brew.", surcharge: 0 },
  { id: "espresso", label: "Espresso", detail: "Fine, for espresso machines and moka pots.", surcharge: 100 },
  { id: "filter", label: "Pour-over & drip", detail: "Medium-fine, for cone drippers, flat-bottom brewers and drip machines.", surcharge: 100 },
  { id: "press", label: "French press", detail: "Coarse, for immersion brewers.", surcharge: 100 },
  { id: "coldbrew", label: "Cold brew", detail: "Extra coarse, for overnight steeps.", surcharge: 100 },
];

export const ROAST_LEVELS: Array<{ id: RoastLevel; label: string; step: number }> = [
  { id: "light", label: "Light", step: 1 },
  { id: "medium", label: "Medium", step: 2 },
  { id: "medium-dark", label: "Medium-dark", step: 3 },
  { id: "dark", label: "Dark", step: 4 },
];

export const SUBSCRIPTION_INTERVALS = [2, 3, 4] as const;
export type SubscriptionInterval = (typeof SUBSCRIPTION_INTERVALS)[number];

/* ==========================================================================
   Catalog
   ========================================================================== */

const POUR_OVER = (note: string): BrewRecipe => ({
  method: "Pour-over",
  dose: "22 g coffee",
  water: "360 g at 94°C",
  grind: "Medium-fine, like table salt",
  time: "3:00 to 3:30",
  note,
});

export const PRODUCTS: Product[] = [
  {
    type: "coffee",
    slug: "first-light",
    name: "First Light",
    tagline: "Jasmine, bergamot and white peach from the Guji highlands.",
    signature: true,
    signatureIndex: 1,
    badge: "Signature",
    roast: "light",
    process: "washed",
    processLabel: "Washed",
    originLabel: "Guji, Ethiopia",
    origin: {
      country: "Ethiopia",
      region: "Hambela, Guji",
      producer: "640 smallholder families",
      altitude: "1,950 to 2,200 m",
      varieties: ["Kurume", "Welicho"],
      harvest: "November to January",
      mapPin: { x: 71, y: 52 },
    },
    notes: ["Jasmine", "Bergamot", "White peach"],
    profile: { acidity: 4, sweetness: 4, body: 2 },
    prices: { "12oz": 2100, "2lb": 5200, "5lb": 11800 },
    art: "first-light",
    palette: {
      bag: "#f0b48f",
      stage: "#efc3a4",
      ink: "#241913",
      accent: "#e9825a",
      window: "#fbeedc",
      tones: ["#8a9a4b", "#c9b26a", "#5f6e33"],
    },
    photo: "origin-ethiopia",
    description: [
      "Grown on terraced smallholdings above the Guji forest, where cherries ripen slowly in cool mountain air. The farms deliver to a single washing station that ferments for 36 hours and dries on raised beds for two weeks.",
      "We roast it light and quick to keep the florals at the front: jasmine on the nose, bergamot as it cools, and a white-peach finish that lingers like the last of the morning mist.",
    ],
    brew: [
      POUR_OVER("Bloom for 45 seconds with 60 g of water. Pour in slow circles and let the bed drain flat."),
      {
        method: "Travel press",
        dose: "15 g coffee",
        water: "230 g at 92°C",
        grind: "Medium-fine",
        time: "1:45",
        note: "Inverted, two gentle stirs, press slowly for 30 seconds.",
      },
    ],
    facts: [
      { label: "Roasted", value: "Tuesdays & Fridays" },
      { label: "Rest", value: "Best 7 to 28 days after roast" },
      { label: "Cup score", value: "88.25" },
    ],
  },
  {
    type: "coffee",
    slug: "honey-ridge",
    name: "Honey Ridge",
    tagline: "Red apple, panela and cacao nib from the slopes of Huila.",
    signature: true,
    signatureIndex: 2,
    badge: "Bestseller",
    roast: "medium",
    process: "honey",
    processLabel: "Honey process",
    originLabel: "Huila, Colombia",
    origin: {
      country: "Colombia",
      region: "Pitalito, Huila",
      producer: "The Quintero family, Finca Alto del Mirlo",
      altitude: "1,750 m",
      varieties: ["Caturra", "Castillo"],
      harvest: "April to June",
      mapPin: { x: 27, y: 58 },
    },
    notes: ["Red apple", "Panela", "Cacao nib"],
    profile: { acidity: 3, sweetness: 5, body: 3 },
    prices: { "12oz": 2000, "2lb": 4900, "5lb": 11200 },
    art: "honey-ridge",
    palette: {
      bag: "#b4412f",
      stage: "#9e3a2a",
      ink: "#fbf1e4",
      accent: "#f2c46b",
      window: "#f6d79a",
      tones: ["#7e2a1f", "#d9663f", "#5a1d16"],
    },
    photo: "origin-colombia",
    description: [
      "The Quinteros pick only ripe red cherry, pulp it the same afternoon and leave the sticky mucilage on the bean while it dries. That honey step is where the sweetness comes from.",
      "Roasted to a round medium, it tastes like a baked red apple with a spoon of panela, finished with the crunch of cacao nib. Easy black, generous with milk.",
    ],
    brew: [
      POUR_OVER("Aim for a slightly coarser grind than usual to keep the finish clean."),
      {
        method: "French press",
        dose: "30 g coffee",
        water: "500 g just off the boil",
        grind: "Coarse, like raw sugar",
        time: "4:00 + 4:00 settle",
        note: "Break the crust at 4 minutes, skim, then wait another 4 before plunging gently.",
      },
    ],
    facts: [
      { label: "Roasted", value: "Tuesdays & Fridays" },
      { label: "Rest", value: "Best 5 to 30 days after roast" },
      { label: "Cup score", value: "86.75" },
    ],
  },
  {
    type: "coffee",
    slug: "highland-almanac",
    name: "Highland Almanac",
    tagline: "Milk chocolate, toasted almond and orange zest from Huehuetenango.",
    signature: true,
    signatureIndex: 3,
    badge: "Signature",
    roast: "medium",
    process: "washed",
    processLabel: "Washed",
    originLabel: "Huehuetenango, Guatemala",
    origin: {
      country: "Guatemala",
      region: "La Libertad, Huehuetenango",
      producer: "Twenty-two neighbouring families in the Cuchumatanes",
      altitude: "1,800 to 2,000 m",
      varieties: ["Bourbon", "Caturra", "Pache"],
      harvest: "January to March",
      mapPin: { x: 19, y: 42 },
    },
    notes: ["Milk chocolate", "Toasted almond", "Orange zest"],
    profile: { acidity: 3, sweetness: 4, body: 4 },
    prices: { "12oz": 1900, "2lb": 4600, "5lb": 10500 },
    art: "highland-almanac",
    palette: {
      bag: "#db8a35",
      stage: "#d9963f",
      ink: "#241913",
      accent: "#6b3f26",
      window: "#fbe7c6",
      tones: ["#8a4e2b", "#f0b45c", "#4f2c1b"],
    },
    photo: "origin-guatemala",
    description: [
      "Huehuetenango sits high on a limestone plateau where warm winds from the lowlands keep frost off the trees. The families wash and sun-dry every lot on patios beside their homes.",
      "This is our everyday cup: milk chocolate and toasted almond with a twist of orange zest at the edge. It forgives a rushed morning and rewards a slow one.",
    ],
    brew: [
      POUR_OVER("Works beautifully at a 1:15 ratio for a sweeter, fuller cup."),
      {
        method: "Drip machine",
        dose: "60 g coffee",
        water: "1 litre",
        grind: "Medium",
        time: "5:00 to 6:00",
        note: "Use a paper filter and pre-rinse it. Serve within 30 minutes.",
      },
    ],
    facts: [
      { label: "Roasted", value: "Tuesdays & Fridays" },
      { label: "Rest", value: "Best 5 to 30 days after roast" },
      { label: "Cup score", value: "86.5" },
    ],
  },
  {
    type: "coffee",
    slug: "deep-field",
    name: "Deep Field",
    tagline: "Our house espresso: dark chocolate, molasses and black cherry.",
    signature: true,
    signatureIndex: 4,
    badge: "Signature",
    roast: "medium-dark",
    process: "blend",
    processLabel: "Natural & washed blend",
    originLabel: "House blend",
    origin: null,
    blend: [
      { origin: "Cerrado, Brazil", process: "Natural", share: 50 },
      { origin: "Huila, Colombia", process: "Honey", share: 30 },
      { origin: "Huehuetenango, Guatemala", process: "Washed", share: 20 },
    ],
    notes: ["Dark chocolate", "Molasses", "Black cherry"],
    profile: { acidity: 2, sweetness: 4, body: 5 },
    prices: { "12oz": 1800, "2lb": 4400, "5lb": 9800 },
    art: "deep-field",
    palette: {
      bag: "#3b1c22",
      stage: "#2b1418",
      ink: "#f4ecdf",
      accent: "#c2414f",
      window: "#24121a",
      tones: ["#a3303f", "#6e3b1f", "#f4ecdf"],
    },
    photo: "beans-roasting",
    description: [
      "Half natural Brazil for body, then Colombian honey and Guatemalan washed lots for fruit and lift. We roast each component on its own and blend after, so nothing gets pushed too far.",
      "As espresso it pulls thick and syrupy: dark chocolate first, molasses through the middle and a black-cherry finish that cuts cleanly through milk.",
    ],
    brew: [
      {
        method: "Espresso",
        dose: "18 g coffee",
        water: "38 g out",
        grind: "Fine",
        time: "27 to 30 seconds",
        note: "93°C. If it tastes sharp, grind finer; if it tastes bitter, coarser.",
      },
      {
        method: "Travel press",
        dose: "17 g coffee",
        water: "200 g at 88°C",
        grind: "Fine-medium",
        time: "2:00",
        note: "Cooler water keeps the chocolate sweet and the finish soft.",
      },
    ],
    facts: [
      { label: "Roasted", value: "Tuesdays & Fridays" },
      { label: "Rest", value: "Best 10 to 35 days after roast" },
      { label: "Built for", value: "Espresso and milk drinks" },
    ],
  },
  {
    type: "coffee",
    slug: "slow-acre-decaf",
    name: "Slow Acre Decaf",
    tagline: "Brown sugar, stewed plum and cocoa. All of the ritual, none of the buzz.",
    signature: false,
    badge: "Decaf",
    roast: "medium",
    process: "decaf",
    processLabel: "Sugarcane decaf",
    originLabel: "Huila, Colombia",
    origin: {
      country: "Colombia",
      region: "Pitalito, Huila",
      producer: "Smallholders around Pitalito, Huila",
      altitude: "1,700 m",
      varieties: ["Castillo", "Colombia"],
      harvest: "May to July",
    },
    notes: ["Brown sugar", "Stewed plum", "Cocoa"],
    profile: { acidity: 2, sweetness: 4, body: 3 },
    prices: { "12oz": 1900, "2lb": 4700 },
    art: "slow-acre",
    palette: {
      bag: "#4b5a32",
      stage: "#3e4b29",
      ink: "#f4ecdf",
      accent: "#d9b56a",
      window: "#e9e2c4",
      tones: ["#2f3a1f", "#8a9a4b", "#c9b26a"],
    },
    photo: "cherries",
    description: [
      "Decaffeinated in Colombia with a natural compound made from fermented sugarcane, which leaves the sweetness intact and the chemicals out.",
      "Brown sugar and stewed plum with a cocoa finish. Good enough that you will forget to tell people it is decaf.",
    ],
    brew: [POUR_OVER("A touch finer than usual: decaf beans are more porous and extract quickly.")],
    facts: [
      { label: "Roasted", value: "Fridays" },
      { label: "Caffeine", value: "99.9% removed" },
      { label: "Cup score", value: "85.5" },
    ],
  },
  {
    type: "coffee",
    slug: "harvest-lantern",
    name: "Harvest Lantern",
    tagline: "A seasonal lot from Nyeri: blackcurrant, ruby grapefruit and demerara.",
    signature: false,
    badge: "Limited",
    roast: "light",
    process: "washed",
    processLabel: "Washed",
    originLabel: "Nyeri, Kenya",
    origin: {
      country: "Kenya",
      region: "Othaya, Nyeri",
      producer: "Nine hundred smallholder families",
      altitude: "1,800 m",
      varieties: ["SL28", "SL34", "Ruiru 11"],
      harvest: "October to December",
    },
    notes: ["Blackcurrant", "Ruby grapefruit", "Demerara"],
    profile: { acidity: 5, sweetness: 4, body: 3 },
    prices: { "12oz": 2400, "2lb": 5800 },
    art: "harvest-lantern",
    palette: {
      bag: "#5b2340",
      stage: "#4a1c34",
      ink: "#f4ecdf",
      accent: "#f0a24a",
      window: "#2e1222",
      tones: ["#8e3a5c", "#f0a24a", "#c2414f"],
    },
    photo: "cupping",
    description: [
      "Only 60 bags came in this season, and we bought every one. Double-fermented and washed at the factory, then dried slowly on raised tables.",
      "It is loud in the best way: blackcurrant and ruby grapefruit up front, demerara sugar holding it all together. Here until it runs out.",
    ],
    brew: [POUR_OVER("Drop the temperature to 92°C if the acidity feels sharp.")],
    facts: [
      { label: "Roasted", value: "Tuesdays" },
      { label: "Availability", value: "Seasonal, while it lasts" },
      { label: "Cup score", value: "89" },
    ],
  },
  {
    type: "coffee",
    slug: "field-day",
    name: "Field Day",
    tagline: "A dark, sweet blend for cold brew and big batch drip.",
    signature: false,
    badge: "New",
    roast: "dark",
    process: "blend",
    processLabel: "Natural & washed blend",
    originLabel: "Brazil & Colombia",
    origin: null,
    blend: [
      { origin: "Cerrado, Brazil", process: "Natural", share: 60 },
      { origin: "Huila, Colombia", process: "Washed", share: 40 },
    ],
    notes: ["Cocoa", "Hazelnut", "Toffee"],
    profile: { acidity: 1, sweetness: 4, body: 5 },
    prices: { "12oz": 1700, "2lb": 4100, "5lb": 9200 },
    art: "field-day",
    palette: {
      bag: "#2f4a4a",
      stage: "#263d3d",
      ink: "#f4ecdf",
      accent: "#efa47a",
      window: "#dfe4d8",
      tones: ["#5e7d73", "#efa47a", "#1d2f2f"],
    },
    photo: "brew-gear",
    description: [
      "Built for long, cold steeps and full thermoses. Brazilian naturals bring cocoa and hazelnut; a washed Colombian lot from Huila keeps it clean.",
      "Roasted a shade darker than anything else we make, so it stands up to ice, milk and a long afternoon.",
    ],
    brew: [
      {
        method: "Cold brew",
        dose: "100 g coffee",
        water: "1 litre cold water",
        grind: "Extra coarse",
        time: "16 to 18 hours",
        note: "Steep in the fridge, filter twice, then dilute 1:1 with water or milk.",
      },
      {
        method: "Drip machine",
        dose: "65 g coffee",
        water: "1 litre",
        grind: "Medium",
        time: "5:00 to 6:00",
        note: "A slightly stronger ratio keeps it sweet when it cools.",
      },
    ],
    facts: [
      { label: "Roasted", value: "Fridays" },
      { label: "Rest", value: "Best 5 to 40 days after roast" },
      { label: "Built for", value: "Cold brew and batch drip" },
    ],
  },
  {
    type: "gear",
    slug: "contour-dripper",
    name: "Contour Ceramic Dripper",
    tagline: "A cone dripper with ribs cut like contour lines.",
    price: 3400,
    art: "dripper",
    palette: { stage: "#cfb48c", ink: "#241913" },
    photo: "brew-gear",
    badge: "New",
    description: [
      "Thrown in stoneware and glazed in our parchment white. The spiral ribs let air escape evenly, so the bed drains flat and the cup stays sweet.",
      "Fits most mugs and carafes. Takes size 02 cone filters.",
    ],
    specs: [
      { label: "Material", value: "Glazed stoneware" },
      { label: "Brews", value: "1 to 4 cups" },
      { label: "Filters", value: "Size 02 cone" },
      { label: "Care", value: "Dishwasher safe" },
    ],
    variants: [
      { id: "parchment", label: "Parchment", swatch: "#f4ecdf" },
      { id: "clay", label: "Clay", swatch: "#a4472a" },
    ],
  },
  {
    type: "gear",
    slug: "steady-pour-kettle",
    name: "Steady Pour Kettle",
    tagline: "A gooseneck kettle with a slow, honest pour.",
    price: 7200,
    art: "kettle",
    palette: { stage: "#d39b55", ink: "#241913" },
    photo: "brew-gear",
    description: [
      "A narrow gooseneck and a counterweighted walnut handle give you a thin, steady stream, which is most of what good pour-over asks for.",
      "Matte black steel with brass collars that age a little more every year. Works on gas, electric and induction hobs, and the lid thermometer reads in Celsius and Fahrenheit.",
    ],
    specs: [
      { label: "Capacity", value: "0.9 litres" },
      { label: "Material", value: "Matte black steel, walnut" },
      { label: "Hob", value: "Gas, electric, induction" },
      { label: "Thermometer", value: "Built into the lid" },
    ],
  },
  {
    type: "gear",
    slug: "field-hand-grinder",
    name: "Field Hand Grinder",
    tagline: "Steel burrs, 40 click settings, fits in a backpack.",
    price: 9600,
    art: "grinder",
    palette: { stage: "#4b5a32", ink: "#f4ecdf" },
    photo: "brew-gear",
    description: [
      "Conical steel burrs and a double bearing keep the grind even from espresso to French press. Thirty grams takes about forty turns.",
      "The walnut knob is turned by a woodworker two towns over from the roastery.",
    ],
    specs: [
      { label: "Burrs", value: "38 mm conical steel" },
      { label: "Settings", value: "40 clicks" },
      { label: "Capacity", value: "30 g" },
      { label: "Weight", value: "540 g" },
    ],
  },
  {
    type: "merch",
    slug: "contour-enamel-mug",
    name: "Contour Enamel Mug",
    tagline: "Camp-tough enamel with our contour print.",
    price: 2200,
    art: "mug",
    palette: { stage: "#8e3a20", ink: "#fbf1e4" },
    photo: "latte",
    description: [
      "Steel mug, two coats of enamel, and a contour-line print that wraps all the way round. Holds a generous 12 oz pour.",
      "Hand wash to keep the rim bright.",
    ],
    specs: [
      { label: "Capacity", value: "12 oz / 350 ml" },
      { label: "Material", value: "Enamelled steel" },
      { label: "Care", value: "Hand wash" },
    ],
    variants: [
      { id: "parchment", label: "Parchment", swatch: "#f4ecdf" },
      { id: "espresso", label: "Espresso", swatch: "#241913" },
    ],
  },
  {
    type: "merch",
    slug: "field-canvas-tote",
    name: "Field Canvas Tote",
    tagline: "Heavy canvas, long handles, room for two bags of beans and a loaf.",
    price: 2800,
    art: "tote",
    palette: { stage: "#3a2a20", ink: "#f4ecdf" },
    photo: "storefront",
    description: [
      "Twelve-ounce natural canvas, screen printed with our furrow rows in clay ink. The inside pocket is sized for a 12 oz bag.",
      "Gets softer every week you use it.",
    ],
    specs: [
      { label: "Material", value: "12 oz natural cotton canvas" },
      { label: "Size", value: "38 × 42 cm, 10 cm gusset" },
      { label: "Print", value: "Water-based clay ink" },
    ],
  },
];

/* ==========================================================================
   Accessors
   ========================================================================== */

export function isCoffee(product: Product): product is CoffeeProduct {
  return product.type === "coffee";
}

export const COFFEES: CoffeeProduct[] = PRODUCTS.filter(isCoffee);

/** The signature four, in showcase order. */
export const SIGNATURE_COFFEES: CoffeeProduct[] = COFFEES.filter((c) => c.signature).sort(
  (a, b) => (a.signatureIndex ?? 0) - (b.signatureIndex ?? 0),
);

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Sizes a coffee is sold in, in display order. */
export function sizesFor(coffee: CoffeeProduct) {
  return SIZES.filter((s) => coffee.prices[s.id] !== undefined);
}

/** Lowest price a product can be bought for (one-time), in cents. */
export function fromPrice(product: Product): number {
  if (product.type !== "coffee") return product.price;
  const prices = Object.values(product.prices).filter((p): p is number => typeof p === "number");
  return Math.min(...prices);
}

/**
 * Related products: coffees get other coffees closest in roast, then one piece of gear;
 * gear/merch get other gear plus a signature coffee.
 */
export function relatedProducts(slug: string, count = 3): Product[] {
  const product = getProduct(slug);
  if (!product) return PRODUCTS.slice(0, count);
  const step = (p: Product) => (isCoffee(p) ? (ROAST_LEVELS.find((r) => r.id === p.roast)?.step ?? 0) : 0);
  const others = PRODUCTS.filter((p) => p.slug !== slug);
  if (isCoffee(product)) {
    const coffees = others
      .filter(isCoffee)
      .sort((a, b) => Math.abs(step(a) - step(product)) - Math.abs(step(b) - step(product)));
    const gear = others.filter((p) => p.type === "gear");
    return [...coffees.slice(0, count - 1), ...gear.slice(0, 1)].slice(0, count);
  }
  const gear = others.filter((p) => !isCoffee(p));
  return [...gear.slice(0, count - 1), ...SIGNATURE_COFFEES.slice(0, 1)].slice(0, count);
}
