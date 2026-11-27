"use client";

import { useEffect, useState, type ReactNode } from "react";
import { whenIdle } from "@/lib/motion/env";

/* ==========================================================================
   Mounts small decorative media (photo pills, avatars, list thumbnails) only
   once the page has loaded and gone idle. Images that sit just below the
   fold then never compete with the hero photo (the LCP element) for the
   first bytes. Until then the slot shows its own background tone; the media
   is decorative (alt=""), so nothing is lost without JS.
   ========================================================================== */

export function AfterLoad({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelIdle = () => {};
    const start = () => {
      cancelIdle = whenIdle(() => setReady(true), 1500);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      cancelIdle();
    };
  }, []);
  return ready ? children : null;
}
