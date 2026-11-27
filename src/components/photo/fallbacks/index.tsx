import type { ReactNode } from "react";
import { PHOTOS, type PhotoSlot } from "@/content/photos";
import { Contours } from "@/components/illustration/primitives";
import { MARK_BOX, MARK_D } from "@/components/brand/mark-data";
import { BeansRoasting } from "./BeansRoasting";
import { CherriesFallback } from "./Cherries";
import { Frame, FRAME_SIZE, type FallbackProps } from "./Frame";
import { HeroPour } from "./HeroPour";
import { LatteFallback } from "./Latte";
import { OriginColombia, OriginEthiopia, OriginGuatemala } from "./Origins";
import { Roastery } from "./Roastery";

/* ==========================================================================
   Safety net only: every slot has an image in public/photos. If a file
   goes missing, the slot renders one of these instead of a broken image.
   Slots without a bespoke scene get a toned contour plate with the mark.
   ========================================================================== */

const BESPOKE: Partial<Record<PhotoSlot, (p: FallbackProps) => ReactNode>> = {
  "hero-pour": HeroPour,
  roastery: Roastery,
  "beans-roasting": BeansRoasting,
  "origin-ethiopia": OriginEthiopia,
  "origin-colombia": OriginColombia,
  "origin-guatemala": OriginGuatemala,
  cherries: CherriesFallback,
  latte: LatteFallback,
};

function ContourPlate({ slot, label, position }: FallbackProps & { slot: PhotoSlot }) {
  const spec = PHOTOS[slot];
  const [w, h] = FRAME_SIZE[spec.aspect];
  const markH = Math.min(w, h) * 0.16;
  const s = markH / MARK_BOX.height;
  return (
    <Frame aspect={spec.aspect} label={label} position={position}>
      <rect width={w} height={h} fill={spec.tone} />
      <rect width={w} height={h} fill="#241913" opacity="0.18" />
      <Contours
        hills={[
          { cx: w * 0.62, cy: h * 0.58, r: Math.min(w, h) * 0.42, levels: 11, stretch: 1.35, wobble: 0.16, seed: slot.length * 7 },
          { cx: w * 0.12, cy: h * 0.18, r: Math.min(w, h) * 0.22, levels: 6, stretch: 1.2, wobble: 0.2, seed: slot.length * 3 },
        ]}
        stroke="#f4ecdf"
        strokeWidth={1.2}
        opacity={0.28}
      />
      <path
        d={MARK_D}
        fill="#f4ecdf"
        opacity="0.55"
        transform={`translate(${w / 2 - (MARK_BOX.width * s) / 2} ${h / 2 - markH / 2}) scale(${s}) translate(${-MARK_BOX.x} ${-MARK_BOX.y})`}
      />
    </Frame>
  );
}

export function PhotoFallback({ slot, label, position }: FallbackProps & { slot: PhotoSlot }) {
  const Bespoke = BESPOKE[slot];
  if (Bespoke) return <Bespoke label={label} position={position} />;
  return <ContourPlate slot={slot} label={label} position={position} />;
}
