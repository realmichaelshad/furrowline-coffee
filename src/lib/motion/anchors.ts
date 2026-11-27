import { elementTop, getLenis } from "./lenis";
import { motionAllowed } from "./env";

/* ==========================================================================
   In-page jumps that land, and stay landed, on their target: same-page
   #hash links (handled here instead of by Lenis or the router) and arriving
   on a page with a hash (/#find-your-coffee from the footer, the cart, the
   404).

   The page can change height after a jump starts. On the home page the
   pinned showcase adds its whole slide distance when its scene starts, and
   that happens on the first interaction, which is often the click on the
   link itself. Deferred sections also render at their real size as they
   come close. So a jump is "held": every layout change re-aims the scroll
   at the target (smoothly while still on the way, instantly once there,
   before paint so nothing visibly jumps) until the visitor scrolls, taps or
   types, or the layout has been quiet for a moment.

   On landing, focus moves to the target, as a native anchor jump moves the
   tab starting point: the next Tab continues from the section the visitor
   jumped to, and screen readers announce it.
   ========================================================================== */

/** Layout quiet for this long after landing: the jump is done. */
const QUIET_MS = 1400;
/** Hold at least this long, so scenes that start a beat later are still caught. */
const MIN_HOLD_MS = 3200;
/** Never hold longer than this. */
const MAX_HOLD_MS = 9000;
/** The visitor taking over ends the hold at once. */
const TAKEOVER = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

let release: (() => void) | null = null;

/** The element a hash names, if it is on this page. */
export function hashTarget(hash: string): HTMLElement | null {
  if (!hash || hash === "#") return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

/** Where the scroll has to be for `el` to sit just under the fixed header (html scroll-padding-top). */
function targetY(el: Element): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.round(Math.max(0, Math.min(max, elementTop(el))));
}

function focusTarget(el: HTMLElement): void {
  // Sections are not focusable on their own: make this one focusable until focus leaves it.
  if (el.tabIndex < 0 && !el.hasAttribute("tabindex")) {
    el.setAttribute("tabindex", "-1");
    el.dataset.anchorFocus = "";
    el.addEventListener(
      "blur",
      () => {
        el.removeAttribute("tabindex");
        delete el.dataset.anchorFocus;
      },
      { once: true },
    );
  }
  el.focus({ preventScroll: true });
}

/** Ends the current hold, if any (the visitor took over, or a new jump started). */
export function releaseAnchor(): void {
  release?.();
}

/**
 * Scrolls to `el` and keeps it there while the layout settles.
 * `smooth`: glide there (motion allowed); otherwise jump (reduced motion,
 * or a page that already arrived at its hash).
 */
export function holdAnchor(el: HTMLElement, { smooth = motionAllowed(), focus = true } = {}): void {
  release?.();
  const started = performance.now();
  let aimed = Number.NaN;
  let landed = false;
  let quietSince = started;
  let lastScroll = Number.NaN;
  let stillFrames = 0;
  let raf = 0;

  const aim = (y: number, immediate: boolean) => {
    aimed = y;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { immediate, force: true });
    else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
  };

  const check = () => {
    // A drawer or the menu is still open or closing: scroll is locked and focus will return to its
    // opener. Start once it has gone.
    if (document.querySelector("dialog[open]")) return;
    const now = performance.now();
    const y = targetY(el);
    const scroll = window.scrollY;
    if (Number.isNaN(aimed)) {
      aim(y, !smooth);
    } else if (Math.abs(y - aimed) > 1) {
      // The layout moved the target: follow it.
      quietSince = now;
      aim(y, landed || !smooth);
    } else if (landed && Math.abs(scroll - aimed) > 2) {
      // Something else moved the page (a ScrollTrigger refresh restoring its own position): put it back.
      quietSince = now;
      aim(y, true);
    }

    // Landed once the scroll has stopped on the target. If it stopped short (a smooth scroll that was
    // cut off when a drawer unlocked the page), aim again.
    stillFrames = Math.abs(scroll - lastScroll) < 1 ? stillFrames + 1 : 0;
    lastScroll = scroll;
    if (!landed && stillFrames >= 3) {
      if (Math.abs(scroll - aimed) <= 2) {
        landed = true;
        quietSince = now;
        if (focus) focusTarget(el);
      } else {
        aim(aimed, !smooth);
        stillFrames = 0;
      }
    }

    if (now - started > MAX_HOLD_MS || (landed && now - quietSince > QUIET_MS && now - started > MIN_HOLD_MS)) {
      stop();
    }
  };

  const loop = () => {
    check();
    if (release === stop) raf = requestAnimationFrame(loop);
  };

  // Layout changes are seen here after layout and before paint, so a correction never shows a jump.
  const resize = new ResizeObserver(() => {
    if (release === stop) check();
  });

  const takeover = () => {
    // Make sure focus still follows when the visitor takes over mid-glide.
    if (!landed && focus) focusTarget(el);
    stop();
  };

  function stop() {
    cancelAnimationFrame(raf);
    resize.disconnect();
    TAKEOVER.forEach((type) => window.removeEventListener(type, takeover, true));
    if (release === stop) release = null;
  }

  release = stop;
  TAKEOVER.forEach((type) => window.addEventListener(type, takeover, { capture: true, passive: true }));
  resize.observe(document.body);
  raf = requestAnimationFrame(loop);
}

/**
 * Same-page hash links: glide to the target and hold it (see holdAnchor).
 * Links can opt out with data-scroll="manual" when they handle the jump
 * themselves. Runs in the capture phase on window, ahead of the router's
 * own link handling, which then sees the event as handled.
 */
export function onAnchorClick(event: MouseEvent): void {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return;
  if (link.hasAttribute("download") || (link.target && link.target !== "_self") || link.dataset.scroll === "manual") return;
  const url = new URL(link.href, window.location.href);
  const here = window.location;
  if (url.origin !== here.origin || url.pathname !== here.pathname || url.search !== here.search) return;
  const el = hashTarget(url.hash);
  if (!el) return;
  event.preventDefault();
  if (url.hash !== here.hash) window.history.pushState(null, "", url.hash);
  holdAnchor(el);
}
