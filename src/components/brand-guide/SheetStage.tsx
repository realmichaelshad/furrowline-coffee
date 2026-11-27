import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import "./sheet-stage.css";

/* ==========================================================================
   <SheetStage> shows a fixed-size composition (the 1280 × 769 brand sheets,
   or a single mockup tile) at 1:1 when there is room and scales it down to
   the available width otherwise. CSS only: the stage reserves the scaled
   height with aspect-ratio (no layout shift), and the inner wrapper scales
   by stage width / natural width (tan(atan2()) turns that length ratio
   into a number). See sheet-stage.css for how the stage width is found.
   The composition itself is never transformed, so an element screenshot of
   it at a desktop width is exactly its own size.
   - fit="page": the brand sheets. Page gutters below ~1312 px, 1:1 above.
   - fit="container": up to `maxWidth` (defaults to the natural width; set
     it higher to enlarge a vector mockup) within --avail, which a parent
     column sets when it is narrower than the page.
   ========================================================================== */

export function SheetStage({
  width,
  height,
  fit = "container",
  maxWidth = width,
  className,
  children,
}: {
  width: number;
  height: number;
  fit?: "page" | "container";
  /** Largest on-screen width in px (container fit). */
  maxWidth?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("sheet-frame", className)}
      data-fit={fit}
      style={
        { "--sheet-w": `${width}px`, "--sheet-max": `${maxWidth}px`, "--sheet-ratio": `${width} / ${height}` } as CSSProperties
      }
    >
      <div className="sheet-stage">
        <div className="sheet-scale">{children}</div>
      </div>
    </div>
  );
}
