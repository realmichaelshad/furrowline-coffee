/* ==========================================================================
   Add-to-cart flight: a clone of the product art arcs from where it was
   added into the header cart icon, shrinking and spinning a little.
   Web Animations API, transform + opacity only. Resolves when it lands.
   ========================================================================== */

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** The visible cart button (desktop and mobile headers each have one). */
export function findCartTarget(): HTMLElement | null {
  const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-target]"));
  return targets.find((el) => el.getClientRects().length > 0 && el.getBoundingClientRect().width > 0) ?? null;
}

/**
 * Where `el` will be once the header it sits in has finished sliding into view: its rect minus the
 * header's current translate (the header hides with transform: translateY(-100%)).
 */
function restingRect(el: Element): DOMRect {
  const r = el.getBoundingClientRect();
  const header = el.closest<HTMLElement>(".site-header");
  if (!header) return r;
  const transform = getComputedStyle(header).transform;
  if (!transform || transform === "none") return r;
  try {
    const m = new DOMMatrixReadOnly(transform);
    return new DOMRect(r.x - m.m41, r.y - m.m42, r.width, r.height);
  } catch {
    return r;
  }
}

export function flyToCart(source: Element, target: Element): Promise<void> {
  const s = source.getBoundingClientRect();
  const t = restingRect(target);
  if (s.width === 0 || s.height === 0 || s.bottom < 0 || s.top > window.innerHeight) return Promise.resolve();

  const wrap = document.createElement("div");
  wrap.setAttribute("aria-hidden", "true");
  Object.assign(wrap.style, {
    position: "fixed",
    left: `${s.left}px`,
    top: `${s.top}px`,
    width: `${s.width}px`,
    height: `${s.height}px`,
    zIndex: "95",
    pointerEvents: "none",
    willChange: "transform, opacity",
  });
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.style.width = "100%";
  clone.style.height = "100%";
  clone.style.transform = "none";
  wrap.appendChild(clone);
  document.body.appendChild(wrap);

  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);
  const endScale = Math.max(0.05, 26 / Math.max(s.height, 1));
  // Quadratic Bézier with a control point lifted above both ends.
  const cx = dx * 0.25;
  const cy = Math.min(0, dy) - Math.min(220, 120 + s.height * 0.3);
  const steps = 12;
  const frames: Keyframe[] = [];
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    const u = 1 - p;
    const x = 2 * u * p * cx + p * p * dx;
    const y = 2 * u * p * cy + p * p * dy;
    const k = easeInOut(p);
    const scale = 1 + (endScale - 1) * k;
    const rotate = -14 * Math.sin(p * Math.PI) + 10 * p;
    frames.push({
      offset: easeInOut(p * 0.9 + 0.1 * p * p),
      transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(1)}deg)`,
      opacity: p > 0.9 ? 1 - (p - 0.9) * 6 : 1,
    });
  }
  frames[0]!.offset = 0;
  frames[frames.length - 1]!.offset = 1;
  const animation = wrap.animate(frames, { duration: 860, easing: "linear", fill: "forwards" });
  return animation.finished.then(
    () => wrap.remove(),
    () => wrap.remove(),
  );
}
