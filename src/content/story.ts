import type { PhotoSlot } from "./photos";

/* ==========================================================================
   Our Story page copy. Everything on /our-story that isn't shared catalog or
   origin data lives here, written in the brand voice (DESIGN.md §11):
   plain, specific, warm, real numbers. People are invented for the concept.
   ========================================================================== */

/** Opening lead, in Nadia's voice. */
export const STORY_LEAD =
  "I bought a second-hand drum in 2016 with nowhere to put it. Ten years on we roast 480 kilos a week, and I still know the name of every farmer whose coffee goes into it.";

export const ROASTERY_CAPTION = {
  label: "The drum",
  text: "15 kg, cast iron, built in 1958",
};

export const STAMP_TEXT = "Roasted by ear and by smell · Since 2016 · ";

/* ---- The founder --------------------------------------------------------- */

export const FOUNDER = {
  title: ["She bought the drum", "before the building."],
  paragraphs: [
    "In 2016 Nadia Ferrer had spent eleven years pulling shots and cupping samples for other people's roasteries. When a fifteen-kilo drum roaster came up for sale two valleys over, cast iron and older than she was, she bought it before she had anywhere to put it.",
    "The town's seed warehouse on Mill Race Road had stood empty since the co-op moved out. Brick walls from the 1920s, tall north windows, and a loading door wide enough for a pallet of green coffee. The roaster went in through that door and still stands beside it.",
    "There is a probe and a laptop on the bench, but Nadia roasts by ear and by smell first: the snap of first crack, the moment the grassy smell turns to fresh bread and then to caramel. Every batch is tasted the next morning before a single bag leaves.",
  ],
  quote:
    "You can read a roast curve on a screen, but the coffee tells you first. It crackles, it smells of bread, then of caramel. You learn to listen for it.",
  facts: [
    { value: "1958", label: "Year the drum was built" },
    { value: "11", unit: "yrs", label: "Behind other people's bars first" },
    { value: "32", label: "Batches roasted every week" },
  ],
};

/* ---- From farm to cup (sticky chapters) ---------------------------------- */

export interface ChapterPhoto {
  slot: PhotoSlot;
  /** object-position override for this crop. */
  position?: string;
  /** Alt override (the manifest alt is used otherwise). */
  alt?: string;
  /** Tighter crop around `position` (see <Photo scale>). */
  scale?: number;
}

export interface StoryChapter {
  id: string;
  index: number;
  label: string;
  title: [string, string];
  body: string;
  facts: Array<{ value: string; label: string }>;
  /** Large photo in the stage (portrait frame). */
  main: ChapterPhoto;
  /** Small photo overlapping the corner. */
  inset: ChapterPhoto;
}

export const CHAPTERS: StoryChapter[] = [
  {
    id: "farm",
    index: 1,
    label: "Farm",
    title: ["Picked ripe,", "sorted twice."],
    body: "Coffee is a fruit, and it only tastes as good as the day it was picked. Our partners go over each tree four or five times a season and take only the red cherries. After drying, the green coffee is sorted again by hand on woven trays before it leaves the farm.",
    facts: [
      { value: "4–5", label: "Picking passes per tree, every harvest" },
      { value: "< 5", label: "Defects allowed in a 350\u00a0g sample" },
      { value: "3 mo", label: "From the drying patio to Alder\u00a0Bend" },
    ],
    main: { slot: "cherries", position: "48% 40%" },
    inset: { slot: "hands-sorting", position: "45% 45%" },
  },
  {
    id: "roast",
    index: 2,
    label: "Roast",
    title: ["Fifteen kilos,", "by ear."],
    body: "Green coffee rests in the warehouse for a week to settle. On Tuesdays and Fridays it goes into the drum fifteen kilos at a time, about twelve minutes a batch. We log every curve, but the call to drop the beans into the cooling tray is made by sound and smell.",
    facts: [
      { value: "15 kg", label: "In the drum per batch" },
      { value: "12 min", label: "Average roast, light to medium-dark" },
      { value: "7 days", label: "Green coffee rests before it's roasted" },
    ],
    main: { slot: "beans-roasting", position: "52% 55%" },
    // A detail from the brew-gear still life: the page's opening photo is already the roastery.
    inset: {
      slot: "brew-gear",
      position: "8% 79%",
      scale: 2.2,
      alt: "A wooden bowl of freshly roasted beans on a linen cloth.",
    },
  },
  {
    id: "cup",
    index: 3,
    label: "Cup",
    title: ["Tasted before", "it's bagged."],
    body: "A sample from every batch is cupped the morning after it's roasted: eight bowls on the oak table, tasted blind against last week's. If a batch doesn't taste like its farm, it doesn't go out. If it does, it's bagged that morning and at your door two days after it left the drum.",
    facts: [
      { value: "8", label: "Bowls on the table at every cupping" },
      { value: "24 h", label: "Rest before a batch is tasted" },
      { value: "2 days", label: "From the drum to your door" },
    ],
    main: { slot: "cupping", position: "56% 45%" },
    inset: {
      slot: "espresso-bar",
      position: "57% 64%",
      scale: 1.35,
      alt: "A double shot running into a glass on the café bar, the morning after the roast.",
    },
  },
];

/* ---- The farms ----------------------------------------------------------- */

export const FARMS_LEAD =
  "We buy from the same producers every year, by name. These are the five regions they farm in and the months their harvest comes in.";

export const HOW_WE_BUY = [
  {
    title: "Direct, by name",
    body: "No broker sets the price or picks the lot. We buy from twelve producers we know, and the farm is printed on every bag.",
  },
  {
    title: "Every harvest, in person",
    body: "Someone from Alder Bend stands on every partner farm every harvest, cups on the patio and agrees next year's lots there.",
  },
  {
    title: "Well above market",
    body: "Prices are agreed before the harvest, an average of 70% over the market rate last season, and held for the year even if the market falls.",
  },
];

/* ---- What we won't do ---------------------------------------------------- */

export const WONT_DO = [
  {
    line: "Roast dark to hide a defect.",
    detail:
      "Roast level is chosen on the cupping table for each coffee. If a lot only tastes good roasted dark, we don't buy it.",
  },
  {
    line: "Blend lots we can't name.",
    detail: "Deep Field is three named farms in fixed shares, printed on the bag. Nothing comes from a broker's mixed container.",
  },
  {
    line: "Sell coffee older than four weeks off roast.",
    detail: "Every bag carries its roast date. Whatever is left on the shelf at 28 days goes into the café's cold brew, never the post.",
  },
  {
    line: "Buy from a farm we haven't stood on.",
    detail: "If we can't get there for the harvest, we skip that year's lot and wait for the next one.",
  },
];

/* ---- Ten years ----------------------------------------------------------- */

export const TIMELINE = [
  {
    year: "2016",
    title: "The drum arrives",
    body: "Nadia buys the 15 kg drum and leases the empty seed warehouse on Mill Race Road. The first roasts sell out of the loading door.",
  },
  {
    year: "2017",
    title: "The first direct lot",
    body: "The Quintero family's honey coffee from Huila arrives. They have sold us every harvest since, and it became Honey Ridge.",
  },
  {
    year: "2018",
    title: "First trip to Guji",
    body: "Two weeks at a washing station in Hambela. We have gone back every January since, and First Light was the result.",
  },
  {
    year: "2019",
    title: "The café opens",
    body: "The warehouse's front room gets a long oak bar, so you can drink the coffee a few steps from the drum it came out of.",
  },
  {
    year: "2023",
    title: "Harvest Lantern",
    body: "Our first seasonal release: sixty bags from one factory in Nyeri. It sold out in nine weeks, and comes back each autumn.",
  },
  {
    year: "2026",
    title: "The twelfth farm",
    body: "The Othaya factory behind Harvest Lantern becomes a full partner, with its lots agreed a year ahead. Twelve farms now, every one of them visited each harvest.",
  },
];
