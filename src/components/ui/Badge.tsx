import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Product } from "@/content/products";

export type BadgeTone = "espresso" | "clay" | "moss" | "ochre" | "outline" | "linen";

export function Badge({ tone = "espresso", children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return <span className={cn("badge", tone !== "espresso" && `badge-${tone}`, className)}>{children}</span>;
}

const PRODUCT_BADGE_TONE: Record<NonNullable<Product["badge"]>, BadgeTone> = {
  Signature: "espresso",
  Bestseller: "clay",
  Limited: "ochre",
  New: "moss",
  Decaf: "linen",
};

/** The catalog badge for a product, if it has one. */
export function ProductBadge({ product, className }: { product: Product; className?: string }) {
  if (!product.badge) return null;
  return (
    <Badge tone={PRODUCT_BADGE_TONE[product.badge]} className={className}>
      {product.badge}
    </Badge>
  );
}
