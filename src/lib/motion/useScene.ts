"use client";

import { useEffect, type DependencyList, type RefObject } from "react";
import { loadMotion, type Motion } from "./gsap";
import { isShowcaseLinear, motionAllowed, whenEngaged, whenIdle } from "./env";

/**
 * Sets up a GSAP scene scoped to `ref` once motion is allowed, the visitor has engaged
 * (first scroll/pointer/key, see whenEngaged) and GSAP has loaded.
 * Everything created inside `setup` (tweens, ScrollTriggers, SplitText) is reverted on
 * unmount through gsap.context(). Return an optional extra cleanup.
 * Reduced motion or showcase "linear" captures: `setup` never runs, so content stays in its
 * static, visible state. If the visitor switches reduced motion on while the page is open,
 * the scene is reverted on the spot (and set up again if they switch it back off).
 */
export function useScene<T extends HTMLElement>(
  ref: RefObject<T | null>,
  setup: (motion: Motion, root: T) => void | (() => void),
  deps: DependencyList = [],
): void {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    let cancelIdle: () => void = () => {};

    // Wait for the visitor's first interaction, then for an idle moment, then load GSAP.
    const start = () => {
      let cancelInner: () => void = () => {};
      const cancelEngaged = whenEngaged(() => {
        cancelInner = whenIdle(run, 400);
      });
      cancelIdle = () => {
        cancelEngaged();
        cancelInner();
      };
    };
    const run = () => {
      if (cancelled || revert || !motionAllowed() || isShowcaseLinear()) return;
      loadMotion().then((motion) => {
        if (cancelled || revert || !motionAllowed()) return;
        let extra: void | (() => void);
        const ctx = motion.gsap.context(() => {
          extra = setup(motion, root);
        }, root);
        revert = () => {
          if (typeof extra === "function") extra();
          ctx.revert();
          motion.ScrollTrigger.refresh();
        };
      });
    };
    const stop = () => {
      cancelIdle();
      revert?.();
      revert = undefined;
    };

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (query.matches) stop();
      else window.setTimeout(start, 50); // let MotionProvider flip html.motion-ok first
    };
    query.addEventListener("change", onChange);
    start();

    return () => {
      cancelled = true;
      query.removeEventListener("change", onChange);
      cancelIdle();
      revert?.();
    };
    // `ref` and `setup` are stable for a scene's lifetime; callers re-run it through `deps`.
  }, deps);
}
