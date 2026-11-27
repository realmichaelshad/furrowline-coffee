/* Client-side environment checks for the motion system. Safe to call during SSR (returns the conservative answer). */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Mouse or trackpad: hover effects, magnetic buttons, cursor bubble. */
export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Wide viewport with a fine pointer: the pinned/horizontal scenes run here. */
export function isDesktopScene(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 64rem) and (hover: hover) and (pointer: fine)").matches;
}

export function prefersSaveData(): boolean {
  if (typeof navigator === "undefined") return true;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

/**
 * Showcase captures open a page with ?showcase=linear (MotionProvider copies it to
 * html[data-showcase]): scroll scenes and reveals stay off, pinned sections lay out
 * linearly, so full-page screenshots show every section in its finished state.
 */
export function isShowcaseLinear(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.showcase === "linear";
}

/** True when decorative motion may run. Reads the class MotionProvider sets on <html>. */
export function motionAllowed(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("motion-ok");
}

/** Runs `fn` when the browser is idle (or after `timeout` ms). Returns a cancel function. */
export function whenIdle(fn: () => void, timeout = 1200): () => void {
  if (typeof window === "undefined") return () => {};
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
}

/* ------------------------------------------------------------------------
   Engagement gate. Smooth scroll and the GSAP scenes are only downloaded and
   started once the visitor shows intent (scroll, wheel, touch, pointer move,
   key press). First paint, LCP and the main thread at load stay free of
   motion code; by the time anyone reaches a scroll scene it is ready.
   ------------------------------------------------------------------------ */

const ENGAGE_EVENTS = ["scroll", "wheel", "touchstart", "pointerdown", "pointermove", "keydown"] as const;
let engaged = false;
const waiting = new Set<() => void>();

function engage() {
  if (engaged) return;
  engaged = true;
  ENGAGE_EVENTS.forEach((type) => window.removeEventListener(type, engage, true));
  const queue = [...waiting];
  waiting.clear();
  queue.forEach((fn) => fn());
}

/**
 * Treats the visitor as engaged right away. Used when a page opens on a #hash: the scenes (and the
 * pinned showcase's extra scroll length) should be in place while the jump is held, not appear
 * under the visitor's first scroll.
 */
export function engageNow(): void {
  if (typeof window !== "undefined") engage();
}

/** Runs `fn` after the first sign of user intent (immediately if that already happened). */
export function whenEngaged(fn: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (engaged) {
    const id = window.setTimeout(fn, 0);
    return () => window.clearTimeout(id);
  }
  if (waiting.size === 0) {
    ENGAGE_EVENTS.forEach((type) => window.addEventListener(type, engage, { capture: true, passive: true }));
  }
  waiting.add(fn);
  return () => waiting.delete(fn);
}
