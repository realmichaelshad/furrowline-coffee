import type { ReactNode } from "react";
import type { PhotoAspect } from "@/content/photos";

/* Shared wrapper for illustrated photo fallbacks: fills its box, crops to cover. */

export const FRAME_SIZE: Record<PhotoAspect, [number, number]> = {
  "3:2": [1200, 800],
  "2:3": [800, 1200],
  "1:1": [1000, 1000],
};

export function Frame({
  aspect,
  label,
  position,
  children,
}: {
  aspect: PhotoAspect;
  label: string;
  position?: string;
  children: ReactNode;
}) {
  const [w, h] = FRAME_SIZE[aspect];
  const [px = "50%", py = "50%"] = (position ?? "50% 50%").split(" ");
  const ax = parseFloat(px) < 34 ? "xMin" : parseFloat(px) > 66 ? "xMax" : "xMid";
  const ay = parseFloat(py) < 34 ? "YMin" : parseFloat(py) > 66 ? "YMax" : "YMid";
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio={`${ax}${ay} slice`}
      className="absolute inset-0 h-full w-full"
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {children}
    </svg>
  );
}

export interface FallbackProps {
  label: string;
  position?: string;
}
