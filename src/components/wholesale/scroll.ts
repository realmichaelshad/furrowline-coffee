import { scrollToTarget } from "@/lib/motion/lenis";

/** Scrolls so `el` sits just under the fixed header, plus `gap` px. */
export function scrollToElement(el: Element, gap = 24): void {
  scrollToTarget(el, { offset: -gap });
}
