import { getProduct, GRINDS, SIZES, type GrindId, type Product, type SizeId } from "@/content/products";
import { MAX_QTY } from "@/content/site";
import { basePrice, shippingFor, unitPrice, type Purchase, type ShippingProgress } from "./pricing";
import { sanitizeOptions } from "./product-options";
import { clampQty } from "./qty";

/* ==========================================================================
   Cart model: pure functions, unit-tested in cart.test.ts.
   React state lives in src/components/cart/CartProvider.tsx.
   ========================================================================== */

export { MAX_QTY };
export const CART_STORAGE_KEY = "furrowline.cart.v1";

export interface CartLine {
  /** Stable identity: same product + options merge into one line. */
  key: string;
  slug: string;
  qty: number;
  size?: SizeId;
  grind?: GrindId;
  /** Gear/merch variant id (colour). */
  variant?: string;
  purchase: Purchase;
}

export type NewCartLine = Omit<CartLine, "key" | "qty"> & { qty?: number };

export interface CartState {
  lines: CartLine[];
}

export type CartAction =
  | { type: "add"; line: NewCartLine }
  | { type: "setQty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "hydrate"; state: CartState };

export const EMPTY_CART: CartState = { lines: [] };

export function lineKey(line: Omit<CartLine, "key" | "qty">): string {
  const purchase = line.purchase.mode === "once" ? "once" : `sub${line.purchase.every}`;
  return [line.slug, line.size ?? "-", line.grind ?? "-", line.variant ?? "-", purchase].join("|");
}


export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const { qty = 1, ...rest } = action.line;
      const key = lineKey(rest);
      const amount = clampQty(qty);
      if (amount === 0) return state;
      const existing = state.lines.find((l) => l.key === key);
      if (existing) {
        return {
          lines: state.lines.map((l) => (l.key === key ? { ...l, qty: clampQty(l.qty + amount) } : l)),
        };
      }
      return { lines: [...state.lines, { ...rest, key, qty: amount }] };
    }
    case "setQty": {
      const qty = clampQty(action.qty);
      if (qty === 0) return { lines: state.lines.filter((l) => l.key !== action.key) };
      return { lines: state.lines.map((l) => (l.key === action.key ? { ...l, qty } : l)) };
    }
    case "remove":
      return { lines: state.lines.filter((l) => l.key !== action.key) };
    case "clear":
      return EMPTY_CART;
    case "hydrate":
      return action.state;
  }
}

export interface PricedLine {
  line: CartLine;
  product: Product;
  /** What the customer pays per unit. */
  unit: number;
  /** Unit price before the subscription discount. */
  regularUnit: number;
  total: number;
  savings: number;
  /** "12 oz · Whole bean" etc. */
  optionsLabel: string;
}

export interface CartTotals extends ShippingProgress {
  lines: PricedLine[];
  itemCount: number;
  /** Sum of line totals at regular prices, before subscription discounts (the "Subtotal" row). */
  regularSubtotal: number;
  /** Total saved through subscriptions (the "Subscription savings" row). */
  savings: number;
  /** What the goods cost after savings: regularSubtotal - savings. Free shipping is measured on this. */
  subtotal: number;
  /** subtotal + shipping, so the summary column adds up row by row. */
  total: number;
  hasSubscription: boolean;
}

export function optionsLabel(line: Pick<CartLine, "size" | "grind" | "variant">, product: Product): string {
  const parts: string[] = [];
  if (line.size) parts.push(SIZES.find((s) => s.id === line.size)?.label ?? line.size);
  if (line.grind) parts.push(GRINDS.find((g) => g.id === line.grind)?.label ?? line.grind);
  if (line.variant && product.type !== "coffee") {
    parts.push(product.variants?.find((v) => v.id === line.variant)?.label ?? line.variant);
  }
  return parts.join(" · ");
}

export function priceLine(line: CartLine, product: Product): PricedLine {
  const opts = { size: line.size, grind: line.grind, purchase: line.purchase };
  const unit = unitPrice(product, opts);
  const regularUnit = basePrice(product, opts);
  return {
    line,
    product,
    unit,
    regularUnit,
    total: unit * line.qty,
    savings: (regularUnit - unit) * line.qty,
    optionsLabel: optionsLabel(line, product),
  };
}

/** Prices every line, dropping lines whose product no longer exists or can't be priced. */
export function cartTotals(
  state: CartState,
  lookup: (slug: string) => Product | undefined = getProduct,
): CartTotals {
  const lines: PricedLine[] = [];
  for (const line of state.lines) {
    const product = lookup(line.slug);
    if (!product) continue;
    try {
      lines.push(priceLine(line, product));
    } catch {
      // Unsellable option combination (e.g. a size that was discontinued): skip it.
    }
  }
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const savings = lines.reduce((sum, l) => sum + l.savings, 0);
  const shipping = shippingFor(subtotal);
  return {
    ...shipping,
    lines,
    itemCount: lines.reduce((sum, l) => sum + l.line.qty, 0),
    regularSubtotal: subtotal + savings,
    savings,
    subtotal,
    total: subtotal + shipping.shipping,
    hasSubscription: lines.some((l) => l.line.purchase.mode === "subscribe"),
  };
}

/**
 * Parses untrusted localStorage JSON back into a valid cart. Every line goes
 * through the same option rules as the product page (sanitizeOptions: sizes
 * that are sold, known grinds and colours, no subscriptions on gear) and then
 * through the reducer's "add", so lines that end up with the same options
 * merge into one, exactly as if they had been added in this session.
 */
export function parseStoredCart(raw: string | null): CartState {
  if (!raw) return EMPTY_CART;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return EMPTY_CART;
  }
  if (!data || typeof data !== "object" || !Array.isArray((data as { lines?: unknown }).lines)) return EMPTY_CART;
  let state = EMPTY_CART;
  for (const item of (data as { lines: unknown[] }).lines) {
    if (!item || typeof item !== "object") continue;
    const stored = item as Record<string, unknown>;
    const product = typeof stored.slug === "string" ? getProduct(stored.slug) : undefined;
    if (!product) continue;
    const qty = clampQty(Number(stored.qty));
    if (qty === 0) continue;
    const options = sanitizeOptions(product, {
      size: stored.size,
      grind: stored.grind,
      variant: stored.variant,
      purchase: stored.purchase,
    });
    state = cartReducer(state, { type: "add", line: { slug: product.slug, ...options, qty } });
  }
  return state;
}
