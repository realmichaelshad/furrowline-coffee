import { describe, expect, it } from "vitest";
import { getProduct, type Product } from "@/content/products";
import { lineKey, MAX_QTY } from "./cart";
import {
  defaultOptions,
  defaultPick,
  mergeOptionsIntoSearch,
  optionsSummary,
  parseOptions,
  planId,
  priceSummary,
  purchaseFromPlan,
  purchaseLabel,
  sameOptions,
  sanitizeOptions,
  serializeOptions,
  toCartLine,
  type ProductOptions,
} from "./product-options";

function product(slug: string): Product {
  const p = getProduct(slug);
  if (!p) throw new Error(`missing ${slug}`);
  return p;
}

const firstLight = product("first-light");
const decaf = product("slow-acre-decaf");
const lantern = product("harvest-lantern");
const dripper = product("contour-dripper");
const kettle = product("steady-pour-kettle");
const mug = product("contour-enamel-mug");

const sub = (every: 2 | 3 | 4) => ({ mode: "subscribe" as const, every });

describe("defaultOptions", () => {
  it("starts coffee at 12 oz, whole bean, one-time", () => {
    expect(defaultOptions(firstLight)).toEqual({ size: "12oz", grind: "whole", purchase: { mode: "once" } });
  });

  it("uses the first available size for two-size coffees too", () => {
    expect(defaultOptions(decaf).size).toBe("12oz");
    expect(defaultOptions(lantern).size).toBe("12oz");
  });

  it("starts gear on its first colour, and with no options when it has none", () => {
    expect(defaultOptions(dripper)).toEqual({ variant: "parchment", purchase: { mode: "once" } });
    expect(defaultOptions(kettle)).toEqual({ purchase: { mode: "once" } });
  });
});

describe("sanitizeOptions", () => {
  it("falls back to the first available size when a size is not sold", () => {
    expect(sanitizeOptions(decaf, { size: "5lb" }).size).toBe("12oz");
    expect(sanitizeOptions(lantern, { size: "5lb", grind: "press" })).toEqual({
      size: "12oz",
      grind: "press",
      purchase: { mode: "once" },
    });
  });

  it("drops unknown values", () => {
    expect(sanitizeOptions(firstLight, { size: "1kg", grind: "dust", purchase: { mode: "lease" } })).toEqual(
      defaultOptions(firstLight),
    );
    expect(sanitizeOptions(firstLight, { purchase: { mode: "subscribe", every: 5 } }).purchase).toEqual({ mode: "once" });
    expect(sanitizeOptions(dripper, { variant: "neon" }).variant).toBe("parchment");
  });

  it("turns a subscription on gear into a one-time purchase and drops coffee fields", () => {
    expect(sanitizeOptions(mug, { size: "2lb", grind: "espresso", variant: "espresso", purchase: sub(2) })).toEqual({
      variant: "espresso",
      purchase: { mode: "once" },
    });
  });

  it("keeps valid subscriptions on coffee", () => {
    expect(sanitizeOptions(firstLight, { purchase: sub(3) }).purchase).toEqual(sub(3));
  });

  it("drops a colour on coffee", () => {
    expect(sanitizeOptions(firstLight, { variant: "clay" }).variant).toBeUndefined();
  });
});

describe("priceSummary", () => {
  it("changes with size", () => {
    expect(priceSummary(firstLight, { size: "12oz" }).unit).toBe(2100);
    expect(priceSummary(firstLight, { size: "2lb" }).unit).toBe(5200);
    expect(priceSummary(firstLight, { size: "5lb" }).unit).toBe(11800);
  });

  it("adds the $1 grind surcharge for ground coffee only", () => {
    expect(priceSummary(firstLight, { grind: "whole" }).unit).toBe(2100);
    expect(priceSummary(firstLight, { grind: "espresso" }).unit).toBe(2200);
    expect(priceSummary(firstLight, { size: "2lb", grind: "coldbrew" }).unit).toBe(5300);
  });

  it("takes 10% off subscriptions, rounded to the cent, and reports the savings", () => {
    const s = priceSummary(firstLight, { purchase: sub(2) });
    expect(s).toMatchObject({ unit: 1890, regularUnit: 2100, savings: 210, total: 1890, regularTotal: 2100 });
    // Highland Almanac 2 lb ground: 4600 + 100 = 4700 → 4230
    const almanac = priceSummary(product("highland-almanac"), { size: "2lb", grind: "filter", purchase: sub(4) }, 2);
    expect(almanac).toMatchObject({ unit: 4230, regularUnit: 4700, total: 8460, savings: 940 });
    // Rounding: Deep Field 12 oz ground = 1900 → 1710; Harvest Lantern 2 lb ground = 5900 → 5310
    expect(priceSummary(product("deep-field"), { grind: "espresso", purchase: sub(3) }).unit).toBe(1710);
    expect(priceSummary(lantern, { size: "2lb", grind: "press", purchase: sub(3) }).unit).toBe(5310);
  });

  it("multiplies by a clamped quantity", () => {
    expect(priceSummary(firstLight, {}, 3).total).toBe(6300);
    expect(priceSummary(firstLight, {}, 0).qty).toBe(1);
    expect(priceSummary(firstLight, {}, 99).qty).toBe(MAX_QTY);
    expect(priceSummary(firstLight, {}, Number.NaN).total).toBe(2100);
  });

  it("works out a price per cup for coffee", () => {
    expect(priceSummary(firstLight, {}).perCup).toBe(95); // 2100 / 22
    expect(priceSummary(firstLight, { size: "5lb" }).perCup).toBe(79); // 11800 / 150
  });

  it("ignores grind and subscription for gear", () => {
    const s = priceSummary(dripper, { grind: "espresso", size: "2lb", purchase: sub(2), variant: "clay" }, 2);
    expect(s).toMatchObject({ unit: 3400, regularUnit: 3400, total: 6800, savings: 0 });
    expect(s.perCup).toBeUndefined();
  });

  it("prices an unavailable size at the fallback size instead of throwing", () => {
    expect(priceSummary(decaf, { size: "5lb" }).unit).toBe(1900);
  });
});

describe("URL options", () => {
  it("parses size, grind and plan", () => {
    expect(parseOptions(firstLight, "?size=2lb&grind=espresso&plan=sub3")).toEqual({
      size: "2lb",
      grind: "espresso",
      purchase: sub(3),
    });
  });

  it("parses a colour for gear and ignores coffee params", () => {
    expect(parseOptions(dripper, "color=clay&plan=sub2&size=5lb")).toEqual({ variant: "clay", purchase: { mode: "once" } });
  });

  it("treats junk as the defaults", () => {
    expect(parseOptions(firstLight, "?size=huge&grind=&plan=sub9")).toEqual(defaultOptions(firstLight));
    expect(parseOptions(decaf, new URLSearchParams("size=5lb")).size).toBe("12oz");
  });

  it("serializes only what differs from the defaults", () => {
    expect(serializeOptions(firstLight, defaultOptions(firstLight))).toBe("");
    expect(serializeOptions(firstLight, { size: "2lb", grind: "espresso", purchase: sub(3) })).toBe(
      "size=2lb&grind=espresso&plan=sub3",
    );
    expect(serializeOptions(dripper, { variant: "clay", purchase: { mode: "once" } })).toBe("color=clay");
    expect(serializeOptions(kettle, { purchase: sub(2) })).toBe("");
  });

  it("round-trips through the URL", () => {
    const cases: Array<[Product, ProductOptions]> = [
      [firstLight, { size: "5lb", grind: "coldbrew", purchase: sub(4) }],
      [firstLight, defaultOptions(firstLight)],
      [lantern, { size: "2lb", grind: "whole", purchase: sub(2) }],
      [mug, { variant: "espresso", purchase: { mode: "once" } }],
      [kettle, { purchase: { mode: "once" } }],
    ];
    for (const [p, options] of cases) {
      expect(parseOptions(p, serializeOptions(p, options))).toEqual(options);
    }
  });

  it("merges into an existing query string without touching other params", () => {
    expect(mergeOptionsIntoSearch("?showcase=linear&size=5lb", firstLight, { size: "2lb", purchase: sub(2) })).toBe(
      "?showcase=linear&size=2lb&plan=sub2",
    );
    expect(mergeOptionsIntoSearch("?plan=sub3", firstLight, defaultOptions(firstLight))).toBe("");
  });

  it("maps plans to and from their ids", () => {
    expect(planId({ mode: "once" })).toBe("once");
    expect(planId(sub(4))).toBe("sub4");
    expect(purchaseFromPlan("sub2")).toEqual(sub(2));
    expect(purchaseFromPlan("sub1")).toEqual({ mode: "once" });
    expect(purchaseFromPlan(null)).toEqual({ mode: "once" });
  });
});

describe("toCartLine", () => {
  it("builds a coffee line with size, grind and purchase", () => {
    expect(toCartLine(firstLight, { size: "2lb", grind: "espresso", purchase: sub(3) }, 2)).toEqual({
      slug: "first-light",
      size: "2lb",
      grind: "espresso",
      purchase: sub(3),
      qty: 2,
    });
  });

  it("builds a gear line with its colour and never a subscription", () => {
    expect(toCartLine(dripper, { variant: "clay", purchase: sub(2), grind: "press" })).toEqual({
      slug: "contour-dripper",
      variant: "clay",
      purchase: { mode: "once" },
      qty: 1,
    });
    expect(toCartLine(kettle, {})).toEqual({ slug: "steady-pour-kettle", purchase: { mode: "once" }, qty: 1 });
  });

  it("gives one-time and subscription lines different keys, and equal options the same key", () => {
    const key = (o: Parameters<typeof toCartLine>[1]) => {
      const { qty: _qty, ...line } = toCartLine(firstLight, o);
      return lineKey(line);
    };
    const once = key({ size: "12oz", grind: "whole", purchase: { mode: "once" } });
    const every2 = key({ size: "12oz", grind: "whole", purchase: sub(2) });
    const every3 = key({ size: "12oz", grind: "whole", purchase: sub(3) });
    expect(once).not.toBe(every2);
    expect(every2).not.toBe(every3);
    expect(key({ size: "12oz", grind: "whole", purchase: { mode: "once" } })).toBe(once);
  });

  it("matches the quick-add line for the default options", () => {
    const { qty: _qty, ...line } = toCartLine(firstLight, defaultOptions(firstLight));
    expect(lineKey(line)).toBe(lineKey({ slug: "first-light", size: "12oz", grind: "whole", purchase: { mode: "once" } }));
  });
});

describe("labels", () => {
  it("describes the purchase", () => {
    expect(purchaseLabel({ mode: "once" })).toBe("One-time purchase");
    expect(purchaseLabel(sub(3))).toBe("Every 3 weeks");
  });

  it("summarises the options", () => {
    expect(optionsSummary(firstLight, { size: "2lb", grind: "espresso", purchase: sub(3) })).toBe(
      "2 lb · Espresso · Every 3 weeks",
    );
    expect(optionsSummary(firstLight, {})).toBe("12 oz · Whole bean · One-time");
    expect(optionsSummary(dripper, { variant: "clay" })).toBe("Clay");
    expect(optionsSummary(kettle, {})).toBe("");
  });

  it("compares options", () => {
    expect(sameOptions(defaultOptions(firstLight), parseOptions(firstLight, ""))).toBe(true);
    expect(sameOptions(defaultOptions(firstLight), { ...defaultOptions(firstLight), purchase: sub(2) })).toBe(false);
  });
});

describe("defaultPick", () => {
  it("gives quick add a 12 oz whole-bean one-time line, its price and matching labels", () => {
    const pick = defaultPick(product("first-light"));
    expect(pick.line).toEqual({ slug: "first-light", size: "12oz", grind: "whole", purchase: { mode: "once" }, qty: 1 });
    expect(pick.unit).toBe(2100);
    expect(pick.short).toBe("12 oz");
    expect(pick.summary).toBe("12 oz · Whole bean · One-time");
  });

  it("uses the first colour for gear with variants, and no options for gear without", () => {
    const mug = defaultPick(product("contour-enamel-mug"));
    expect(mug.line).toMatchObject({ slug: "contour-enamel-mug", variant: "parchment", purchase: { mode: "once" } });
    expect(mug.short).toBe("Parchment");
    const kettle = defaultPick(product("steady-pour-kettle"));
    expect(kettle.line).toEqual({ slug: "steady-pour-kettle", purchase: { mode: "once" }, qty: 1 });
    expect(kettle.unit).toBe(7200);
  });

  it("matches the cart line key the product page would make for the same options", () => {
    const coffee = product("honey-ridge");
    expect(lineKey(defaultPick(coffee).line)).toBe(lineKey(toCartLine(coffee, defaultOptions(coffee))));
  });
});
