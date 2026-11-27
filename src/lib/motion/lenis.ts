import type Lenis from "lenis";

/* Module-level handle on the single Lenis instance (created by MotionProvider). */

let instance: Lenis | null = null;
const listeners = new Set<(lenis: Lenis | null) => void>();

export function getLenis(): Lenis | null {
  return instance;
}

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
  listeners.forEach((fn) => fn(lenis));
}

/** Calls `fn` now (if Lenis exists) and whenever Lenis is created or destroyed. */
export function onLenis(fn: (lenis: Lenis | null) => void): () => void {
  listeners.add(fn);
  if (instance) fn(instance);
  return () => listeners.delete(fn);
}

let locks = 0;

/** Locks page scroll (drawers, menus). Nested calls are counted. */
export function lockScroll(): void {
  locks += 1;
  if (locks > 1) return;
  instance?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll(): void {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  document.documentElement.style.overflow = "";
  instance?.start();
}

/**
 * Scrolls to a y position or element, smoothly when Lenis runs.
 * Elements are resolved to a number from the real scroll position (Lenis' own
 * smoothed value can lag after the page height changes) and land below the
 * fixed header: html scroll-padding-top is applied exactly once, then `offset`.
 */
export function scrollToTarget(target: number | Element, opts: { immediate?: boolean; offset?: number } = {}): void {
  const top = typeof target === "number" ? target + (opts.offset ?? 0) : elementTop(target) + (opts.offset ?? 0);
  const y = Math.max(0, Math.round(top));
  if (instance) {
    instance.scrollTo(y, { immediate: opts.immediate, force: true });
    return;
  }
  window.scrollTo({ top: y, behavior: "auto" });
}

/** The room the fixed header takes at the top: html scroll-padding-top (header height + a little air). */
export function headerOffset(): number {
  return Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
}

/** The scroll position that puts `el` just under the fixed header. */
export function elementTop(el: Element): number {
  return el.getBoundingClientRect().top + window.scrollY - headerOffset();
}
