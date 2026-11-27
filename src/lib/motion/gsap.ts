import { getLenis, onLenis } from "./lenis";

/* ==========================================================================
   Lazy GSAP loader. GSAP, ScrollTrigger and SplitText are never in the
   initial bundle: scenes call loadMotion() after hydration, and the first
   call downloads them once. ScrollTrigger is wired to Lenis on load.
   ========================================================================== */

export type GsapModule = typeof import("gsap").gsap;
export type ScrollTriggerModule = typeof import("gsap/ScrollTrigger").ScrollTrigger;
export type SplitTextModule = typeof import("gsap/SplitText").SplitText;

export interface Motion {
  gsap: GsapModule;
  ScrollTrigger: ScrollTriggerModule;
  SplitText: SplitTextModule;
}

let pending: Promise<Motion> | null = null;

export function loadMotion(): Promise<Motion> {
  if (pending) return pending;
  pending = Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/SplitText")]).then(
    ([g, st, sp]) => {
      const gsap = g.gsap;
      const ScrollTrigger = st.ScrollTrigger;
      const SplitText = sp.SplitText;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      gsap.defaults({ ease: "power3.out", duration: 1 });
      ScrollTrigger.config({ ignoreMobileResize: true });

      // Keep ScrollTrigger in step with Lenis' smoothed scroll position.
      let detach: (() => void) | null = null;
      onLenis((lenis) => {
        detach?.();
        detach = null;
        if (!lenis) return;
        const update = () => ScrollTrigger.update();
        lenis.on("scroll", update);
        detach = () => lenis.off("scroll", update);
      });
      if (!getLenis()) ScrollTrigger.refresh();

      // Web fonts change line lengths: re-measure once they are in.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return { gsap, ScrollTrigger, SplitText };
    },
  );
  return pending;
}
