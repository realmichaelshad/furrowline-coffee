import type { DayHours } from "@/lib/hours";

/* ==========================================================================
   Visit page content: café hours, getting here, the bar menu and the
   Saturday cupping. Hours are local to the café (America/Los_Angeles).
   Contact details stay in src/content/site.ts (CONTACT).
   ========================================================================== */

export const CAFE_TIME_ZONE = "America/Los_Angeles";

/** Display order is Monday first. `day` uses 0 = Sunday. */
export const HOURS: DayHours[] = [
  { day: 1, note: "Closed for cupping and cleaning" },
  { day: 2, open: "07:00", close: "16:00", note: "Roast day" },
  { day: 3, open: "07:00", close: "16:00" },
  { day: 4, open: "07:00", close: "16:00" },
  { day: 5, open: "07:00", close: "16:00", note: "Roast day" },
  { day: 6, open: "08:00", close: "16:00", note: "Public cupping at 10" },
  { day: 0, open: "09:00", close: "14:00" },
];

export interface GettingHereNote {
  icon: "parking" | "bike" | "step" | "dog";
  title: string;
  body: string;
}

export const GETTING_HERE: GettingHereNote[] = [
  {
    icon: "parking",
    title: "Parking",
    body: "Free two-hour parking along Mill Race Road, and a small lot behind the roastery after 10 am on weekdays.",
  },
  {
    icon: "bike",
    title: "Bikes",
    body: "Six bike racks under the loading-bay awning, out of the rain. The river path ends a block away.",
  },
  {
    icon: "step",
    title: "Step-free",
    body: "A level entrance on the corner, a wide aisle down the bar and an accessible restroom.",
  },
  {
    icon: "dog",
    title: "Dogs",
    body: "Dogs are welcome on the patio, with a water bowl by the door. Inside is for the roaster's sake.",
  },
];

export interface MenuItem {
  name: string;
  detail: string;
  /** Cents. Omitted when the group has one price. */
  price?: number;
  /** Links a menu line to a product in the shop. */
  slug?: string;
}

export interface MenuGroup {
  id: string;
  title: string;
  intro: string;
  /** One price for every item in the group, in cents. */
  price?: number;
  items: MenuItem[];
}

export const BAR_MENU: MenuGroup[] = [
  {
    id: "espresso",
    title: "Espresso",
    intro: "Pulled on Deep Field, our house blend. Oat milk at no extra charge.",
    items: [
      { name: "Espresso", detail: "18\u00a0g in, 38\u00a0g out", price: 350 },
      { name: "Cortado", detail: "Equal parts espresso and milk", price: 425 },
      { name: "Flat white", detail: "Double shot, 6 oz", price: 475 },
      { name: "Latte", detail: "Double shot, 10 oz", price: 500 },
      { name: "Iced Field Day", detail: "Our cold brew, 18 hours", price: 500 },
    ],
  },
  {
    id: "pour-over",
    title: "Pour-over of the week",
    intro: "Brewed to order on the Contour dripper, 22\u00a0g to 360\u00a0g. The bar works through the signature four, one coffee a week.",
    price: 550,
    items: [
      { name: "First Light", detail: "Jasmine, bergamot, white peach", slug: "first-light" },
      { name: "Honey Ridge", detail: "Red apple, panela, cacao nib", slug: "honey-ridge" },
      { name: "Highland Almanac", detail: "Milk chocolate, almond, orange zest", slug: "highland-almanac" },
      { name: "Deep Field", detail: "Dark chocolate, molasses, black cherry", slug: "deep-field" },
    ],
  },
  {
    id: "pastry",
    title: "From the bakery",
    intro: "Baked down the road on Weir Street every morning and walked over at 6:30.",
    items: [
      { name: "Cardamom bun", detail: "Knotted, with pearl sugar", price: 450 },
      { name: "Olive oil & orange cake", detail: "A thick slice", price: 475 },
      { name: "Seasonal fruit galette", detail: "Whatever the orchard sent", price: 550 },
      { name: "Rye & brown butter cookie", detail: "Salted, still soft", price: 325 },
    ],
  },
];

export const CUPPING = {
  day: "Saturday",
  time: "10 am",
  minutes: 30,
  bowls: 8,
  seats: 12,
  body: "Every Saturday at 10 we set out eight bowls: this week's roasts, something new from the sample roaster, and one we're arguing about. Free, about thirty minutes, spoons provided. No experience needed, just a nose.",
} as const;
