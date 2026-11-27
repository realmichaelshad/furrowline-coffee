"use client";

import { useState } from "react";
import type { Product } from "@/content/products";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/lib/pricing";
import { defaultPick } from "@/lib/product-options";
import { cn } from "@/lib/cn";
import { findFlySource } from "./AddToCartButton";

/* ==========================================================================
   Quick add from a product card: the default options (12 oz, whole bean,
   one-time for coffee; first colour for gear, see defaultPick) straight into
   the cart, with the fly animation. Hidden until hover/focus on fine
   pointers, always visible on touch.
   ========================================================================== */

export function QuickAdd({ product, className }: { product: Product; className?: string }) {
  const { add } = useCart();
  const [busy, setBusy] = useState(false);
  const pick = defaultPick(product);

  return (
    <button
      type="button"
      data-cursor=""
      className={cn("quick-add", className)}
      aria-busy={busy || undefined}
      aria-label={`Quick add ${product.name}${pick.summary ? `, ${pick.summary}` : ""}, ${formatPrice(pick.unit)}`}
      onClick={async (e) => {
        if (busy) return; // stay enabled so focus is kept for the drawer to return it
        setBusy(true);
        await add(pick.line, { source: findFlySource(e.currentTarget) });
        setBusy(false);
      }}
    >
      <span className="quick-add-icon">
        <Icon name="plus" className="size-4" />
      </span>
      <span className="quick-add-label">
        Quick add <span className="font-mono text-micro opacity-75">{formatPrice(pick.unit, { compact: true })}</span>
      </span>
    </button>
  );
}
