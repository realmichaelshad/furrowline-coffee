import { MAX_QTY } from "@/content/site";

/**
 * Whole quantities between `min` and MAX_QTY; anything unreadable becomes 1. The cart allows 0
 * (setting a line to 0 removes it); product pages start at 1.
 */
export function clampQty(qty: number, min = 0): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(MAX_QTY, Math.max(min, Math.floor(qty)));
}
