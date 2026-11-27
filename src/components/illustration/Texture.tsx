import type { CSSProperties } from "react";
import { textureUrl, type TextureId } from "@/content/textures";
import { cn } from "@/lib/cn";

/* ==========================================================================
   <Texture id="panel-1" className="text-espresso/15" />
   A contour backdrop drawn as a CSS mask over currentColor: set the colour
   (and opacity) with text utilities. Absolutely fills the nearest
   positioned ancestor by default. Decorative. See src/content/textures.ts.
   fit: "cover" crops like preserveAspectRatio slice; "fill" stretches to
   the box (use when the box has the texture's exact aspect ratio).
   The file is only fetched once the element is within a viewport or so of
   the screen (InteractionLayer adds data-near), never during page load.
   ========================================================================== */

export function Texture({
  id,
  className,
  fit = "cover",
  position = "center",
  style,
}: {
  id: TextureId;
  className?: string;
  fit?: "cover" | "contain" | "fill";
  position?: string;
  style?: CSSProperties;
}) {
  const size = fit === "fill" ? "100% 100%" : fit;
  return (
    <span
      aria-hidden="true"
      data-texture=""
      className={cn("texture", className)}
      style={{ "--tex": `url(${textureUrl(id)})`, "--tex-size": size, "--tex-pos": position, ...style } as CSSProperties}
    />
  );
}
