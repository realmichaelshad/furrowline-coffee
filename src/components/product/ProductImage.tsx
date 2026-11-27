import Image from "next/image";
import type { Product } from "@/content/products";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Pre-rendered product art (public/packaging/<slug>[--<variant>].webp,
   800 × 1150, transparent), made by `npm run brand` from the same SVG
   components. Use it wherever many products appear (cards, rows, the
   quiz fan): it keeps inline SVG out of the HTML and the RSC payload and
   lets next/image serve the right size (it rotates, lifts and flies just as
   well). Use the inline <ProductArt>/<Bag> SVG only where a vector matters:
   very large hero visuals, the brand guide/board, client-only UI.
   ========================================================================== */

export const PACKAGING_SIZE = { width: 800, height: 1150 } as const;

export function packagingVariant(product: Product, variant?: string): string | undefined {
  if (product.type === "coffee" || !product.variants?.length) return undefined;
  return product.variants.some((v) => v.id === variant) ? variant : product.variants[0]!.id;
}

export function packagingSrc(product: Product, variant?: string): string {
  const v = packagingVariant(product, variant);
  return `/packaging/${product.slug}${v ? `--${v}` : ""}.webp`;
}

export function ProductImage({
  product,
  variant,
  sizes,
  className,
  priority = false,
  alt,
}: {
  product: Product;
  variant?: string;
  /** Required: the rendered width, e.g. "(min-width: 64rem) 22vw, 70vw". */
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Defaults to "<name> coffee bag" / the product name. Pass "" when decorative. */
  alt?: string;
}) {
  const label = alt ?? (product.type === "coffee" ? `${product.name} coffee bag` : product.name);
  return (
    <Image
      src={packagingSrc(product, variant)}
      alt={label}
      width={PACKAGING_SIZE.width}
      height={PACKAGING_SIZE.height}
      sizes={sizes}
      priority={priority}
      quality={85}
      className={cn("h-auto w-full select-none", className)}
      draggable={false}
    />
  );
}
