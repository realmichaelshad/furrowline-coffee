"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Scene, type SceneSetup } from "@/components/motion/Scene";
import { isDesktopScene, isShowcaseLinear } from "@/lib/motion/env";

/* ==========================================================================
   Sticky storytelling for "From farm to cup" (desktop, fine pointer, motion
   allowed; useScene already skips reduced motion and showcase captures).
   - data-sticky switches the CSS to the two-column layout with the sticky
     stage (the inline photos step aside).
   - A ScrollTrigger per chapter picks the active chapter as its text crosses
     55% of the viewport. The new chapter's photo wipes in over the old one
     (clip-path, downwards when scrolling back) and settles from a push-in;
     the inset photo follows a beat later; the chapter number and label roll.
   - The furrow on the rail fills with the scroll (clip-path, scrubbed).
   Only clip-path, transform and opacity move. Reverting removes every inline
   style and data-sticky, so the stacked layout comes back as it was.
   ========================================================================== */

const SHOWN = "inset(0% 0% 0% 0%)";
const BELOW = "inset(100% 0% 0% 0%)";
const ABOVE = "inset(0% 0% 100% 0%)";

const setup: SceneSetup = ({ gsap, ScrollTrigger }, root) => {
  if (!isDesktopScene() || isShowcaseLinear()) return;
  const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
  const shots = Array.from(root.querySelectorAll<HTMLElement>("[data-shot]"));
  const insets = Array.from(root.querySelectorAll<HTMLElement>("[data-inset]"));
  const rolls = Array.from(root.querySelectorAll<HTMLElement>("[data-roll]"));
  const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-rail-dot]"));
  const fill = root.querySelector<SVGElement>("[data-rail-fill]");
  const list = root.querySelector<HTMLElement>("[data-chapters]");
  const count = chapters.length;
  if (!list || count < 2 || shots.length !== count || insets.length !== count) return;

  root.dataset.sticky = "";
  ScrollTrigger.refresh();

  let active = -1;
  let layer = 2;

  const show = (index: number, direction: 1 | -1, instant: boolean) => {
    if (index === active) return;
    active = index;
    layer += 1;
    const shot = shots[index]!;
    const inset = insets[index]!;
    const shotMedia = shot.querySelector("[data-shot-media]");
    const insetMedia = inset.querySelector("[data-inset-media]");
    const from = direction > 0 ? BELOW : ABOVE;

    if (instant) {
      gsap.set(shot, { clipPath: SHOWN, zIndex: layer });
      gsap.set(inset, { clipPath: SHOWN, zIndex: layer });
    } else {
      gsap.fromTo(shot, { clipPath: from, zIndex: layer }, { clipPath: SHOWN, duration: 1.1, ease: "power4.inOut", overwrite: true });
      gsap.fromTo(inset, { clipPath: from, zIndex: layer }, { clipPath: SHOWN, duration: 0.95, delay: 0.16, ease: "power4.inOut", overwrite: true });
      if (shotMedia) {
        gsap.fromTo(shotMedia, { scale: 1.2, yPercent: direction * 5 }, { scale: 1, yPercent: 0, duration: 1.7, ease: "expo.out", overwrite: true });
      }
      if (insetMedia) {
        gsap.fromTo(insetMedia, { scale: 1.3 }, { scale: 1, duration: 1.6, delay: 0.16, ease: "expo.out", overwrite: true });
      }
    }

    rolls.forEach((roll) =>
      gsap.to(roll, { yPercent: (-100 * index) / count, duration: instant ? 0 : 0.95, ease: "power4.inOut", overwrite: true }),
    );
    dots.forEach((dot, i) => dot.toggleAttribute("data-on", i <= index));
    chapters.forEach((chapter, i) => chapter.toggleAttribute("data-active", i === index));
  };

  // Start on whichever chapter is at the reading line right now (the page may load mid-section).
  const line = window.innerHeight * 0.55;
  let initial = 0;
  chapters.forEach((chapter, i) => {
    if (chapter.getBoundingClientRect().top <= line) initial = i;
  });
  shots.forEach((shot, i) => i !== initial && gsap.set(shot, { clipPath: BELOW, zIndex: 1 }));
  insets.forEach((inset, i) => i !== initial && gsap.set(inset, { clipPath: BELOW, zIndex: 1 }));
  show(initial, 1, true);

  chapters.forEach((chapter, i) => {
    ScrollTrigger.create({
      trigger: chapter,
      start: "top 55%",
      end: "bottom 55%",
      onEnter: () => show(i, 1, false),
      onEnterBack: () => show(i, -1, false),
    });
  });

  if (fill) {
    gsap.fromTo(
      fill,
      { clipPath: "inset(0% 0% 100% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: list, start: "top 55%", end: "bottom 55%", scrub: 0.5 },
      },
    );
  }

  return () => {
    delete root.dataset.sticky;
    dots.forEach((dot) => dot.removeAttribute("data-on"));
    chapters.forEach((chapter) => chapter.removeAttribute("data-active"));
  };
};

export function FarmToCupScene(props: ComponentPropsWithoutRef<"div">) {
  return <Scene setup={setup} {...props} />;
}
