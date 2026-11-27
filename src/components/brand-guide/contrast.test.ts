import { describe, expect, it } from "vitest";
import { bestInk, contrastRatio, formatRatio, hexToRgb, relativeLuminance, wcagLevel } from "@/components/brand-guide/contrast";

describe("hexToRgb", () => {
  it("parses six- and three-digit hex, with or without #", () => {
    expect(hexToRgb("#a4472a")).toEqual([164, 71, 42]);
    expect(hexToRgb("F4ECDF")).toEqual([244, 236, 223]);
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
  });

  it("rejects anything that is not a hex colour", () => {
    expect(() => hexToRgb("clay")).toThrow();
    expect(() => hexToRgb("#12345")).toThrow();
  });
});

describe("contrastRatio", () => {
  it("is 21:1 for black on white and 1:1 for a colour on itself", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 6);
    expect(contrastRatio("#000", "#fff")).toBeCloseTo(21, 6);
    expect(contrastRatio("#a4472a", "#a4472a")).toBeCloseTo(1, 6);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#241913", "#f4ecdf")).toBeCloseTo(contrastRatio("#f4ecdf", "#241913"), 9);
  });

  it("matches the contrast pairs documented in DESIGN.md", () => {
    expect(formatRatio(contrastRatio("#241913", "#f4ecdf"))).toBe("14.6:1"); // espresso on parchment
    expect(formatRatio(contrastRatio("#a4472a", "#f4ecdf"))).toBe("5.1:1"); // clay on parchment
    expect(formatRatio(contrastRatio("#fbf7f0", "#a4472a"))).toBe("5.6:1"); // linen on clay
    expect(formatRatio(contrastRatio("#efa47a", "#241913"))).toBe("8.4:1"); // peach on espresso
    expect(formatRatio(contrastRatio("#4b5a32", "#f4ecdf"))).toBe("6.4:1"); // moss on parchment
  });
});

describe("wcagLevel", () => {
  it("maps ratios to the normal-text levels", () => {
    expect(wcagLevel(14.6)).toBe("AAA");
    expect(wcagLevel(7)).toBe("AAA");
    expect(wcagLevel(6.99)).toBe("AA");
    expect(wcagLevel(4.5)).toBe("AA");
    expect(wcagLevel(4.49)).toBe("AA large");
    expect(wcagLevel(3)).toBe("AA large");
    expect(wcagLevel(2.9)).toBe("Decorative");
  });
});

describe("formatRatio", () => {
  it("rounds to one decimal", () => {
    expect(formatRatio(14.64)).toBe("14.6:1");
    expect(formatRatio(7.16)).toBe("7.2:1");
    expect(formatRatio(21)).toBe("21.0:1");
  });

  it("never rounds a failing ratio up to a passing threshold", () => {
    expect(formatRatio(4.46)).toBe("4.4:1");
    expect(formatRatio(6.97)).toBe("6.9:1");
    expect(formatRatio(2.96)).toBe("2.9:1");
    expect(formatRatio(4.5)).toBe("4.5:1");
  });
});

describe("bestInk", () => {
  it("picks the ink with the most contrast", () => {
    expect(bestInk("#a4472a", ["#241913", "#fbf7f0"]).ink).toBe("#fbf7f0");
    expect(bestInk("#efa47a", ["#241913", "#fbf7f0"]).ink).toBe("#241913");
    expect(bestInk("#efa47a", ["#241913"]).ratio).toBeCloseTo(contrastRatio("#efa47a", "#241913"), 9);
  });

  it("needs at least one ink", () => {
    expect(() => bestInk("#fff", [])).toThrow();
  });
});
