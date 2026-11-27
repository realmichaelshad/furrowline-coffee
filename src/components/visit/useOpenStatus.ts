"use client";

import { useEffect, useState } from "react";
import { CAFE_TIME_ZONE, HOURS } from "@/content/visit";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";

/**
 * The café's open/closed status, computed in the browser after mount (the page
 * is static, so the server can't know the visitor's "now") and refreshed on
 * every minute boundary. Null until mounted: render a reserved placeholder.
 */
export function useOpenStatus(): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      setStatus(getOpenStatus(new Date(), HOURS, CAFE_TIME_ZONE));
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50);
    };
    tick();
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      window.clearTimeout(timer);
      tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return status;
}
