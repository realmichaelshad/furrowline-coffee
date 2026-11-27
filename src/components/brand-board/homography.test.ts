import { describe, expect, it } from "vitest";
import { applyHomography, quadTransform, rectToQuad, type Quad } from "@/components/brand-board/homography";

function expectPoint(actual: [number, number], expected: readonly [number, number]) {
  expect(actual[0]).toBeCloseTo(expected[0], 6);
  expect(actual[1]).toBeCloseTo(expected[1], 6);
}

describe("rectToQuad", () => {
  it("maps each corner of the rectangle onto the quad (perspective case)", () => {
    // The storefront fascia: slightly shorter on the right, sloping down.
    const quad: Quad = [
      [570, 230],
      [902, 250],
      [902, 362],
      [570, 345],
    ];
    const m = rectToQuad(400, 120, quad);
    expectPoint(applyHomography(m, [0, 0]), quad[0]);
    expectPoint(applyHomography(m, [400, 0]), quad[1]);
    expectPoint(applyHomography(m, [400, 120]), quad[2]);
    expectPoint(applyHomography(m, [0, 120]), quad[3]);
  });

  it("is a plain scale and translate for an axis-aligned rectangle", () => {
    const m = rectToQuad(100, 50, [
      [10, 20],
      [210, 20],
      [210, 120],
      [10, 120],
    ]);
    expect(m[6]).toBeCloseTo(0, 12);
    expect(m[7]).toBeCloseTo(0, 12);
    expectPoint(applyHomography(m, [50, 25]), [110, 70]);
  });

  it("keeps straight lines straight (the centre lands on the diagonals' crossing)", () => {
    const quad: Quad = [
      [0, 0],
      [300, 30],
      [280, 200],
      [10, 180],
    ];
    const m = rectToQuad(300, 200, quad);
    const centre = applyHomography(m, [150, 100]);
    // Intersection of the quad's diagonals.
    const [p0, p1, p2, p3] = quad;
    const d1 = [p2[0] - p0[0], p2[1] - p0[1]] as const;
    const d2 = [p3[0] - p1[0], p3[1] - p1[1]] as const;
    const t = ((p1[0] - p0[0]) * d2[1] - (p1[1] - p0[1]) * d2[0]) / (d1[0] * d2[1] - d1[1] * d2[0]);
    expectPoint(centre, [p0[0] + t * d1[0], p0[1] + t * d1[1]]);
  });

  it("rejects an empty rectangle and a collapsed quad", () => {
    expect(() => rectToQuad(0, 10, [[0, 0], [1, 0], [1, 1], [0, 1]])).toThrow();
    expect(() =>
      rectToQuad(10, 10, [
        [0, 0],
        [0, 0],
        [5, 5],
        [0, 0],
      ]),
    ).toThrow();
  });
});

describe("quadTransform", () => {
  it("writes a column-major matrix3d", () => {
    const css = quadTransform(100, 50, [
      [10, 20],
      [210, 20],
      [210, 120],
      [10, 120],
    ]);
    expect(css).toBe("matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 10, 20, 0, 1)");
  });
});
