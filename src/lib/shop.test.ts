import { describe, expect, it } from "vitest";
import { PRODUCTS, getProduct, type Product } from "@/content/products";
import {
  DEFAULT_FILTERS,
  activeChips,
  clearFilters,
  facetCounts,
  facetsFor,
  filterProducts,
  isFiltered,
  nextRoastDay,
  normalizeFilters,
  parseFilters,
  removeChip,
  serializeFilters,
  setType,
  sortProducts,
  toggleFacet,
  visibleProducts,
  type ShopFilters,
} from "./shop";

const f = (over: Partial<ShopFilters> = {}): ShopFilters => ({
  ...DEFAULT_FILTERS,
  roast: [],
  country: [],
  origin: [],
  process: [],
  ...over,
});
const slugs = (list: Product[]) => list.map((p) => p.slug);
const filtered = (over: Partial<ShopFilters>) => slugs(filterProducts(PRODUCTS, f(over)));
const product = (slug: string) => getProduct(slug)!;

describe("facetsFor", () => {
  it("derives country, style and process from the catalog", () => {
    expect(facetsFor(product("first-light"))).toEqual({
      type: "coffee",
      roast: "light",
      countries: ["ethiopia"],
      origin: "single",
      process: "washed",
    });
    expect(facetsFor(product("honey-ridge"))).toEqual({
      type: "coffee",
      roast: "medium",
      countries: ["colombia"],
      origin: "single",
      process: "honey",
    });
    expect(facetsFor(product("deep-field"))).toEqual({
      type: "coffee",
      roast: "medium-dark",
      countries: ["colombia", "guatemala", "brazil"],
      origin: "blend",
      process: undefined,
    });
    expect(facetsFor(product("field-day"))).toMatchObject({ countries: ["colombia", "brazil"], origin: "blend", roast: "dark" });
    expect(facetsFor(product("slow-acre-decaf"))).toEqual({
      type: "coffee",
      roast: "medium",
      countries: ["colombia"],
      origin: "decaf",
      process: undefined,
    });
  });

  it("gives gear and merch their type only", () => {
    expect(facetsFor(product("steady-pour-kettle"))).toEqual({ type: "gear" });
    expect(facetsFor(product("field-canvas-tote"))).toEqual({ type: "merch" });
  });
});

describe("filterProducts: one facet at a time", () => {
  it("shows everything by default", () => {
    expect(filterProducts(PRODUCTS, DEFAULT_FILTERS)).toHaveLength(12);
  });

  it("filters by type", () => {
    expect(filtered({ type: "coffee" })).toHaveLength(7);
    expect(filtered({ type: "gear" })).toEqual(["contour-dripper", "steady-pour-kettle", "field-hand-grinder"]);
    expect(filtered({ type: "merch" })).toEqual(["contour-enamel-mug", "field-canvas-tote"]);
  });

  it("filters coffee by roast (values are OR'd)", () => {
    expect(filtered({ type: "coffee", roast: ["light"] })).toEqual(["first-light", "harvest-lantern"]);
    expect(filtered({ type: "coffee", roast: ["medium-dark", "dark"] })).toEqual(["deep-field", "field-day"]);
  });

  it("filters coffee by origin", () => {
    expect(filtered({ type: "coffee", origin: ["single"] })).toEqual(["first-light", "honey-ridge", "highland-almanac", "harvest-lantern"]);
    expect(filtered({ type: "coffee", origin: ["blend"] })).toEqual(["deep-field", "field-day"]);
    expect(filtered({ type: "coffee", origin: ["decaf"] })).toEqual(["slow-acre-decaf"]);
  });

  it("filters coffee by country, counting a blend for every country in it", () => {
    expect(filtered({ type: "coffee", country: ["ethiopia"] })).toEqual(["first-light"]);
    expect(filtered({ type: "coffee", country: ["colombia"] })).toEqual(["honey-ridge", "deep-field", "slow-acre-decaf", "field-day"]);
    expect(filtered({ type: "coffee", country: ["kenya", "guatemala"] })).toEqual(["highland-almanac", "deep-field", "harvest-lantern"]);
  });

  it("filters coffee by process", () => {
    expect(filtered({ type: "coffee", process: ["washed"] })).toEqual(["first-light", "highland-almanac", "harvest-lantern"]);
    expect(filtered({ type: "coffee", process: ["honey"] })).toEqual(["honey-ridge"]);
  });
});

describe("filterProducts: combinations", () => {
  it("ANDs facets together", () => {
    expect(filtered({ type: "coffee", roast: ["medium"], process: ["washed"] })).toEqual(["highland-almanac"]);
    expect(filtered({ type: "coffee", roast: ["light", "medium"], origin: ["single"], process: ["washed"] })).toEqual([
      "first-light",
      "highland-almanac",
      "harvest-lantern",
    ]);
    expect(filtered({ type: "coffee", roast: ["medium"], origin: ["decaf", "blend"] })).toEqual(["slow-acre-decaf"]);
  });

  it("can come up empty", () => {
    expect(filtered({ type: "coffee", roast: ["dark"], process: ["washed"] })).toEqual([]);
    expect(filtered({ type: "coffee", origin: ["decaf"], process: ["honey"] })).toEqual([]);
  });

  it("ignores roast filters for gear and merch when type is all", () => {
    expect(filtered({ roast: ["light"] })).toEqual([
      "first-light",
      "harvest-lantern",
      "contour-dripper",
      "steady-pour-kettle",
      "field-hand-grinder",
      "contour-enamel-mug",
      "field-canvas-tote",
    ]);
    expect(filtered({ type: "gear", roast: ["dark"], origin: ["decaf"] })).toHaveLength(3);
  });
});

describe("sortProducts", () => {
  it("features the signature four in order, then Limited, then New, then the rest in catalog order", () => {
    expect(slugs(sortProducts(PRODUCTS, "featured"))).toEqual([
      "first-light",
      "honey-ridge",
      "highland-almanac",
      "deep-field",
      "harvest-lantern",
      "field-day",
      "contour-dripper",
      "slow-acre-decaf",
      "steady-pour-kettle",
      "field-hand-grinder",
      "contour-enamel-mug",
      "field-canvas-tote",
    ]);
  });

  it("sorts by from-price both ways, keeping catalog order on ties", () => {
    const asc = slugs(sortProducts(PRODUCTS, "price-asc"));
    expect(asc.slice(0, 5)).toEqual(["field-day", "deep-field", "highland-almanac", "slow-acre-decaf", "honey-ridge"]);
    expect(asc.at(-1)).toBe("field-hand-grinder");
    const desc = slugs(sortProducts(PRODUCTS, "price-desc"));
    expect(desc.slice(0, 3)).toEqual(["field-hand-grinder", "steady-pour-kettle", "contour-dripper"]);
    // Highland Almanac and Slow Acre are both $19: the tie keeps catalog order in both directions.
    expect(desc.indexOf("highland-almanac")).toBeLessThan(desc.indexOf("slow-acre-decaf"));
    expect(desc.at(-1)).toBe("field-day");
  });

  it("sorts by roast light to dark with gear and merch last", () => {
    expect(slugs(sortProducts(PRODUCTS, "roast"))).toEqual([
      "first-light",
      "harvest-lantern",
      "honey-ridge",
      "highland-almanac",
      "slow-acre-decaf",
      "deep-field",
      "field-day",
      "contour-dripper",
      "steady-pour-kettle",
      "field-hand-grinder",
      "contour-enamel-mug",
      "field-canvas-tote",
    ]);
  });

  it("sorts by name", () => {
    expect(slugs(sortProducts(PRODUCTS, "name")).slice(0, 6)).toEqual([
      "contour-dripper",
      "contour-enamel-mug",
      "deep-field",
      "field-canvas-tote",
      "field-day",
      "field-hand-grinder",
    ]);
  });

  it("is stable: ties keep whatever order came in", () => {
    const reversed = [...PRODUCTS].reverse();
    const asc = slugs(sortProducts(reversed, "price-asc"));
    expect(asc.indexOf("slow-acre-decaf")).toBeLessThan(asc.indexOf("highland-almanac"));
    const roast = slugs(sortProducts(reversed, "roast"));
    expect(roast.slice(0, 2)).toEqual(["harvest-lantern", "first-light"]);
    expect(roast.slice(-5)).toEqual(["field-canvas-tote", "contour-enamel-mug", "field-hand-grinder", "steady-pour-kettle", "contour-dripper"]);
  });

  it("never mutates its input", () => {
    const copy = [...PRODUCTS];
    sortProducts(copy, "name");
    expect(copy).toEqual(PRODUCTS);
  });

  it("filters then sorts in visibleProducts", () => {
    expect(slugs(visibleProducts(f({ type: "coffee", roast: ["medium"], sort: "price-asc" })))).toEqual([
      "highland-almanac",
      "slow-acre-decaf",
      "honey-ridge",
    ]);
  });
});

describe("filter transitions", () => {
  it("narrows to coffee when a coffee facet is picked", () => {
    const next = toggleFacet(DEFAULT_FILTERS, "roast", "light");
    expect(next).toEqual(f({ type: "coffee", roast: ["light"] }));
    expect(toggleFacet(next, "roast", "light")).toEqual(f({ type: "coffee" }));
  });

  it("keeps facet values in canonical order", () => {
    let next = toggleFacet(f({ type: "coffee" }), "roast", "dark");
    next = toggleFacet(next, "roast", "light");
    expect(next.roast).toEqual(["light", "dark"]);
  });

  it("clears coffee facets when the type moves away from coffee", () => {
    const coffee = f({ type: "coffee", roast: ["light"], process: ["washed"], sort: "name" });
    expect(setType(coffee, "gear")).toEqual(f({ type: "gear", sort: "name" }));
    expect(setType(coffee, "all")).toEqual(f({ sort: "name" }));
    expect(setType(coffee, "coffee")).toEqual(coffee);
  });

  it("clears filters but keeps the sort", () => {
    expect(clearFilters(f({ type: "coffee", roast: ["dark"], sort: "price-desc" }))).toEqual(f({ sort: "price-desc" }));
  });

  it("knows when anything is filtered", () => {
    expect(isFiltered(DEFAULT_FILTERS)).toBe(false);
    expect(isFiltered(f({ sort: "name" }))).toBe(false);
    expect(isFiltered(f({ type: "merch" }))).toBe(true);
    expect(isFiltered(f({ origin: ["decaf"] }))).toBe(true);
  });

  it("normalizes filters that arrive from a URL", () => {
    expect(normalizeFilters(f({ roast: ["light"] }))).toEqual(f({ type: "coffee", roast: ["light"] }));
    expect(normalizeFilters(f({ type: "gear", roast: ["light"] }))).toEqual(f({ type: "gear" }));
    expect(normalizeFilters(f({ type: "coffee", origin: ["blend"] }))).toEqual(f({ type: "coffee", origin: ["blend"] }));
  });

  it("lists and removes active chips", () => {
    const filters = f({ type: "coffee", roast: ["light"], origin: ["single"], process: ["washed"] });
    const chips = activeChips(filters);
    expect(chips.map((c) => c.label)).toEqual(["Coffee", "Light roast", "Single origin", "Washed process"]);
    expect(removeChip(filters, chips[1]!)).toEqual(f({ type: "coffee", origin: ["single"], process: ["washed"] }));
    expect(removeChip(filters, chips[0]!)).toEqual(f());
    expect(activeChips(DEFAULT_FILTERS)).toEqual([]);
  });
});

describe("URL round trip", () => {
  it("serializes only what differs from the defaults", () => {
    expect(serializeFilters(DEFAULT_FILTERS)).toBe("");
    expect(serializeFilters(f({ type: "gear" }))).toBe("type=gear");
    expect(serializeFilters(f({ type: "coffee", roast: ["medium", "light"], origin: ["single", "blend", "decaf"], process: ["washed", "honey"], sort: "price-asc" }))).toBe(
      "type=coffee&roast=light,medium&origin=single,blend,decaf&process=washed,honey&sort=price-asc",
    );
  });

  it("parses what it serializes", () => {
    const cases: ShopFilters[] = [
      DEFAULT_FILTERS,
      f({ type: "merch", sort: "name" }),
      f({ type: "coffee", roast: ["light", "dark"], origin: ["decaf"], process: ["honey"], sort: "roast" }),
      f({ sort: "price-desc" }),
    ];
    for (const filters of cases) {
      expect(parseFilters(serializeFilters(filters))).toEqual(filters);
      expect(parseFilters(new URLSearchParams(serializeFilters(filters)))).toEqual(filters);
    }
  });

  it("accepts a leading ?, repeated keys, mixed case and spaces", () => {
    expect(parseFilters("?type=Coffee&roast=light&roast=DARK, medium")).toEqual(
      f({ type: "coffee", roast: ["light", "medium", "dark"] }),
    );
  });

  it("ignores junk", () => {
    expect(parseFilters("type=tea&roast=burnt,,light,light&origin=moon&process=natural&sort=random&utm_source=x")).toEqual(
      f({ roast: ["light"] }),
    );
    expect(parseFilters("")).toEqual(DEFAULT_FILTERS);
    expect(parseFilters(null)).toEqual(DEFAULT_FILTERS);
    expect(parseFilters("%%%&=&==")).toEqual(DEFAULT_FILTERS);
  });
});

describe("facetCounts", () => {
  it("counts every value with nothing selected", () => {
    const counts = facetCounts(PRODUCTS, DEFAULT_FILTERS);
    expect(counts.type).toEqual({ all: 12, coffee: 7, gear: 3, merch: 2 });
    expect(counts.roast).toEqual({ light: 2, medium: 3, "medium-dark": 1, dark: 1 });
    expect(counts.origin).toEqual({ single: 4, blend: 2, decaf: 1 });
    expect(counts.process).toEqual({ washed: 3, honey: 1 });
  });

  it("counts each value given the other active filters", () => {
    const counts = facetCounts(PRODUCTS, f({ type: "coffee", roast: ["light"] }));
    // Roast values ignore the current roast pick (they are OR'd), the other facets respect it.
    expect(counts.roast).toEqual({ light: 2, medium: 3, "medium-dark": 1, dark: 1 });
    expect(counts.origin).toEqual({ single: 2, blend: 0, decaf: 0 });
    expect(counts.process).toEqual({ washed: 2, honey: 0 });
    // Type counts show what each type pill would list (leaving coffee clears the coffee facets).
    expect(counts.type).toEqual({ all: 12, coffee: 2, gear: 3, merch: 2 });
  });

  it("combines several facets", () => {
    const counts = facetCounts(PRODUCTS, f({ type: "coffee", origin: ["single"], process: ["washed"] }));
    expect(counts.roast).toEqual({ light: 2, medium: 1, "medium-dark": 0, dark: 0 });
    expect(counts.process).toEqual({ washed: 3, honey: 1 });
    expect(counts.origin).toEqual({ single: 3, blend: 0, decaf: 0 });
  });
});

describe("nextRoastDay", () => {
  const tz = "America/Los_Angeles";
  it("is today on a roast-day morning, before the noon cut-off", () => {
    expect(nextRoastDay(new Date("2026-10-20T18:59:00Z"), tz)).toEqual({ weekday: 2, daysAway: 0, label: "Today" }); // Tue 11:59
  });
  it("moves on once the day's roast is full", () => {
    expect(nextRoastDay(new Date("2026-10-20T19:00:00Z"), tz)).toEqual({ weekday: 5, daysAway: 3, label: "Friday" }); // Tue 12:00
  });
  it("says tomorrow the day before", () => {
    expect(nextRoastDay(new Date("2026-10-22T20:00:00Z"), tz)).toEqual({ weekday: 5, daysAway: 1, label: "Tomorrow" }); // Thu
  });
  it("wraps from Friday afternoon to Tuesday", () => {
    expect(nextRoastDay(new Date("2026-10-23T22:00:00Z"), tz)).toEqual({ weekday: 2, daysAway: 4, label: "Tuesday" });
  });
});

describe("country facet", () => {
  it("counts each country, with blends in every country they contain", () => {
    expect(facetCounts(PRODUCTS, f()).country).toEqual({ ethiopia: 1, colombia: 4, guatemala: 2, brazil: 2, kenya: 1 });
  });

  it("round-trips through the URL, chips and clearing", () => {
    const filters = f({ type: "coffee", country: ["colombia", "kenya"] });
    expect(serializeFilters(f({ type: "coffee", country: ["kenya", "colombia"] }))).toBe("type=coffee&country=colombia,kenya");
    expect(parseFilters("country=Kenya,peru,colombia")).toEqual(f({ country: ["colombia", "kenya"] }));
    expect(normalizeFilters(parseFilters("country=brazil"))).toEqual(f({ type: "coffee", country: ["brazil"] }));
    expect(activeChips(filters).map((c) => c.label)).toEqual(["Coffee", "From Colombia", "From Kenya"]);
    expect(toggleFacet(f(), "country", "ethiopia")).toEqual(f({ type: "coffee", country: ["ethiopia"] }));
    expect(setType(filters, "gear").country).toEqual([]);
    expect(clearFilters(filters).country).toEqual([]);
  });
});
