/* ==========================================================================
   Site-wide content: brand, navigation, stats.
   Contact details are fake and may only be rendered on /visit and /wholesale,
   always on an element with the data-contact attribute.
   ========================================================================== */

export const SITE = {
  name: "Furrowline Coffee Roasters",
  shortName: "Furrowline",
  tagline: "Follow the line from farm to cup.",
  description:
    "Furrowline is a small-batch coffee roaster. Seasonal coffees from twelve partner farms, roasted twice a week in a converted seed warehouse and shipped within 48 hours.",
  town: "Alder Bend",
  founded: 2016,
  founder: { name: "Nadia Ferrer", role: "Founder & head roaster" },
  conceptLine: "Concept project · fictional brand",
  url: "https://furrowline.example.com",
} as const;

export interface NavLink {
  href: string;
  label: string;
}

/** Primary navigation, in order. Every final route is here. */
export const NAV: NavLink[] = [
  { href: "/shop", label: "Shop" },
  { href: "/our-story", label: "Our Story" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/visit", label: "Visit" },
];

export const FOOTER_NAV: Array<{ title: string; links: NavLink[] }> = [
  {
    title: "Shop",
    links: [
      { href: "/shop?type=coffee", label: "All coffee" },
      { href: "/shop/deep-field", label: "House espresso" },
      { href: "/shop?type=gear", label: "Brewing gear" },
      { href: "/#find-your-coffee", label: "Find your coffee" },
    ],
  },
  {
    title: "Roastery",
    links: [
      { href: "/our-story", label: "Our story" },
      { href: "/wholesale", label: "Wholesale" },
      { href: "/visit", label: "Visit the café" },
    ],
  },
  {
    title: "Brand",
    links: [
      { href: "/brand-guide", label: "Brand guide" },
      { href: "/brand-board", label: "Brand board" },
    ],
  },
];

/** Numbers used on the origin route counters and elsewhere. */
export const STATS = {
  partnerFarms: 12,
  kgPerWeek: 480,
  roastToDoorDays: 2,
  batchKg: 15,
} as const;

/** Fake contact details. Visit and Wholesale pages only, always with data-contact. */
export const CONTACT = {
  email: "hello@example.com",
  wholesaleEmail: "wholesale@example.com",
  phone: "(555) 010-0000",
  street: "418 Mill Race Road",
  locality: "Alder Bend, OR 97000",
} as const;

/** Free shipping threshold and flat rate, in cents. */
export const SHIPPING = {
  freeOver: 4500,
  flatRate: 600,
} as const;

/** Most of one product and option set a single cart line can hold. */
export const MAX_QTY = 24;

/** Subscribe-and-save discount (0.1 = 10% off every delivery). */
export const SUBSCRIPTION_DISCOUNT = 0.1;
