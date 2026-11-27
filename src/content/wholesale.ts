/* ==========================================================================
   Wholesale page content: the offer, how it works, indicative pricing,
   sample quotes and the inquiry form's options. Kept free of zod so the
   client form can import the option lists without pulling in the validator
   (src/lib/wholesale.ts loads on first focus or submit).
   Sample people are invented. Contact details stay in src/content/site.ts.
   ========================================================================== */

export const BUSINESS_TYPES = ["cafe", "restaurant", "office", "grocer", "other"] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  cafe: "Café",
  restaurant: "Restaurant",
  office: "Office",
  grocer: "Grocer",
  other: "Other",
};

export const VOLUMES = ["under-5", "5-15", "15-40", "40-plus"] as const;
export type Volume = (typeof VOLUMES)[number];

/** Weekly volume choices. A double shot is 18 g, so 1 kg is about 55 drinks. */
export const VOLUME_OPTIONS: Record<Volume, { label: string; detail: string }> = {
  "under-5": { label: "Under 5 kg", detail: "Up to 40 drinks a day" },
  "5-15": { label: "5–15 kg", detail: "40 to 120 a day" },
  "15-40": { label: "15–40 kg", detail: "120 to 320 a day" },
  "40-plus": { label: "40 kg+", detail: "More than 320 a day" },
};

/** The signature four, in the order they appear on the form. */
export const INQUIRY_COFFEES = ["first-light", "honey-ridge", "highland-almanac", "deep-field"] as const;
export type InquiryCoffee = (typeof INQUIRY_COFFEES)[number];

export const MESSAGE_MAX = 1000;

/**
 * Every field the inquiry form renders, in on-screen order. The form's error
 * summary and first-invalid focus, and the validator in src/lib/wholesale.ts,
 * all read this one list (it lives here, not next to the zod schema, so the
 * form can use it without loading the validator).
 */
export const WHOLESALE_FIELDS = [
  "business",
  "businessType",
  "city",
  "volume",
  "name",
  "email",
  "phone",
  "coffees",
  "message",
  "consent",
] as const;

export type WholesaleField = (typeof WHOLESALE_FIELDS)[number];

/* ---- Offer ---------------------------------------------------------------- */

export type OfferIcon = "coffee" | "scale" | "machine" | "truck";

export const OFFER: Array<{ icon: OfferIcon; title: string; body: string; meta: string }> = [
  {
    icon: "coffee",
    title: "A coffee programme",
    body: "Deep Field on the espresso grinder, plus a rotating single origin for the second hopper or the batch brewer. It changes with the harvests, and we send notes for your menu board.",
    meta: "Deep Field + one rotating origin",
  },
  {
    icon: "scale",
    title: "Training and dial-in visits",
    body: "Two days of barista training at your bar when you start. After that we come back to dial in, taste through the menu and check the grinder burrs before they go dull.",
    meta: "Visits included at every volume",
  },
  {
    icon: "machine",
    title: "Help choosing equipment",
    body: "An honest answer on the grinder and machine your volume needs, help buying second-hand where it makes sense, and a morning setting it up with your team.",
    meta: "No brand deals, no commission",
  },
  {
    icon: "truck",
    title: "Roasted to order, weekly",
    body: "Order by Sunday night for Tuesday's roast and it's on your counter Wednesday. We keep a week resting for you, so your hopper is always 10 to 21 days off roast.",
    meta: "Free delivery within 60 miles",
  },
];

/* ---- How it works ----------------------------------------------------------- */

export const STEPS = [
  {
    title: "Taste",
    body: "Join the trade cupping at the roastery on a Monday morning, or we bring a box of four coffees to your bar and taste them with you.",
    meta: "Week 1",
  },
  {
    title: "Trial",
    body: "Six kilos on us for a two-week trial. Enough to run Deep Field through real services, rushes included, before you sign anything.",
    meta: "Weeks 2–3",
  },
  {
    title: "Train",
    body: "Two days with your team at your bar: dialling in, milk texture, workflow on a busy bar, and the cleaning that keeps shots sweet.",
    meta: "Before launch",
  },
  {
    title: "Deliver",
    body: "A standing weekly order, roasted Tuesday and delivered Wednesday. Change it any time before Sunday night, no minimum term.",
    meta: "Every week after",
  },
];

/* ---- Indicative pricing ------------------------------------------------------ */

export interface PriceTier {
  id: Volume;
  label: string;
  /** Cents per kilo. */
  espresso: number;
  single: number;
  visits: string;
  note?: string;
}

export const PRICE_TIERS: PriceTier[] = [
  { id: "5-15", label: "5–15 kg a week", espresso: 2750, single: 3300, visits: "Every quarter" },
  { id: "15-40", label: "15–40 kg a week", espresso: 2500, single: 3050, visits: "Every month", note: "Where most cafés sit" },
  { id: "40-plus", label: "40 kg+ a week", espresso: 2300, single: 2850, visits: "Every two weeks" },
];

export const PRICING_NOTES = [
  "Prices per kilo, before tax, for the 2026–27 harvest year. Your quote is fixed for twelve months.",
  "Delivery is free within 60 miles of Alder Bend; further afield we ship on Tuesday's courier at cost.",
];

export const UNDER_FIVE_NOTE =
  "Under 5 kg a week? We'll set you up with a café subscription at 15% off retail, with the same training.";

/* ---- Sample quotes (invented people) ------------------------------------------ */

export const VOICES = [
  {
    quote:
      "We moved our house espresso to Deep Field last spring. Nadia came out twice in the first month to dial in, and our flat whites have never been this consistent from open to close.",
    name: "Mara T.",
    role: "Café owner",
  },
  {
    quote:
      "Ordering is one line on a Sunday and the coffee is on the counter by Wednesday. In two years we've never had a bag in the hopper older than three weeks.",
    name: "Joel A.",
    role: "Head barista",
  },
];

export const WHOLESALE_STATS = [
  { value: "41", label: "Cafés, restaurants and offices pouring it" },
  { value: "60", unit: "mi", label: "Free delivery radius from the roastery" },
  { value: "2", unit: "days", label: "To reply to every inquiry" },
];

/* ---- After you send ----------------------------------------------------------- */

export const NEXT_STEPS = [
  "We reply within two working days, usually with questions about your menu and grinder.",
  "A box of four coffees arrives for you and your team to taste.",
  "We visit your bar to taste together and talk through numbers.",
];
