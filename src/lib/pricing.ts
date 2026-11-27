import {
  GRINDS,
  SUBSCRIPTION_INTERVALS,
  type GrindId,
  type Product,
  type SizeId,
  type SubscriptionInterval,
} from "@/content/products";
import { SHIPPING, SUBSCRIPTION_DISCOUNT } from "@/content/site";

/* ==========================================================================
   Pricing rules (all amounts are integer cents)
   - Coffee: price comes from the chosen size, plus a grind surcharge
     (whole bean is free, ground to order adds $1.00).
   - Gear and merch: one fixed price; variants never change it.
   - Subscribe & save: 10% off the unit price, rounded to the nearest cent,
     every 2, 3 or 4 weeks. Coffee only.
   ========================================================================== */

export type Purchase = { mode: "once" } | { mode: "subscribe"; every: SubscriptionInterval };

export interface PriceOptions {
  size?: SizeId;
  grind?: GrindId;
  purchase?: Purchase;
}

export class PricingError extends Error {}

export const ONE_TIME: Purchase = { mode: "once" };

export function grindSurcharge(grind: GrindId | undefined): number {
  if (!grind) return 0;
  return GRINDS.find((g) => g.id === grind)?.surcharge ?? 0;
}

export function isSubscriptionInterval(value: number): value is SubscriptionInterval {
  return (SUBSCRIPTION_INTERVALS as readonly number[]).includes(value);
}

/** Applies the subscribe-and-save discount to a unit price. */
export function subscriptionPrice(cents: number): number {
  return Math.round(cents * (1 - SUBSCRIPTION_DISCOUNT));
}

/** Unit price before any subscription discount. */
export function basePrice(product: Product, options: PriceOptions = {}): number {
  if (product.type !== "coffee") return product.price;
  const size = options.size ?? "12oz";
  const sizePrice = product.prices[size];
  if (sizePrice === undefined) {
    throw new PricingError(`${product.name} is not sold in ${size}`);
  }
  return sizePrice + grindSurcharge(options.grind ?? "whole");
}

/** Unit price the customer pays for these options. */
export function unitPrice(product: Product, options: PriceOptions = {}): number {
  const base = basePrice(product, options);
  if (options.purchase?.mode === "subscribe") {
    if (product.type !== "coffee") throw new PricingError("Only coffee can be subscribed to");
    return subscriptionPrice(base);
  }
  return base;
}

export interface ShippingProgress {
  /** Shipping charge in cents (0 when free or when the cart is empty). */
  shipping: number;
  /** Cents still needed to reach free shipping. */
  remaining: number;
  /** 0 to 1, for the progress bar. */
  progress: number;
  qualifies: boolean;
}

export function shippingFor(subtotal: number): ShippingProgress {
  const qualifies = subtotal >= SHIPPING.freeOver;
  return {
    shipping: subtotal === 0 || qualifies ? 0 : SHIPPING.flatRate,
    remaining: Math.max(0, SHIPPING.freeOver - subtotal),
    progress: Math.min(1, subtotal / SHIPPING.freeOver),
    qualifies,
  };
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** "$21.00", or "$21" with `{ compact: true }` when the amount has no cents. */
export function formatPrice(cents: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact && cents % 100 === 0) return usdWhole.format(cents / 100);
  return usd.format(cents / 100);
}

export function describePurchase(purchase: Purchase): string {
  return purchase.mode === "once" ? "One-time purchase" : `Delivered every ${purchase.every} weeks`;
}
