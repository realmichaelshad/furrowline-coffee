import { useId } from "react";
import { MARK_BOX, MARK_D } from "./mark-data";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Circular roast stamp: text set on a circle around the bean mark. Used on
   photos, packaging mockups and the brand board. `spin` turns it slowly
   (CSS, stops under reduced motion). Decorative: aria-hidden.
   ========================================================================== */

export function Stamp({
  text = "Small batch · Roasted Tuesday & Friday · Alder Bend · ",
  className,
  color = "currentColor",
  markColor,
  disc,
  spin = false,
}: {
  text?: string;
  className?: string;
  color?: string;
  markColor?: string;
  /** Background disc colour, if any. */
  disc?: string;
  spin?: boolean;
}) {
  const id = `stamp${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const markH = 34;
  const s = markH / MARK_BOX.height;
  return (
    <svg viewBox="0 0 160 160" className={cn("block", className)} aria-hidden="true" focusable="false">
      {disc && <circle cx="80" cy="80" r="78" fill={disc} />}
      <defs>
        <path id={id} d="M80 80m-58 0a58 58 0 1 1 116 0a58 58 0 1 1 -116 0" />
      </defs>
      <g className={spin ? "stamp-spin" : undefined}>
        <text fill={color} style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.28em" }}>
          <textPath href={`#${id}`} textLength={364} lengthAdjust="spacing">
            {text.toUpperCase()}
          </textPath>
        </text>
      </g>
      <circle cx="80" cy="80" r="42" fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="1" />
      <path
        d={MARK_D}
        fill={markColor ?? color}
        transform={`translate(${80 - (MARK_BOX.width * s) / 2} ${80 - markH / 2}) scale(${s}) translate(${-MARK_BOX.x} ${-MARK_BOX.y})`}
      />
    </svg>
  );
}
