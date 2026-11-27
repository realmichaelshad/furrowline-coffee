"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Scene, type SceneSetup } from "@/components/motion/Scene";

/* The route draws itself while the map crosses the viewport (scrubbed
   stroke-dashoffset on pathLength=1 paths), origin labels open from their
   dots (clip-path), and the counters count up once. Server markup is the
   finished state, so without JS or with reduced motion it's all there. */
const setup: SceneSetup = ({ gsap }, root) => {
  const map = root.querySelector<HTMLElement>("[data-route-map]");
  if (map) {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      // Ends while the whole map is still on screen, so the line arriving home is seen.
      scrollTrigger: { trigger: map, start: "top 80%", end: "bottom 92%", scrub: 0.8 },
    });
    const lines = map.querySelectorAll("[data-route]");
    lines.forEach((path, i) => {
      tl.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1 }, i * 0.06);
    });
    const dots = map.querySelectorAll("[data-route-dot]");
    tl.fromTo(dots, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.15, stagger: 0.05, ease: "back.out(2)" }, 0);
    const labels = map.querySelectorAll<HTMLElement>("[data-route-label]");
    labels.forEach((label, i) => {
      const home = label.classList.contains("route-label-home");
      tl.fromTo(
        label,
        { clipPath: "circle(0% at 0% 50%)", opacity: 0 },
        { clipPath: "circle(150% at 0% 50%)", opacity: 1, duration: 0.25 },
        home ? 1.05 : 0.08 + i * 0.12,
      );
    });
    const home = map.querySelector("[data-route-home]");
    if (home) tl.fromTo(home, { scale: 0.2, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.2, ease: "back.out(3)" }, 1.02);
  }

  root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    // Only count numbers that are still below the fold; never flash a visible one back to 0.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const end = Number(el.dataset.count ?? 0);
    const state = { v: 0 };
    el.textContent = "0";
    gsap.to(state, {
      v: end,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => (el.textContent = String(Math.round(state.v))),
      onComplete: () => (el.textContent = String(end)),
    });
  });
  return () => root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => (el.textContent = el.dataset.count ?? ""));
};

export function RouteScene(props: ComponentPropsWithoutRef<"div">) {
  return <Scene setup={setup} {...props} />;
}
