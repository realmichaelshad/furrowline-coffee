import { describe, expect, it } from "vitest";
import { getProduct, type Product } from "@/content/products";
import {
  basePrice,
  formatPrice,
  PricingError,
  shippingFor,
  subscriptionPrice,
  unitPrice,
} from "./pricing";

function product(slug: string): Product {
  const p = getProduct(slug);
  if (!p) throw new Error(`missing ${slug}`);
  return p;
}

describe("unitPrice", () => {
  const firstLight = product("first-light");

  it("defaults to 12 oz whole bean, one-time", () => {
    expect(unitPrice(firstLight)).toBe(2100);
  });

  it("changes with size", () => {
    expect(unitPrice(firstLight, { size: "2lb" })).toBe(5200);
    expect(unitPrice(firstLight, { size: "5lb" })).toBe(11800);
  });

  it("adds $1 for any ground option and nothing for whole bean", () => {
    expect(unitPrice(firstLight, { grind: "whole" })).toBe(2100);
    expect(unitPrice(firstLight, { grind: "espresso" })).toBe(2200);
    expect(unitPrice(firstLight, { size: "2lb", grind: "press" })).toBe(5300);
  });

  it("takes 10% off subscriptions, rounded to the cent", () => {
    expect(unitPrice(firstLight, { purchase: { mode: "subscribe", every: 2 } })).toBe(1890);
    // 4600 + 100 = 4700 -> 4230
    const almanac = product("highland-almanac");
    expect(unitPrice(almanac, { size: "2lb", grind: "filter", purchase: { mode: "subscribe", every: 3 } })).toBe(4230);
  });

  it("does not depend on the subscription interval", () => {
    const a = unitPrice(firstLight, { purchase: { mode: "subscribe", every: 2 } });
    const b = unitPrice(firstLight, { purchase: { mode: "subscribe", every: 4 } });
    expect(a).toBe(b);
  });

  it("rejects sizes a coffee is not sold in", () => {
    expect(() => unitPrice(product("harvest-lantern"), { size: "5lb" })).toThrow(PricingError);
  });

  it("uses the fixed price for gear and ignores grind", () => {
    const kettle = product("steady-pour-kettle");
    expect(unitPrice(kettle)).toBe(7200);
    expect(basePrice(kettle, { grind: "espresso" })).toBe(7200);
  });

  it("refuses subscriptions on gear", () => {
    expect(() => unitPrice(product("steady-pour-kettle"), { purchase: { mode: "subscribe", every: 2 } })).toThrow(
      PricingError,
    );
  });

  it("takes 10% off a subscribed bag and nothing off a one-time one", () => {
    const base = basePrice(firstLight, {});
    expect(base - unitPrice(firstLight, { purchase: { mode: "subscribe", every: 2 } })).toBe(210);
    expect(base - unitPrice(firstLight, { purchase: { mode: "once" } })).toBe(0);
  });
});

describe("subscriptionPrice", () => {
  it("rounds half cents to the nearest cent", () => {
    expect(subscriptionPrice(1995)).toBe(1796); // 1795.5 -> 1796
    expect(subscriptionPrice(1000)).toBe(900);
  });
});

describe("shippingFor", () => {
  it("is free for an empty cart", () => {
    expect(shippingFor(0)).toMatchObject({ shipping: 0, remaining: 4500, progress: 0, qualifies: false });
  });
  it("charges the flat rate below the threshold", () => {
    expect(shippingFor(2100)).toMatchObject({ shipping: 600, remaining: 2400, qualifies: false });
    expect(shippingFor(2100).progress).toBeCloseTo(2100 / 4500);
  });
  it("is free at or above the threshold", () => {
    expect(shippingFor(4500)).toMatchObject({ shipping: 0, remaining: 0, progress: 1, qualifies: true });
    expect(shippingFor(9000)).toMatchObject({ shipping: 0, progress: 1 });
  });
});

describe("formatPrice", () => {
  it("formats cents as US dollars", () => {
    expect(formatPrice(2100)).toBe("$21.00");
    expect(formatPrice(1890)).toBe("$18.90");
    expect(formatPrice(2100, { compact: true })).toBe("$21");
    expect(formatPrice(1890, { compact: true })).toBe("$18.90");
  });
});
