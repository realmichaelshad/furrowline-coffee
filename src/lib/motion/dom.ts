/* ==========================================================================
   One shared MutationObserver for the attribute-driven scanners in
   InteractionLayer (lazy textures, reveals, parallax). DOM changes anywhere
   (a cart update, the shop's FLIP grid, a drawer) are batched into a single
   callback per animation frame, and every subscriber re-scans once.
   ========================================================================== */

const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;
let frame = 0;

function flush() {
  frame = 0;
  listeners.forEach((fn) => fn());
}

/** Calls `fn` (at most once per frame) after nodes are added to or removed from the page. */
export function onDomChange(fn: () => void): () => void {
  listeners.add(fn);
  if (!observer) {
    observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(flush);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  return () => {
    listeners.delete(fn);
    if (listeners.size > 0) return;
    observer?.disconnect();
    observer = null;
    cancelAnimationFrame(frame);
    frame = 0;
  };
}
