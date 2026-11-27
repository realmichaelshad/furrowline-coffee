import type { CSSProperties } from "react";
import { textureUrl, type TextureId } from "@/content/textures";
import { cn } from "@/lib/cn";

/* ==========================================================================
   A pre-rendered contour texture (public/textures) drawn as a CSS mask over
   currentColor, like <Texture>, but loaded straight away rather than when it
   nears the viewport: the brand sheets are captured as images, so their
   backdrops must be there on the first frame. Keeps hundreds of contour
   path points out of the HTML. Decorative.
   ========================================================================== */

export function ContourMask({
  id,
  className,
  size = "cover",
  position = "center",
  style,
}: {
  id: TextureId;
  className?: string;
  /** mask-size, e.g. "cover" or "140% auto". */
  size?: string;
  position?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("contour-mask", className)}
      style={{ "--mask": `url(${textureUrl(id)})`, "--mask-size": size, "--mask-pos": position, ...style } as CSSProperties}
    />
  );
}
