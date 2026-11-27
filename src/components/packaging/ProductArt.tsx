import type { Product } from "@/content/products";
import { Bag } from "./Bag";
import { GearArt } from "./gear/GearArt";

/** The illustration for any product: a bag for coffee, an object for gear and merch. */
export function ProductArt({
  product,
  variant,
  className,
  detail = "full",
  decorative = false,
  shadow = true,
}: {
  product: Product;
  /** Gear/merch variant id (recolours the object). */
  variant?: string;
  className?: string;
  detail?: "full" | "simple";
  decorative?: boolean;
  shadow?: boolean;
}) {
  if (product.type === "coffee") {
    return <Bag coffee={product} className={className} detail={detail} decorative={decorative} shadow={shadow} />;
  }
  const swatch = product.variants?.find((v) => v.id === variant)?.swatch;
  return (
    <GearArt
      art={product.art}
      variant={variant ?? product.variants?.[0]?.id}
      swatch={swatch ?? product.variants?.[0]?.swatch}
      className={className}
      title={product.name}
      decorative={decorative}
      shadow={shadow}
    />
  );
}
