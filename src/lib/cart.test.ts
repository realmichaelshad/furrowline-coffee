import { describe, expect, it } from "vitest";
import { cartReducer, cartTotals, EMPTY_CART, lineKey, MAX_QTY, parseStoredCart, type CartState } from "./cart";

const once = { mode: "once" } as const;
const sub2 = { mode: "subscribe", every: 2 } as const;

function add(state: CartState, line: Parameters<typeof lineKey>[0] & { qty?: number }): CartState {
  return cartReducer(state, { type: "add", line });
}

describe("cartReducer", () => {
  it("adds a new line with a stable key", () => {
    const s = add(EMPTY_CART, { slug: "first-light", size: "12oz", grind: "whole", purchase: once });
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0]).toMatchObject({ slug: "first-light", qty: 1, key: "first-light|12oz|whole|-|once" });
  });

  it("merges identical options into one line", () => {
    let s = add(EMPTY_CART, { slug: "first-light", size: "12oz", grind: "whole", purchase: once });
    s = add(s, { slug: "first-light", size: "12oz", grind: "whole", purchase: once, qty: 2 });
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0]?.qty).toBe(3);
  });

  it("keeps one-time and subscription lines apart", () => {
    let s = add(EMPTY_CART, { slug: "first-light", size: "12oz", grind: "whole", purchase: once });
    s = add(s, { slug: "first-light", size: "12oz", grind: "whole", purchase: sub2 });
    s = add(s, { slug: "first-light", size: "12oz", grind: "whole", purchase: { mode: "subscribe", every: 4 } });
    expect(s.lines.map((l) => l.key)).toEqual([
      "first-light|12oz|whole|-|once",
      "first-light|12oz|whole|-|sub2",
      "first-light|12oz|whole|-|sub4",
    ]);
  });

  it("keeps different sizes and grinds apart", () => {
    let s = add(EMPTY_CART, { slug: "honey-ridge", size: "12oz", grind: "whole", purchase: once });
    s = add(s, { slug: "honey-ridge", size: "2lb", grind: "whole", purchase: once });
    s = add(s, { slug: "honey-ridge", size: "2lb", grind: "espresso", purchase: once });
    expect(s.lines).toHaveLength(3);
  });

  it("sets quantity, clamps it, and removes at zero", () => {
    let s = add(EMPTY_CART, { slug: "deep-field", size: "12oz", grind: "espresso", purchase: once });
    const key = s.lines[0]!.key;
    s = cartReducer(s, { type: "setQty", key, qty: 4 });
    expect(s.lines[0]?.qty).toBe(4);
    s = cartReducer(s, { type: "setQty", key, qty: 999 });
    expect(s.lines[0]?.qty).toBe(MAX_QTY);
    s = cartReducer(s, { type: "setQty", key, qty: 0 });
    expect(s.lines).toHaveLength(0);
  });

  it("caps merged quantity at the maximum", () => {
    let s = add(EMPTY_CART, { slug: "deep-field", size: "12oz", purchase: once, qty: 20 });
    s = add(s, { slug: "deep-field", size: "12oz", purchase: once, qty: 20 });
    expect(s.lines[0]?.qty).toBe(MAX_QTY);
  });

  it("ignores adds with zero quantity", () => {
    expect(add(EMPTY_CART, { slug: "deep-field", purchase: once, qty: 0 })).toBe(EMPTY_CART);
  });

  it("removes and clears", () => {
    let s = add(EMPTY_CART, { slug: "deep-field", size: "12oz", purchase: once });
    s = add(s, { slug: "steady-pour-kettle", purchase: once });
    s = cartReducer(s, { type: "remove", key: s.lines[0]!.key });
    expect(s.lines.map((l) => l.slug)).toEqual(["steady-pour-kettle"]);
    expect(cartReducer(s, { type: "clear" })).toEqual(EMPTY_CART);
  });
});

describe("cartTotals", () => {
  it("is zero for an empty cart", () => {
    const t = cartTotals(EMPTY_CART);
    expect(t).toMatchObject({ itemCount: 0, subtotal: 0, savings: 0, shipping: 0, total: 0, hasSubscription: false });
  });

  it("sums lines, subscription savings and shipping", () => {
    let s = add(EMPTY_CART, { slug: "first-light", size: "12oz", grind: "whole", purchase: once, qty: 1 }); // 2100
    s = add(s, { slug: "deep-field", size: "12oz", grind: "espresso", purchase: sub2, qty: 1 }); // (1800+100)*0.9 = 1710
    const t = cartTotals(s);
    expect(t.itemCount).toBe(2);
    expect(t.subtotal).toBe(3810);
    expect(t.savings).toBe(190);
    expect(t.shipping).toBe(600);
    expect(t.remaining).toBe(690);
    expect(t.total).toBe(4410);
    expect(t.regularSubtotal).toBe(4000);
    expect(t.hasSubscription).toBe(true);
    expect(t.lines[1]?.optionsLabel).toBe("12 oz · Espresso");
  });

  it("adds up row by row as the drawer shows it: subtotal − savings + shipping = total", () => {
    // The configured product page from the walkthrough: 5 lb, pour-over, every 3 weeks, two bags, plus a mug.
    let s = add(EMPTY_CART, { slug: "first-light", size: "5lb", grind: "filter", purchase: { mode: "subscribe", every: 3 }, qty: 2 });
    s = add(s, { slug: "contour-enamel-mug", variant: "espresso", purchase: once });
    s = add(s, { slug: "honey-ridge", size: "12oz", grind: "whole", purchase: sub2, qty: 3 });
    const t = cartTotals(s);
    expect(t.savings).toBeGreaterThan(0);
    expect(t.regularSubtotal).toBe(t.lines.reduce((sum, l) => sum + l.regularUnit * l.line.qty, 0));
    expect(t.regularSubtotal - t.savings).toBe(t.subtotal);
    expect(t.regularSubtotal - t.savings + t.shipping).toBe(t.total);
  });

  it("charges shipping on what is paid, after subscription savings", () => {
    // A 2 lb Honey Ridge on subscription: $49.00 regular, $44.10 after 10% off, just under the $45 threshold.
    const s = add(EMPTY_CART, { slug: "honey-ridge", size: "2lb", grind: "whole", purchase: sub2 });
    const t = cartTotals(s);
    expect(t.regularSubtotal).toBeGreaterThanOrEqual(4500);
    expect(t.subtotal).toBeLessThan(4500);
    expect(t.qualifies).toBe(false);
    expect(t.total).toBe(t.subtotal + 600);
  });

  it("ships free over the threshold", () => {
    const s = add(EMPTY_CART, { slug: "steady-pour-kettle", variant: undefined, purchase: once }); // 7200
    const t = cartTotals(s);
    expect(t.shipping).toBe(0);
    expect(t.qualifies).toBe(true);
    expect(t.total).toBe(7200);
  });

  it("includes gear variant names in the options label", () => {
    const s = add(EMPTY_CART, { slug: "contour-enamel-mug", variant: "espresso", purchase: once, qty: 2 });
    const t = cartTotals(s);
    expect(t.lines[0]?.optionsLabel).toBe("Espresso");
    expect(t.subtotal).toBe(4400);
  });

  it("skips lines for unknown products or unsellable sizes", () => {
    const state: CartState = {
      lines: [
        { key: "x", slug: "ghost", qty: 1, purchase: once },
        { key: "y", slug: "harvest-lantern", size: "5lb", qty: 1, purchase: once },
        { key: "z", slug: "first-light", size: "12oz", qty: 1, purchase: once },
      ],
    };
    const t = cartTotals(state);
    expect(t.lines).toHaveLength(1);
    expect(t.subtotal).toBe(2100);
  });
});

describe("parseStoredCart", () => {
  it("returns an empty cart for missing or broken data", () => {
    expect(parseStoredCart(null)).toEqual(EMPTY_CART);
    expect(parseStoredCart("not json")).toEqual(EMPTY_CART);
    expect(parseStoredCart('{"lines": 4}')).toEqual(EMPTY_CART);
  });

  it("keeps valid lines and rebuilds their keys", () => {
    const raw = JSON.stringify({
      lines: [
        { slug: "first-light", size: "2lb", grind: "press", qty: 2, purchase: { mode: "subscribe", every: 3 }, key: "tampered" },
        { slug: "unknown", qty: 1, purchase: { mode: "once" } },
        { slug: "deep-field", size: "huge", qty: -4, purchase: { mode: "once" } },
        { slug: "honey-ridge", size: "12oz", qty: 1, purchase: { mode: "subscribe", every: 9 } },
      ],
    });
    const s = parseStoredCart(raw);
    expect(s.lines).toHaveLength(2);
    expect(s.lines[0]).toMatchObject({ key: "first-light|2lb|press|-|sub3", qty: 2 });
    expect(s.lines[1]?.purchase).toEqual({ mode: "once" });
  });

  it("merges stored lines that share options instead of keeping duplicate keys", () => {
    const line = { slug: "first-light", size: "12oz", grind: "whole", qty: 2, purchase: { mode: "once" } };
    const s = parseStoredCart(JSON.stringify({ lines: [line, { ...line, qty: 3 }] }));
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0]).toMatchObject({ key: "first-light|12oz|whole|-|once", qty: 5 });
    expect(new Set(s.lines.map((l) => l.key)).size).toBe(s.lines.length);
  });

  it("fills in a missing coffee size so it merges with the explicit 12 oz line", () => {
    const s = parseStoredCart(
      JSON.stringify({
        lines: [
          { slug: "honey-ridge", grind: "whole", qty: 1, purchase: { mode: "once" } },
          { slug: "honey-ridge", size: "12oz", grind: "whole", qty: 1, purchase: { mode: "once" } },
        ],
      }),
    );
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0]).toMatchObject({ size: "12oz", qty: 2 });
  });

  it("turns a stored subscription on gear into a one-time line that is still priced", () => {
    const s = parseStoredCart(
      JSON.stringify({ lines: [{ slug: "steady-pour-kettle", qty: 1, purchase: { mode: "subscribe", every: 2 } }] }),
    );
    expect(s.lines[0]?.purchase).toEqual({ mode: "once" });
    expect(cartTotals(s).lines).toHaveLength(1);
  });

  it("drops coffee-only options from gear and fixes unknown colours", () => {
    const s = parseStoredCart(
      JSON.stringify({ lines: [{ slug: "contour-enamel-mug", size: "2lb", grind: "espresso", variant: "neon", qty: 1, purchase: { mode: "once" } }] }),
    );
    expect(s.lines[0]?.size).toBeUndefined();
    expect(s.lines[0]?.grind).toBeUndefined();
    expect(s.lines[0]?.variant).toBe("parchment");
  });

  it("moves an unsold size to one the coffee is sold in", () => {
    const s = parseStoredCart(
      JSON.stringify({ lines: [{ slug: "harvest-lantern", size: "5lb", grind: "whole", qty: 1, purchase: { mode: "once" } }] }),
    );
    expect(s.lines[0]?.size).not.toBe("5lb");
    expect(cartTotals(s).lines).toHaveLength(1);
  });
});
