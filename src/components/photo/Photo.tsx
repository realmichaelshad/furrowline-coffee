import Image from "next/image";
import type { CSSProperties } from "react";
import { PHOTOS, aspectRatio, type PhotoAspect, type PhotoSlot } from "@/content/photos";
import { findPhoto } from "@/lib/photos.server";
import { cn } from "@/lib/cn";
import { PhotoFallback } from "./fallbacks";

/* ==========================================================================
   <Photo slot="roastery" sizes="(min-width: 64rem) 50vw, 100vw" />
   Server component. Renders public/photos/<slot>.* with next/image when the
   file exists at build time, otherwise the slot's illustrated fallback.
   - The box always keeps the slot's aspect ratio (or `aspect` override), so
     there is no layout shift either way.
   - Crops default to the slot's focal point (PHOTOS[slot].focus).
   - `priority` only for the hero. `sizes` is required for correct srcsets.
   - `zoom`: adds data-reveal-zoom to the media so clip reveals settle from a zoom.
   - Treatments (all static CSS, no JS):
       tint="#9e3a2a"  a multiply wash in a brand/coffee colour
       duotone        desaturated photo + tint, for quiet backgrounds
       shade="bottom" a soft espresso gradient so overlaid text passes AA
   Use it from server components; client components receive it as a prop
   or as children.
   ========================================================================== */

export interface PhotoProps {
  slot: PhotoSlot;
  sizes: string;
  className?: string;
  /** Override the slot's aspect ratio (the image is cropped to cover). */
  aspect?: PhotoAspect | number;
  /** Fill the parent instead of keeping an aspect ratio (parent must be positioned and sized). */
  fill?: boolean;
  priority?: boolean;
  /** object-position override, e.g. "50% 30%". Defaults to the slot's focus. */
  position?: string;
  /** Alt override; defaults to the manifest alt. Pass "" for decorative. */
  alt?: string;
  zoom?: boolean;
  /**
   * Crops tighter than cover: scales the image around `position`, for a detail of a photo that is
   * also used whole elsewhere. Size `sizes` up by the same factor.
   */
  scale?: number;
  /** Multiply wash colour. */
  tint?: string;
  /** Desaturate under the tint (needs `tint`). */
  duotone?: boolean;
  /** Gradient scrim for overlaid text. */
  shade?: "bottom" | "left" | "full";
  /** Extra classes for the inner media wrapper (the element that zooms). */
  mediaClassName?: string;
  quality?: 75 | 85;
  style?: CSSProperties;
}

const SHADES: Record<NonNullable<PhotoProps["shade"]>, string> = {
  bottom: "linear-gradient(180deg, rgb(36 25 19 / 0) 35%, rgb(36 25 19 / 0.55) 70%, rgb(36 25 19 / 0.85) 100%)",
  left: "linear-gradient(90deg, rgb(36 25 19 / 0.75) 0%, rgb(36 25 19 / 0.35) 45%, rgb(36 25 19 / 0) 70%)",
  full: "linear-gradient(180deg, rgb(36 25 19 / 0.35), rgb(36 25 19 / 0.55))",
};

export function Photo({
  slot,
  sizes,
  className,
  aspect,
  fill = false,
  priority = false,
  position,
  alt,
  zoom = false,
  scale,
  tint,
  duotone = false,
  shade,
  mediaClassName,
  quality = 75,
  style,
}: PhotoProps) {
  const spec = PHOTOS[slot];
  const file = findPhoto(slot);
  const ratio = typeof aspect === "number" ? aspect : aspectRatio(aspect ?? spec.aspect);
  const label = alt ?? spec.alt;
  const objectPosition = position ?? spec.focus;
  return (
    <div
      className={cn("overflow-hidden", fill ? "absolute inset-0" : "relative", className)}
      style={{ aspectRatio: fill ? undefined : String(ratio), backgroundColor: spec.tone, ...style }}
      data-photo={slot}
      data-photo-source={file ? "file" : "fallback"}
    >
      <div className={cn("absolute inset-0", mediaClassName)} data-reveal-zoom={zoom ? "" : undefined}>
        {file ? (
          <Image
            src={file.src}
            alt={label}
            fill
            sizes={sizes}
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            quality={quality}
            className={cn("object-cover", duotone && "photo-duotone")}
            style={scale ? { objectPosition, transform: `scale(${scale})`, transformOrigin: objectPosition } : { objectPosition }}
          />
        ) : (
          <PhotoFallback slot={slot} label={label} position={objectPosition} />
        )}
      </div>
      {tint && (
        <div
          aria-hidden="true"
          className={cn("photo-tint pointer-events-none absolute inset-0", duotone && "photo-tint-strong")}
          style={{ backgroundColor: tint }}
        />
      )}
      {shade && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: SHADES[shade] }} />
      )}
    </div>
  );
}
