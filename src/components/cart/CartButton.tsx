"use client";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "./CartProvider";

/** Header cart button: the fly-to-cart target, with a count that bumps on add. */
export function CartButton({ className }: { className?: string }) {
  const { open, totals, ready, bump } = useCart();
  const count = ready ? totals.itemCount : 0;
  return (
    <button
      type="button"
      onClick={open}
      data-cart-target
      data-magnetic
      className={cn(
        "group relative inline-flex h-11 items-center gap-2 rounded-full border border-[var(--rule-strong)] pr-1.5 pl-3 text-small font-semibold transition-colors hover:border-espresso hover:bg-espresso hover:text-parchment sm:pl-4",
        className,
      )}
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
    >
      <span data-magnetic-inner className="inline-flex items-center gap-2">
        <Icon name="bag" className="size-[1.15rem]" />
        <span className="hidden sm:inline">Cart</span>{" "}
        <span
          key={bump}
          className={cn(
            "grid h-8 min-w-8 place-items-center rounded-full px-2 font-mono text-micro tabular-nums transition-colors",
            count > 0 ? "bg-clay text-linen" : "bg-espresso/8 text-espresso group-hover:bg-parchment/15 group-hover:text-parchment",
            bump > 0 && "animate-[bump_640ms_var(--ease-out-quart)]",
          )}
          aria-hidden="true"
        >
          {count}
        </span>
      </span>
    </button>
  );
}
