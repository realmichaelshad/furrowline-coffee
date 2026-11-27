import {
  GRINDS,
  SIZES,
  isCoffee,
  sizesFor,
  type GrindId,
  type Product,
  type SizeId,
  type SubscriptionInterval,
} from "@/content/products";
import type { NewCartLine } from "./cart";
import { clampQty } from "./qty";
import { ONE_TIME, basePrice, describePurchase, isSubscriptionInterval, unitPrice, type Purchase } from "./pricing";

/* ==========================================================================
   Product page options: what the visitor has picked on /shop/[slug]
   (size, grind, one-time or subscription, colour) and everything derived
   from it: the price summary, the cart line and the shareable URL
   (?size=2lb&grind=espresso&plan=sub3, ?color=clay for gear).
   Pure functions, unit-tested in product-options.test.ts. Every price comes
   from src/lib/pricing.ts; no pricing rule is repeated here.
   ========================================================================== */

export interface ProductOptions {
  /** Coffee only. */
  size?: SizeId;
  /** Coffee only. */
  grind?: GrindId;
  /** Gear/merch colour, when the product has variants. */
  variant?: string;
  /** Always one-time for gear and merch. */
  purchase: Purchase;
}

/** Loose shape for untrusted input (URL params, stored state). */
export interface OptionsInput {
  size?: unknown;
  grind?: unknown;
  variant?: unknown;
  purchase?: unknown;
}

export type PlanId = "once" | `sub${SubscriptionInterval}`;

/** Cups per bag at a 15 g dose (matches the SIZES copy: 340 g is about 22 cups). */
export const CUPS_PER_SIZE: Record<SizeId, number> = { "12oz": 22, "2lb": 60, "5lb": 150 };

/** URL parameter names. Anything else in the query string is left alone. */
export const OPTION_PARAMS = ["size", "grind", "plan", "color"] as const;

const DEFAULT_SIZE: SizeId = "12oz";
const DEFAULT_GRIND: GrindId = "whole";

function firstSize(product: Product): SizeId | undefined {
  if (!isCoffee(product)) return undefined;
  const sizes = sizesFor(product);
  return sizes.some((s) => s.id === DEFAULT_SIZE) ? DEFAULT_SIZE : sizes[0]?.id;
}

/** 12 oz (or the first size sold), whole bean, one-time; the first colour for gear. */
export function defaultOptions(product: Product): ProductOptions {
  if (isCoffee(product)) {
    return { size: firstSize(product), grind: DEFAULT_GRIND, purchase: ONE_TIME };
  }
  const variant = product.variants?.[0]?.id;
  return variant ? { variant, purchase: ONE_TIME } : { purchase: ONE_TIME };
}

function sanitizePurchase(value: unknown): Purchase {
  if (!value || typeof value !== "object") return ONE_TIME;
  const { mode, every } = value as { mode?: unknown; every?: unknown };
  const n = Number(every);
  if (mode === "subscribe" && isSubscriptionInterval(n)) return { mode: "subscribe", every: n };
  return ONE_TIME;
}

/**
 * Turns any partial or untrusted options into a valid set for this product:
 * an unavailable size falls back to the first available one, unknown grinds
 * become whole bean, subscriptions on gear become one-time, unknown colours
 * fall back to the first colour, and fields that don't apply are dropped.
 */
export function sanitizeOptions(product: Product, input: OptionsInput = {}): ProductOptions {
  if (isCoffee(product)) {
    const sizes = sizesFor(product);
    const size = sizes.find((s) => s.id === input.size)?.id ?? firstSize(product);
    const grind = GRINDS.find((g) => g.id === input.grind)?.id ?? DEFAULT_GRIND;
    return { size, grind, purchase: sanitizePurchase(input.purchase) };
  }
  const variants = product.variants ?? [];
  const variant = variants.find((v) => v.id === input.variant)?.id ?? variants[0]?.id;
  return variant ? { variant, purchase: ONE_TIME } : { purchase: ONE_TIME };
}

export function planId(purchase: Purchase): PlanId {
  return purchase.mode === "once" ? "once" : `sub${purchase.every}`;
}

export function purchaseFromPlan(plan: string | null | undefined): Purchase {
  const match = /^sub(\d)$/.exec(plan ?? "");
  const every = Number(match?.[1]);
  return match && isSubscriptionInterval(every) ? { mode: "subscribe", every } : ONE_TIME;
}

/** Reads options from a query string ("?size=2lb&plan=sub3") or URLSearchParams. */
export function parseOptions(product: Product, search: string | URLSearchParams): ProductOptions {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  return sanitizeOptions(product, {
    size: params.get("size") ?? undefined,
    grind: params.get("grind") ?? undefined,
    variant: params.get("color") ?? undefined,
    purchase: purchaseFromPlan(params.get("plan")),
  });
}

/**
 * Options as query parameters, leaving out anything that matches the default
 * so an untouched page keeps its clean URL. Returns "" or "size=2lb&plan=sub3".
 */
export function serializeOptions(product: Product, options: OptionsInput): string {
  const clean = sanitizeOptions(product, options);
  const defaults = defaultOptions(product);
  const params = new URLSearchParams();
  if (clean.size && clean.size !== defaults.size) params.set("size", clean.size);
  if (clean.grind && clean.grind !== defaults.grind) params.set("grind", clean.grind);
  if (clean.purchase.mode === "subscribe") params.set("plan", planId(clean.purchase));
  if (clean.variant && clean.variant !== defaults.variant) params.set("color", clean.variant);
  return params.toString();
}

/**
 * Writes the options into an existing query string, keeping unrelated
 * parameters (e.g. ?showcase=linear). Returns "?…" or "".
 */
export function mergeOptionsIntoSearch(current: string, product: Product, options: OptionsInput): string {
  const params = new URLSearchParams(current);
  OPTION_PARAMS.forEach((key) => params.delete(key));
  new URLSearchParams(serializeOptions(product, options)).forEach((value, key) => params.set(key, value));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function sameOptions(a: ProductOptions, b: ProductOptions): boolean {
  return (
    a.size === b.size && a.grind === b.grind && a.variant === b.variant && planId(a.purchase) === planId(b.purchase)
  );
}

/** A product page's quantity: at least 1 (see clampQty). */
export function clampQuantity(qty: number): number {
  return clampQty(qty, 1);
}

export interface PriceSummary {
  qty: number;
  /** What the customer pays per bag/item. */
  unit: number;
  /** Per item before the subscription discount. */
  regularUnit: number;
  total: number;
  regularTotal: number;
  /** Saved across the whole quantity (0 for one-time purchases). */
  savings: number;
  /** Coffee only: unit price per cup at a 15 g dose, rounded to the cent. */
  perCup?: number;
}

export function priceSummary(product: Product, options: OptionsInput, qty = 1): PriceSummary {
  const clean = sanitizeOptions(product, options);
  const q = clampQuantity(qty);
  const priceOptions = { size: clean.size, grind: clean.grind, purchase: clean.purchase };
  const unit = unitPrice(product, priceOptions);
  const regularUnit = basePrice(product, priceOptions);
  const summary: PriceSummary = {
    qty: q,
    unit,
    regularUnit,
    total: unit * q,
    regularTotal: regularUnit * q,
    savings: (regularUnit - unit) * q,
  };
  if (clean.size) summary.perCup = Math.round(unit / CUPS_PER_SIZE[clean.size]);
  return summary;
}

/** The cart line for these options. Same options always give the same lineKey. */
export function toCartLine(product: Product, options: OptionsInput, qty = 1): NewCartLine {
  const clean = sanitizeOptions(product, options);
  const line: NewCartLine = { slug: product.slug, purchase: clean.purchase, qty: clampQuantity(qty) };
  if (clean.size) line.size = clean.size;
  if (clean.grind) line.grind = clean.grind;
  if (clean.variant) line.variant = clean.variant;
  return line;
}

/** "One-time purchase" or "Every 3 weeks". */
export function purchaseLabel(purchase: Purchase): string {
  return purchase.mode === "once" ? describePurchase(purchase) : `Every ${purchase.every} weeks`;
}

/** "12 oz · Whole bean · One-time" for coffee, "Clay" for gear (or ""). */
export function optionsSummary(product: Product, options: OptionsInput): string {
  const clean = sanitizeOptions(product, options);
  if (!isCoffee(product)) {
    return product.variants?.find((v) => v.id === clean.variant)?.label ?? "";
  }
  const size = SIZES.find((s) => s.id === clean.size)?.label;
  const grind = GRINDS.find((g) => g.id === clean.grind)?.label;
  const plan = clean.purchase.mode === "once" ? "One-time" : purchaseLabel(clean.purchase);
  return [size, grind, plan].filter(Boolean).join(" · ");
}

export interface DefaultPick {
  options: ProductOptions;
  line: NewCartLine;
  /** Unit price for the default options. */
  unit: number;
  /** "12 oz · Whole bean · One-time" for coffee, the colour (or "") for gear. */
  summary: string;
  /** "12 oz" for coffee, the colour (or "") for gear: for compact button labels. */
  short: string;
}

/**
 * Everything a one-tap add needs (Quick add on cards, "Pairs well with" in the
 * cart, the showcase and the quiz result): the default options as a cart line,
 * their price and their labels. One source, so the label always matches the line.
 */
export function defaultPick(product: Product): DefaultPick {
  const options = defaultOptions(product);
  const short = isCoffee(product)
    ? (SIZES.find((s) => s.id === options.size)?.label ?? "")
    : (product.variants?.find((v) => v.id === options.variant)?.label ?? "");
  return {
    options,
    line: toCartLine(product, options),
    unit: priceSummary(product, options).unit,
    summary: optionsSummary(product, options),
    short,
  };
}
