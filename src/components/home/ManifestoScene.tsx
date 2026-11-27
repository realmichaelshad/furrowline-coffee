"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Scene, type SceneSetup } from "@/components/motion/Scene";

/* Words brighten one after another as the statement scrolls through the
   viewport; photo pills open from their centre. Opacity + clip-path only. */
const setup: SceneSetup = ({ gsap }, root) => {
  const trigger = { trigger: root, start: "top 80%", end: "bottom 55%", scrub: 0.6 } as const;
  const tl = gsap.timeline({ scrollTrigger: trigger, defaults: { ease: "none" } });
  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-w], [data-pill]"));
  items.forEach((el, i) => {
    const at = i * 0.12;
    if (el.hasAttribute("data-pill")) {
      tl.fromTo(el, { clipPath: "inset(0% 50% 0% 50% round 999px)" }, { clipPath: "inset(0% 0% 0% 0% round 999px)", duration: 0.5 }, at);
      const inner = el.querySelector("[data-pill-inner]");
      if (inner) tl.fromTo(inner, { scale: 1.35 }, { scale: 1, duration: 0.6 }, at);
    } else {
      tl.fromTo(el, { opacity: 0.14 }, { opacity: 1, duration: 0.3 }, at);
    }
  });
};

export function ManifestoScene(props: ComponentPropsWithoutRef<"div">) {
  return <Scene setup={setup} {...props} />;
}
