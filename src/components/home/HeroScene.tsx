"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Scene, type SceneSetup } from "@/components/motion/Scene";

/* Hero scroll scrub: the photo pushes in and drifts down, the copy lifts
   away faster, the bag rises and turns. Transforms and opacity only.
   The entrance itself is pure CSS (globals.css › Hero entrance). */
const setup: SceneSetup = ({ gsap }, root) => {
  const trigger = { trigger: root, start: "top top", end: "bottom top", scrub: true } as const;
  gsap.to(root.querySelector("[data-hero-media]"), { scale: 1.12, yPercent: 7, ease: "none", scrollTrigger: trigger });
  gsap.to(root.querySelector("[data-hero-copy]"), { yPercent: -22, opacity: 0.15, ease: "none", scrollTrigger: trigger });
  gsap.to(root.querySelector("[data-hero-bag]"), { y: -150, rotate: 5, ease: "none", scrollTrigger: trigger });
  gsap.to(root.querySelector("[data-hero-cue]"), { opacity: 0, ease: "none", scrollTrigger: { ...trigger, end: "20% top" } });
};

export function HeroScene(props: ComponentPropsWithoutRef<"section">) {
  return <Scene as="section" setup={setup} {...props} />;
}
