import Link from "next/link";
import type { CSSProperties } from "react";
import { fromPrice, isCoffee, type Product } from "@/content/products";
import { ProductImage } from "./ProductImage";
import { ProductBadge } from "@/components/ui/Badge";
import { RoastMeter } from "@/components/ui/Meters";
import { formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/cn";
import { QuickAdd } from "./QuickAdd";

/* ==========================================================================
   Product card, shared by Home, Shop and related products. Works in server
   and client components (no server-only imports).
   - Media: the pre-rendered product art (<ProductImage>, no inline SVG
     weight) on the product's own colour stage (palette.stage) with a faint
     contour print. Hover/focus: the art lifts and tilts, its
     shadow tightens, and Quick add rises in. Fine pointers get the "View"
     cursor bubble (data-cursor).
   - One link in the tab order (the name); the media link is a mouse
     convenience and hidden from assistive tech.
   - data-fly-scope / data-fly-source let Quick add fly the art to the cart.
   ========================================================================== */

export function cardStage(product: Product): { stage: string; ink: string } {
  return { stage: product.palette.stage, ink: product.palette.ink };
}

export function ProductCard({
  product,
  className,
  headingLevel: H = "h3",
  sizes = "md",
}: {
  product: Product;
  className?: string;
  headingLevel?: "h2" | "h3" | "h4";
  /** "lg" for feature rows with two or three cards. */
  sizes?: "md" | "lg";
}) {
  const coffee = isCoffee(product) ? product : null;
  const { stage, ink } = cardStage(product);
  const href = `/shop/${product.slug}`;
  const titleId = `card-${product.slug}`;

  return (
    <article
      className={cn("product-card group", className)}
      data-fly-scope
      aria-labelledby={titleId}
      style={{ "--stage": stage, "--stage-ink": ink } as CSSProperties}
    >
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="product-card-media" data-cursor="View">
          <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="product-card-contours" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <ellipse key={i} cx="200" cy="520" rx={60 + i * 34} ry={36 + i * 26} fill="none" stroke="currentColor" strokeWidth="1" />
            ))}
          </svg>
          <span className="product-card-shadow" aria-hidden="true" />
          <span className="product-card-art" data-fly-source>
            {/* Height-led: the art fills 80% of the stage height (see .product-card-art), whatever the card width. */}
            <ProductImage
              product={product}
              alt=""
              className="!h-full !w-auto max-w-none"
              sizes={sizes === "lg" ? "(min-width: 64rem) 28vw, 64vw" : "(min-width: 64rem) 21vw, (min-width: 40rem) 32vw, 64vw"}
            />
          </span>
          {coffee?.signatureIndex && (
            <span className="absolute top-4 right-4 font-mono text-micro tracking-[0.14em]" style={{ color: ink }}>
              N° 0{coffee.signatureIndex}
            </span>
          )}
        </Link>
        <ProductBadge product={product} className="pointer-events-none absolute top-4 left-4" />
        <QuickAdd product={product} className="absolute right-3 bottom-3 left-3" />
      </div>

      <div className="pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <H id={titleId} className="display text-[1.5rem] leading-tight tracking-[-0.01em]">
            <Link href={href} className="product-card-link">
              {product.name}
            </Link>
          </H>
          <p className="shrink-0 font-mono text-small tabular-nums">
            {coffee && <span className="sr-only">From </span>}
            {coffee && <span className="text-micro text-bark" aria-hidden="true">from </span>}
            {formatPrice(fromPrice(product), { compact: true })}
          </p>
        </div>
        {coffee ? (
          <>
            <p className="mt-1 text-small text-bark">
              {coffee.originLabel} · {coffee.processLabel}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="display truncate text-[1.0625rem] italic text-espresso/85">{coffee.notes.join(", ").toLowerCase()}</p>
              <RoastMeter roast={coffee.roast} showLabel={false} className="shrink-0 text-espresso/80" />
            </div>
          </>
        ) : (
          <p className="mt-1 text-small text-bark">{product.tagline}</p>
        )}
      </div>
    </article>
  );
}
