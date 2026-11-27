"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import type { NewCartLine } from "@/lib/cart";

/* ==========================================================================
   Add-to-cart button with the fly animation. The art that flies is found
   by walking up to the nearest [data-fly-scope] and taking its
   [data-fly-source] (usually the bag illustration), so server components
   only need two attributes to opt in. Shows "Added" for a moment after.
   ========================================================================== */

export function findFlySource(from: Element | null): Element | null {
  const scope = from?.closest("[data-fly-scope]");
  return scope?.querySelector("[data-fly-source]") ?? null;
}

export function AddToCartButton({
  line,
  children = "Add to cart",
  addedLabel = "Added to cart",
  variant = "primary",
  size = "md",
  block,
  magnetic,
  className,
  openDrawer = true,
  disabled,
}: {
  line: NewCartLine;
  children?: ReactNode;
  addedLabel?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  magnetic?: boolean;
  className?: string;
  openDrawer?: boolean;
  disabled?: boolean;
}) {
  const { add } = useCart();
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <Button
      variant={variant}
      size={size}
      block={block}
      magnetic={magnetic}
      className={className}
      icon={state === "added" ? "check" : "plus"}
      iconPosition="start"
      disabled={disabled}
      aria-busy={state === "adding" || undefined}
      onClick={async (e) => {
        // Never disable mid-add: a disabled button drops focus, and focus must return here.
        if (state === "adding") return;
        setState("adding");
        await add(line, { source: findFlySource(e.currentTarget), openDrawer });
        setState("added");
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setState("idle"), 1800);
      }}
    >
      {state === "added" ? addedLabel : children}
    </Button>
  );
}
