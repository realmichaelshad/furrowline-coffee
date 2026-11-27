"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Scene, type SceneSetup } from "@/components/motion/Scene";

/* The three tasting notes drift in from alternating sides as the section
   scrolls up (scrubbed, transform only), so the big type settles into its
   staircase just as it reaches the middle of the screen. The server markup
   is the settled layout: without JS or with reduced motion nothing moves. */
const setup: SceneSetup = ({ gsap }, root) => {
  const lines = root.querySelectorAll<HTMLElement>("[data-note-line]");
  lines.forEach((line, i) => {
    gsap.fromTo(
      line,
      { x: () => (i % 2 === 0 ? -1 : 1) * Math.min(90, window.innerWidth * 0.06) },
      {
        x: 0,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "top 30%", scrub: 0.7, invalidateOnRefresh: true },
      },
    );
  });
  // The taste meter's dots fill in from the left, but only if it is still below the fold:
  // never flash something the visitor can already see back to empty.
  const taste = root.querySelector<HTMLElement>("[data-taste]");
  if (taste && taste.getBoundingClientRect().top > window.innerHeight) {
    gsap.fromTo(
      taste.querySelectorAll("[data-dot]"),
      { scaleX: 0, transformOrigin: "0% 50%" },
      {
        scaleX: 1,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.035,
        scrollTrigger: { trigger: taste, start: "top 85%", once: true },
      },
    );
  }
};

export function NotesScene(props: ComponentPropsWithoutRef<"div">) {
  return <Scene setup={setup} {...props} />;
}
