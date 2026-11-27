"use client";

import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/**
 * − qty + control. The count is announced through aria-live on change.
 * At the limits the buttons are aria-disabled rather than disabled, so a
 * keyboard user who steps down to 1 keeps focus on the button instead of
 * being dropped to the page.
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 24,
  label = "Quantity",
  size = "md",
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Used to build the button labels, e.g. "Quantity of First Light". */
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const btn = cn(
    "grid place-items-center rounded-full transition-colors hover:bg-espresso/8 aria-disabled:cursor-not-allowed aria-disabled:opacity-35 aria-disabled:hover:bg-transparent",
    size === "sm" ? "size-8" : "size-11",
  );
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--rule-strong)]",
        size === "sm" ? "h-9 px-0.5" : "h-12 px-1",
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={btn}
        onClick={() => value > min && onChange(value - 1)}
        aria-disabled={value <= min || undefined}
        aria-label={`Decrease ${lowerFirst(label)}`}
      >
        <Icon name="minus" className="size-4" />
      </button>
      <output className={cn("text-center font-mono tabular-nums", size === "sm" ? "w-6 text-small" : "w-8")} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={btn}
        onClick={() => value < max && onChange(value + 1)}
        aria-disabled={value >= max || undefined}
        aria-label={`Increase ${lowerFirst(label)}`}
      >
        <Icon name="plus" className="size-4" />
      </button>
    </div>
  );
}

/** "Quantity of First Light" becomes "quantity of First Light": only the first word changes case. */
function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}
