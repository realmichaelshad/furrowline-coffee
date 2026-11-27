"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Scene, type SceneSetup } from "@/components/motion/Scene";

/* The furrow line fills with the scroll (scaleY, scrubbed) and each step's
   marker switches on as the line reaches it. Server markup is the finished
   state (line drawn, markers on), so reduced motion and no-JS see it all. */
const setup: SceneSetup = ({ gsap }, root) => {
  const fill = root.querySelector<HTMLElement>("[data-steps-fill]");
  const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
  const line = fill?.parentElement;
  if (!fill || !line || steps.length === 0) return;

  // Where each marker sits along the line, as a fraction of the line's height.
  const stops = () => {
    const box = line.getBoundingClientRect();
    return steps.map((step) => {
      const marker = step.querySelector<HTMLElement>(".ws-step-marker") ?? step;
      const r = marker.getBoundingClientRect();
      return (r.top + r.height / 2 - box.top) / Math.max(1, box.height);
    });
  };
  let marks = stops();
  const light = (progress: number) => {
    steps.forEach((step, i) => step.toggleAttribute("data-dim", progress + 0.001 < (marks[i] ?? 0)));
  };

  const tween = gsap.fromTo(
    fill,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        // The line itself, so the tip of the fill sits on the 65% reading line.
        trigger: line,
        start: "top 65%",
        end: "bottom 65%",
        scrub: 0.6,
        onRefresh: () => (marks = stops()),
        onUpdate: (self) => light(self.progress),
      },
    },
  );
  light(tween.scrollTrigger?.progress ?? 0);

  return () => steps.forEach((step) => step.removeAttribute("data-dim"));
};

export function StepsScene(props: ComponentPropsWithoutRef<"div">) {
  return <Scene setup={setup} {...props} />;
}
