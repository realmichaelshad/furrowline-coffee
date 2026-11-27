import {
  PRODUCTS,
  ROAST_LEVELS,
  fromPrice,
  isCoffee,
  type Product,
  type ProductType,
  type RoastLevel,
} from "@/content/products";
import { zonedParts, WEEKDAY_NAMES, type Weekday } from "./hours";

/* ==========================================================================
   Shop filtering and sorting (pure, unit-tested in shop.test.ts).
   - Type is one choice: all, coffee, brewing gear or merch.
   - Roast, country, style (single origin / blend / decaf) and process are
     multi-select facets that describe coffee. A blend counts for every
     country in it.
     They never filter gear or merch out: with type "all" those stay in view
     (the UI moves to type "coffee" when a coffee facet is picked, see
     toggleFacet), and with type "gear"/"merch" the facets are switched off.
   - Values inside a facet are OR'd; facets are AND'd together.
   - Every sort is stable: ties keep catalog order.
   - Filters round-trip through the URL: ?type=coffee&roast=light,medium
     &country=colombia&origin=single,blend,decaf&process=washed,honey
     &sort=price-asc (style keeps the "origin" key, so older links work)
   ========================================================================== */

export type TypeFilter = "all" | ProductType;
export type CountryFacet = "ethiopia" | "colombia" | "guatemala" | "brazil" | "kenya";
/** Style of coffee: one farm or region, a blend, or decaf. (URL key: "origin".) */
export type OriginFacet = "single" | "blend" | "decaf";
export type ProcessFacet = "washed" | "honey";
export type SortKey = "featured" | "price-asc" | "price-desc" | "roast" | "name";
export type CoffeeFacetKey = "roast" | "country" | "origin" | "process";

export interface ShopFilters {
  type: TypeFilter;
  roast: RoastLevel[];
  country: CountryFacet[];
  origin: OriginFacet[];
  process: ProcessFacet[];
  sort: SortKey;
}

export const DEFAULT_FILTERS: ShopFilters = Object.freeze({
  type: "all",
  roast: [],
  country: [],
  origin: [],
  process: [],
  sort: "featured",
}) as ShopFilters;

/** No coffee facets picked (the type and sort are left alone). */
const NO_FACETS = { roast: [], country: [], origin: [], process: [] } as const satisfies Pick<ShopFilters, CoffeeFacetKey>;

/* ---- Labels (shared by the toolbar, the drawer and the active chips) ------ */

/** `short` is what the type segment shows on phones, where all four have to fit on one row. */
export const TYPE_OPTIONS: Array<{ value: TypeFilter; label: string; short?: string }> = [
  { value: "all", label: "All" },
  { value: "coffee", label: "Coffee" },
  { value: "gear", label: "Brewing gear", short: "Gear" },
  { value: "merch", label: "Merch" },
];

export const ROAST_OPTIONS: Array<{ value: RoastLevel; label: string }> = ROAST_LEVELS.map((r) => ({
  value: r.id,
  label: r.label,
}));

/** In route order, as on the home page's origin map. */
export const COUNTRY_OPTIONS: Array<{ value: CountryFacet; label: string }> = [
  { value: "ethiopia", label: "Ethiopia" },
  { value: "colombia", label: "Colombia" },
  { value: "guatemala", label: "Guatemala" },
  { value: "brazil", label: "Brazil" },
  { value: "kenya", label: "Kenya" },
];

export const ORIGIN_OPTIONS: Array<{ value: OriginFacet; label: string }> = [
  { value: "single", label: "Single origin" },
  { value: "blend", label: "Blend" },
  { value: "decaf", label: "Decaf" },
];

export const PROCESS_OPTIONS: Array<{ value: ProcessFacet; label: string }> = [
  { value: "washed", label: "Washed" },
  { value: "honey", label: "Honey" },
];

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "roast", label: "Roast, light to dark" },
  { value: "name", label: "Name, A to Z" },
];

const TYPE_VALUES = TYPE_OPTIONS.map((o) => o.value);
const ROAST_VALUES = ROAST_OPTIONS.map((o) => o.value);
const COUNTRY_VALUES = COUNTRY_OPTIONS.map((o) => o.value);
const ORIGIN_VALUES = ORIGIN_OPTIONS.map((o) => o.value);
const PROCESS_VALUES = PROCESS_OPTIONS.map((o) => o.value);
const SORT_VALUES = SORT_OPTIONS.map((o) => o.value);

/* ---- Facets ------------------------------------------------------------- */

export interface ProductFacets {
  type: ProductType;
  roast?: RoastLevel;
  /** Every country in the bag, in COUNTRY_OPTIONS order. */
  countries?: CountryFacet[];
  origin?: OriginFacet;
  process?: ProcessFacet;
}

/** "Huila, Colombia" → "colombia", when it is one of the shop's countries. */
function countryOf(place: string): CountryFacet | undefined {
  const name = place.split(",").at(-1)?.trim().toLowerCase();
  return COUNTRY_VALUES.find((c) => c === name);
}

/**
 * What a product can be filtered by. Coffee only:
 * origin is decaf (process "decaf"), blend (a blend list or process "blend") or single origin;
 * process is washed or honey for single-origin lots (blends and decaf have none).
 */
export function facetsFor(product: Product): ProductFacets {
  if (!isCoffee(product)) return { type: product.type };
  const origin: OriginFacet =
    product.process === "decaf" ? "decaf" : product.blend?.length || product.process === "blend" ? "blend" : "single";
  const process: ProcessFacet | undefined =
    origin === "single" && (product.process === "washed" || product.process === "honey") ? product.process : undefined;
  const places = product.blend?.length ? product.blend.map((b) => b.origin) : [product.origin?.country ?? ""];
  const found = new Set(places.map(countryOf));
  const countries = COUNTRY_VALUES.filter((c) => found.has(c));
  return { type: "coffee", roast: product.roast, countries, origin, process };
}

function matchesFacet<T extends string>(selected: T[], value: T | undefined): boolean {
  return selected.length === 0 || (value !== undefined && selected.includes(value));
}

function matchesAny<T extends string>(selected: T[], values: T[] | undefined): boolean {
  return selected.length === 0 || (values ?? []).some((v) => selected.includes(v));
}

/** True when a product passes every active filter (sort is ignored). */
export function matches(product: Product, filters: ShopFilters): boolean {
  const f = facetsFor(product);
  if (filters.type !== "all" && f.type !== filters.type) return false;
  // Coffee facets describe coffee only: gear and merch are never filtered by them.
  if (f.type !== "coffee") return true;
  return (
    matchesFacet(filters.roast, f.roast) &&
    matchesAny(filters.country, f.countries) &&
    matchesFacet(filters.origin, f.origin) &&
    matchesFacet(filters.process, f.process)
  );
}

export function filterProducts(products: Product[], filters: ShopFilters): Product[] {
  return products.filter((p) => matches(p, filters));
}

/* ---- Sorting --------------------------------------------------------------- */

/** Featured rank: the signature four in order, then Limited, then New, then everything else. */
export function featuredRank(product: Product): number {
  if (isCoffee(product) && product.signature) return product.signatureIndex ?? 4;
  if (product.badge === "Limited") return 10;
  if (product.badge === "New") return 20;
  return 30;
}

function roastStep(product: Product): number {
  if (!isCoffee(product)) return Number.POSITIVE_INFINITY;
  return ROAST_LEVELS.find((r) => r.id === product.roast)?.step ?? 99;
}

const COMPARATORS: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => featuredRank(a) - featuredRank(b),
  "price-asc": (a, b) => fromPrice(a) - fromPrice(b),
  "price-desc": (a, b) => fromPrice(b) - fromPrice(a),
  roast: (a, b) => {
    const sa = roastStep(a);
    const sb = roastStep(b);
    return sa === sb ? 0 : sa < sb ? -1 : 1;
  },
  name: (a, b) => a.name.localeCompare(b.name, "en"),
};

/** Stable sort (ties keep the incoming order, which is catalog order by default). Returns a new array. */
export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const compare = COMPARATORS[sort];
  return products
    .map((product, index) => ({ product, index }))
    .sort((a, b) => compare(a.product, b.product) || a.index - b.index)
    .map((entry) => entry.product);
}

/** Filter then sort: what the grid shows. */
export function visibleProducts(filters: ShopFilters, products: Product[] = PRODUCTS): Product[] {
  return sortProducts(filterProducts(products, filters), filters.sort);
}

/* ---- Filter transitions used by the UI ----------------------------------- */

export function hasCoffeeFacets(filters: ShopFilters): boolean {
  return filters.roast.length > 0 || filters.country.length > 0 || filters.origin.length > 0 || filters.process.length > 0;
}

/** Anything narrowing the list (sort does not count). */
export function isFiltered(filters: ShopFilters): boolean {
  return filters.type !== "all" || hasCoffeeFacets(filters);
}

/** Coffee facets only make sense with type "coffee"; anything else clears them. */
export function setType(filters: ShopFilters, type: TypeFilter): ShopFilters {
  if (type === "coffee") return { ...filters, type };
  return { ...filters, type, ...NO_FACETS };
}

const FACET_ORDER: { roast: RoastLevel[]; country: CountryFacet[]; origin: OriginFacet[]; process: ProcessFacet[] } = {
  roast: ROAST_VALUES,
  country: COUNTRY_VALUES,
  origin: ORIGIN_VALUES,
  process: PROCESS_VALUES,
};

function canonical<T extends string>(values: T[], order: readonly T[]): T[] {
  return order.filter((v) => values.includes(v));
}

/** Toggles one facet value. Picking a coffee facet narrows the type to coffee. */
export function toggleFacet<K extends CoffeeFacetKey>(filters: ShopFilters, facet: K, value: ShopFilters[K][number]): ShopFilters {
  const current = filters[facet] as string[];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  const ordered = canonical(next, FACET_ORDER[facet] as string[]);
  const updated = { ...filters, [facet]: ordered } as ShopFilters;
  if (ordered.length > 0 && filters.type !== "coffee") updated.type = "coffee";
  return updated;
}

/** Clears every filter but keeps the sort order. */
export function clearFilters(filters: ShopFilters): ShopFilters {
  return { ...DEFAULT_FILTERS, ...NO_FACETS, sort: filters.sort };
}

/** Makes URL-supplied filters coherent: coffee facets imply type coffee; gear and merch drop them. */
export function normalizeFilters(filters: ShopFilters): ShopFilters {
  if (filters.type === "all" && hasCoffeeFacets(filters)) return { ...filters, type: "coffee" };
  if (filters.type === "gear" || filters.type === "merch") return setType(filters, filters.type);
  return filters;
}

export interface ActiveChip {
  key: string;
  facet: "type" | CoffeeFacetKey;
  value: string;
  label: string;
}

/** The removable chips under the toolbar, in a stable order. */
export function activeChips(filters: ShopFilters): ActiveChip[] {
  const chips: ActiveChip[] = [];
  if (filters.type !== "all") {
    const label = TYPE_OPTIONS.find((o) => o.value === filters.type)?.label ?? filters.type;
    chips.push({ key: `type:${filters.type}`, facet: "type", value: filters.type, label });
  }
  for (const value of filters.roast) {
    const label = ROAST_OPTIONS.find((o) => o.value === value)?.label ?? value;
    chips.push({ key: `roast:${value}`, facet: "roast", value, label: `${label} roast` });
  }
  for (const value of filters.country) {
    const label = COUNTRY_OPTIONS.find((o) => o.value === value)?.label ?? value;
    chips.push({ key: `country:${value}`, facet: "country", value, label: `From ${label}` });
  }
  for (const value of filters.origin) {
    const label = ORIGIN_OPTIONS.find((o) => o.value === value)?.label ?? value;
    chips.push({ key: `origin:${value}`, facet: "origin", value, label });
  }
  for (const value of filters.process) {
    const label = PROCESS_OPTIONS.find((o) => o.value === value)?.label ?? value;
    chips.push({ key: `process:${value}`, facet: "process", value, label: `${label} process` });
  }
  return chips;
}

/** Removes one chip. Removing the type chip resets to all (and clears coffee facets). */
export function removeChip(filters: ShopFilters, chip: Pick<ActiveChip, "facet" | "value">): ShopFilters {
  if (chip.facet === "type") return setType(filters, "all");
  const current = filters[chip.facet] as string[];
  return { ...filters, [chip.facet]: current.filter((v) => v !== chip.value) } as ShopFilters;
}

/* ---- Counts ---------------------------------------------------------------- */

export interface FacetCounts {
  type: Record<TypeFilter, number>;
  roast: Record<RoastLevel, number>;
  country: Record<CountryFacet, number>;
  origin: Record<OriginFacet, number>;
  process: Record<ProcessFacet, number>;
}

/**
 * How many products each facet value would show, given the other active filters:
 * - type values count what clicking that type shows (setType clears coffee facets for all/gear/merch);
 * - roast/country/origin/process values count the coffees matching every other filter plus that value alone.
 */
export function facetCounts(products: Product[], filters: ShopFilters): FacetCounts {
  const count = (f: ShopFilters) => products.reduce((n, p) => n + (matches(p, f) ? 1 : 0), 0);
  const asCoffee: ShopFilters = { ...filters, type: "coffee" };
  const byValue = <K extends CoffeeFacetKey>(facet: K, values: readonly string[]) =>
    Object.fromEntries(values.map((v) => [v, count({ ...asCoffee, [facet]: [v] } as ShopFilters)]));
  return {
    type: Object.fromEntries(TYPE_VALUES.map((t) => [t, count(setType(filters, t))])) as Record<TypeFilter, number>,
    roast: byValue("roast", ROAST_VALUES) as Record<RoastLevel, number>,
    country: byValue("country", COUNTRY_VALUES) as Record<CountryFacet, number>,
    origin: byValue("origin", ORIGIN_VALUES) as Record<OriginFacet, number>,
    process: byValue("process", PROCESS_VALUES) as Record<ProcessFacet, number>,
  };
}

/* ---- URL ------------------------------------------------------------------- */

function readList<T extends string>(params: URLSearchParams, key: string, allowed: readonly T[]): T[] {
  const raw = params
    .getAll(key)
    .flatMap((v) => v.split(","))
    .map((v) => v.trim().toLowerCase());
  return allowed.filter((v) => raw.includes(v));
}

/** Parses ?type=…&roast=…; unknown keys and values are ignored, duplicates collapse, order is canonical. */
export function parseFilters(input: string | URLSearchParams | null | undefined): ShopFilters {
  const params =
    input instanceof URLSearchParams ? input : new URLSearchParams((input ?? "").replace(/^\?/, ""));
  const type = (params.get("type") ?? "").trim().toLowerCase();
  const sort = (params.get("sort") ?? "").trim().toLowerCase();
  return {
    type: (TYPE_VALUES as string[]).includes(type) ? (type as TypeFilter) : "all",
    roast: readList(params, "roast", ROAST_VALUES),
    country: readList(params, "country", COUNTRY_VALUES),
    origin: readList(params, "origin", ORIGIN_VALUES),
    process: readList(params, "process", PROCESS_VALUES),
    sort: (SORT_VALUES as string[]).includes(sort) ? (sort as SortKey) : "featured",
  };
}

/** The query string (without "?") for these filters; defaults are omitted, so the default is "". */
export function serializeFilters(filters: ShopFilters): string {
  const parts: string[] = [];
  if (filters.type !== "all") parts.push(`type=${filters.type}`);
  const roast = canonical(filters.roast, ROAST_VALUES);
  const country = canonical(filters.country, COUNTRY_VALUES);
  const origin = canonical(filters.origin, ORIGIN_VALUES);
  const process = canonical(filters.process, PROCESS_VALUES);
  if (roast.length) parts.push(`roast=${roast.join(",")}`);
  if (country.length) parts.push(`country=${country.join(",")}`);
  if (origin.length) parts.push(`origin=${origin.join(",")}`);
  if (process.length) parts.push(`process=${process.join(",")}`);
  if (filters.sort !== "featured") parts.push(`sort=${filters.sort}`);
  return parts.join("&");
}

export function sameFilters(a: ShopFilters, b: ShopFilters): boolean {
  return serializeFilters(a) === serializeFilters(b);
}

/* ---- Roast days -------------------------------------------------------------- */

/** We roast on Tuesdays and Fridays; orders in by noon (café time) make that day's roast. */
export const ROAST_DAYS: Weekday[] = [2, 5];
export const ROAST_CUTOFF_MINUTES = 12 * 60;

export interface NextRoast {
  weekday: Weekday;
  /** 0 = today. */
  daysAway: number;
  /** "Today", "Tomorrow" or the weekday name. */
  label: string;
}

export function nextRoastDay(now: Date, timeZone = "America/Los_Angeles"): NextRoast {
  const local = zonedParts(now, timeZone);
  for (let offset = 0; offset < 8; offset++) {
    const weekday = ((local.weekday + offset) % 7) as Weekday;
    if (!ROAST_DAYS.includes(weekday)) continue;
    if (offset === 0 && local.minutes >= ROAST_CUTOFF_MINUTES) continue;
    const label = offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : WEEKDAY_NAMES[weekday];
    return { weekday, daysAway: offset, label };
  }
  return { weekday: 2, daysAway: 0, label: "Tuesday" }; // unreachable: a roast day always falls within a week
}
