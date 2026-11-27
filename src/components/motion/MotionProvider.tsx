"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { setLenis, getLenis } from "@/lib/motion/lenis";
import { engageNow, whenEngaged, whenIdle } from "@/lib/motion/env";
import { hashTarget, holdAnchor, onAnchorClick, releaseAnchor } from "@/lib/motion/anchors";

/* ==========================================================================
   Sets html.motion-ok / html.motion-reduced and starts Lenis smooth scroll
   on the visitor's first interaction (see whenEngaged). Under
   prefers-reduced-motion nothing starts and scrolling stays native.
   Also owns in-page jumps (src/lib/motion/anchors.ts): same-page #hash
   links, and pages opened or navigated to with a #hash, land on their
   target and stay there while the layout settles. Rendered once in the
   root layout.
   ========================================================================== */

export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    const markLoaded = () => whenIdle(() => html.classList.add("is-loaded"), 2000);
    if (document.readyState === "complete") markLoaded();
    else window.addEventListener("load", markLoaded, { once: true });
    const showcase = new URLSearchParams(window.location.search).get("showcase");
    if (showcase) html.dataset.showcase = showcase;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let destroyed = false;
    let cancelIdle: () => void = () => {};

    const start = () => {
      html.classList.add("motion-ok");
      html.classList.remove("motion-reduced");
      // Smooth scroll loads on the visitor's first scroll/pointer/key, never during page load.
      let cancelInner: () => void = () => {};
      const cancelEngaged = whenEngaged(() => {
        cancelInner = whenIdle(() => {
          if (destroyed || getLenis()) return;
          import("lenis").then(({ default: Lenis }) => {
            if (destroyed || query.matches) return;
            // Anchor links are handled by onAnchorClick (it follows layout changes), not by Lenis.
            const lenis = new Lenis({ autoRaf: true, lerp: 0.105, wheelMultiplier: 1 });
            setLenis(lenis);
          });
        }, 300);
      });
      cancelIdle = () => {
        cancelEngaged();
        cancelInner();
      };
    };

    const stop = () => {
      cancelIdle();
      html.classList.remove("motion-ok");
      html.classList.add("motion-reduced");
      getLenis()?.destroy();
      setLenis(null);
    };

    if (query.matches) stop();
    else start();

    const onChange = () => (query.matches ? stop() : start());
    query.addEventListener("change", onChange);

    window.addEventListener("click", onAnchorClick, true);
    // Opened on a #hash: set the scenes up now and hold the target while they do.
    const initial = hashTarget(window.location.hash);
    if (initial) {
      engageNow();
      holdAnchor(initial, { smooth: false });
    }

    return () => {
      destroyed = true;
      query.removeEventListener("change", onChange);
      window.removeEventListener("click", onAnchorClick, true);
      releaseAnchor();
      cancelIdle();
      getLenis()?.destroy();
      setLenis(null);
    };
  }, []);

  // New page: jump to the top without smoothing, or to the #hash it was opened on (and hold it there).
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    document.documentElement.classList.add("has-navigated");
    releaseAnchor();
    const target = hashTarget(window.location.hash);
    if (target) {
      holdAnchor(target, { smooth: false });
      return;
    }
    getLenis()?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
