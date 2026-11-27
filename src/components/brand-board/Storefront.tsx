import type { CSSProperties } from "react";
import { Logo } from "@/components/brand/Logo";
import { Photo } from "@/components/photo/Photo";
import { SITE } from "@/content/site";
import { quadTransform, type Quad } from "./homography";

/* ==========================================================================
   Storefront sign mockup: the roastery's brick corner at dusk (the
   "storefront" photograph) with the lockup painted on the blank timber
   fascia above the door. The fascia's four inner corners were measured on
   the 1024 × 1536 photo; the lockup is laid out flat on a 400 × 139 panel
   and warped onto those corners with a projective matrix3d, then lit by the
   lamp above it (brighter at the centre, a soft warm bloom) with a fine
   shadow under each painted stroke.
   ========================================================================== */

const PHOTO_SIZE = { w: 1024, h: 1536 } as const;

/** Inner corners of the fascia board on the photo (TL, TR, BR, BL). */
const FASCIA: Quad = [
  [571, 231],
  [901, 251],
  [901, 361],
  [571, 345],
];

/** Lamp above the fascia, on the photo. */
const LAMP = { x: 762, y: 196 } as const;

const PANEL = { w: 400, h: 139 } as const;

export function Storefront({
  width,
  height,
  scale,
  offset,
  priority = false,
  sizes,
  className,
  style,
}: {
  /** Visible frame size in px. */
  width: number;
  height: number;
  /** Photo scale (1 = 1024 × 1536). */
  scale: number;
  /** Photo offset inside the frame, px (usually negative: the crop). */
  offset: readonly [number, number];
  priority?: boolean;
  /** next/image sizes; defaults to the photo's width at 1:1. */
  sizes?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const [ox, oy] = offset;
  const pw = PHOTO_SIZE.w * scale;
  const ph = PHOTO_SIZE.h * scale;
  const place = ([x, y]: Quad[number]) => [x * scale + ox, y * scale + oy] as const;
  const quad: Quad = [place(FASCIA[0]), place(FASCIA[1]), place(FASCIA[2]), place(FASCIA[3])];
  const lamp = { x: LAMP.x * scale + ox, y: LAMP.y * scale + oy };
  return (
    <div className={`board-store ${className ?? ""}`} style={{ width, height, ...style }}>
      <div className="absolute" style={{ left: ox, top: oy, width: pw, height: ph }}>
        <Photo
          slot="storefront"
          fill
          priority={priority}
          sizes={sizes ?? `${Math.ceil(pw)}px`}
          alt={`Mockup: the ${SITE.shortName} logo painted on the timber fascia above the roastery door at dusk.`}
        />
      </div>
      <div className="board-fascia" style={{ width: PANEL.w, height: PANEL.h, transform: quadTransform(PANEL.w, PANEL.h, quad) }} aria-hidden="true">
        <div className="board-fascia-paint">
          <Logo variant="horizontal" decorative markColor="currentColor" textColor="currentColor" className="block h-auto w-full" />
        </div>
      </div>
      <span
        className="board-lamp-glow"
        aria-hidden="true"
        style={{ left: lamp.x, top: lamp.y, width: 260 * scale * 1.6, height: 200 * scale * 1.6 } as CSSProperties}
      />
    </div>
  );
}
