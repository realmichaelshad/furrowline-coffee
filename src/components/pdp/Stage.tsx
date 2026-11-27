"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { cn } from "@/lib/cn";
import { usePdp } from "./PdpProvider";

/* ==========================================================================
   The product stage: the packaging art on the coffee's own colour, with a
   switch to a photograph (origin, harvest, the object in use).
   - The art is the page's single priority image (the LCP) and the
     [data-fly-source] for add to cart. It never starts transparent: the CSS
     entrance only moves it.
   - The photo arrives from the server as `photo` and is only mounted once
     the visitor shows interest in the stage (pointer or focus), then loaded
     eagerly, so it never competes with the LCP. Switching wipes it up with
     clip-path while the bag steps aside into the corner.
   - Gear with colours: every colour's art is stacked and crossfades; the
     others mount only once the colour picker is approached.
   - The switch is a native radio pair (arrow keys, labels, announcements).
   ========================================================================== */

type View = "art" | "photo";

export function Stage({
  photo,
  labels,
  stage,
  ink,
  sizes,
  children,
}: {
  photo: ReactNode;
  labels: [string, string];
  stage: string;
  ink: string;
  sizes: string;
  /** Server-rendered decoration: contour print, badge, index. */
  children?: ReactNode;
}) {
  const { product, options, primed, prime } = usePdp();
  const [view, setView] = useState<View>("art");
  const [armed, setArmed] = useState(false);
  const photoRef = useRef<HTMLDivElement>(null);
  const name = useId();

  // Once mounted, load the photo straight away instead of waiting for it to be revealed.
  useEffect(() => {
    if (!armed) return;
    photoRef.current?.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
  }, [armed]);

  const choose = (next: View) => {
    if (next === "photo" && !armed) {
      setArmed(true);
      // Let the photo mount in its clipped state before the wipe starts.
      requestAnimationFrame(() => requestAnimationFrame(() => setView(next)));
      return;
    }
    setView(next);
  };

  const variants = product.type === "coffee" ? [] : (product.variants ?? []);
  const active = options.variant;

  return (
    <div
      className="pdp-stage"
      data-view={view}
      style={{ "--stage": stage, "--ink": ink } as CSSProperties}
      onPointerEnter={() => {
        setArmed(true);
        prime();
      }}
      onFocusCapture={() => setArmed(true)}
    >
      <div ref={photoRef} className="pdp-stage-photo" aria-hidden={view !== "photo"}>
        {armed && photo}
      </div>

      {children}

      <div className="pdp-stage-art">
        <span className="pdp-stage-shadow" aria-hidden="true" />
        <div className="pdp-stage-float" data-parallax="0.05">
          <div className="pdp-stage-bag" data-fly-source data-pdp-art>
            {variants.length > 1 ? (
              variants.map((v, i) => {
                const isActive = v.id === active || (!active && i === 0);
                // The first colour renders from the start (it's the LCP); the rest once they are picked.
                if (i > 0 && !isActive && !primed) return null;
                return (
                  <span key={v.id} className="pdp-variant" data-active={isActive || undefined}>
                    <ProductImage
                      product={product}
                      variant={v.id}
                      priority={i === 0}
                      sizes={sizes}
                      alt={isActive ? `${product.name}, ${v.label}` : ""}
                    />
                  </span>
                );
              })
            ) : (
              <ProductImage product={product} priority sizes={sizes} />
            )}
          </div>
        </div>
      </div>

      <fieldset className="pdp-switch" style={{ "--i": view === "art" ? 0 : 1 } as CSSProperties}>
        <legend className="sr-only">Show</legend>
        <span className="pdp-switch-thumb" aria-hidden="true" />
        {(["art", "photo"] as const).map((v, i) => (
          <label key={v} className={cn("pdp-switch-option", view === v && "is-active")}>
            <input type="radio" name={name} value={v} checked={view === v} onChange={() => choose(v)} />
            <span>{labels[i]}</span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}
