"use client";

import { cn } from "@/lib/cn";
import { useOpenStatus } from "./useOpenStatus";

/* "Open now · closes at 4 pm" with a live dot (moss when open, clay when
   closed). Rendered after mount; until then the pill keeps its place with an
   invisible placeholder of the same height, so nothing shifts. */
export function OpenNowPill({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const status = useOpenStatus();
  const state = status ? (status.open ? "open" : "closed") : "pending";
  return (
    <p className={cn("open-pill", className)} data-state={state} data-tone={tone} aria-hidden={status ? undefined : true}>
      <span className="open-pill-dot" aria-hidden="true" />
      <span className="open-pill-text">{status?.label ?? "Open now · closes at 4 pm"}</span>
    </p>
  );
}
