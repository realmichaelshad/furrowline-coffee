"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, prefersSaveData, whenIdle } from "@/lib/motion/env";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Optional hero loop (public/video/hero-loop.mp4). Only rendered when the
   file exists at build time. The hero photo is the LCP element and stays
   underneath; the video mounts after the page is idle, and fades in once
   it can actually play. Never for reduced motion or Save-Data users.
   ========================================================================== */

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || prefersSaveData()) return;
    return whenIdle(() => setMount(true), 2500);
  }, []);

  useEffect(() => {
    if (!mount) return;
    ref.current?.play().catch(() => setMount(false));
  }, [mount]);

  if (!mount) return null;
  return (
    <video
      ref={ref}
      className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}
      style={{ objectPosition: "64% 46%" }}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
    />
  );
}
