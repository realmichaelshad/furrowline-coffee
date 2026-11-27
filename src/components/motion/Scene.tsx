"use client";

import { useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import type { Motion } from "@/lib/motion/gsap";
import { useScene } from "@/lib/motion/useScene";

/* ==========================================================================
   <Scene> lets a server component own the markup while a small client
   wrapper runs the GSAP timeline. Functions can't cross the server/client
   boundary, so each section defines a tiny client wrapper:

     "use client";
     const setup: SceneSetup = ({ gsap }, root) => { ...targets via data-* };
     export function HeroScene(props) { return <Scene setup={setup} {...props} />; }

   and the server component renders <HeroScene>{server markup}</HeroScene>.
   Setup only runs when motion is allowed (see useScene), after idle, and
   everything it creates is reverted on unmount.
   ========================================================================== */

export type SceneSetup = (motion: Motion, root: HTMLElement) => void | (() => void);

export function Scene<T extends ElementType = "div">({
  as,
  setup,
  children,
  ...rest
}: {
  as?: T;
  setup: SceneSetup;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "children">) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  useScene(ref, setup);
  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
