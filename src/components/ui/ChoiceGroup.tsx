"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Accessible radio group rendered as pills or cards (grind, size, purchase
   type, quiz answers). Native radios inside a fieldset: arrow keys, labels
   and form semantics come for free.
   ========================================================================== */

export interface Choice<T extends string> {
  value: T;
  label: ReactNode;
  detail?: ReactNode;
  /** Right-aligned meta, e.g. a price. */
  meta?: ReactNode;
  disabled?: boolean;
}

export function ChoiceGroup<T extends string>({
  legend,
  hideLegend,
  name,
  value,
  onChange,
  choices,
  layout = "pills",
  className,
  legendAside,
}: {
  legend: ReactNode;
  hideLegend?: boolean;
  name?: string;
  value: T;
  onChange: (value: T) => void;
  choices: Array<Choice<T>>;
  /** pills: wrap inline; grid: equal columns; stack: full-width rows. */
  layout?: "pills" | "grid" | "stack";
  className?: string;
  legendAside?: ReactNode;
}) {
  const auto = useId();
  const groupName = name ?? auto;
  return (
    <fieldset className={cn("min-w-0", className)}>
      {/* The legend must be the fieldset's first child so the group gets its accessible name. */}
      <legend
        className={cn(
          "eyebrow float-left mb-3 flex w-full items-baseline justify-between gap-4",
          hideLegend && "sr-only",
        )}
      >
        <span>{legend}</span>
        {legendAside && (
          <span className="font-sans text-micro normal-case tracking-normal text-bark">{legendAside}</span>
        )}
      </legend>
      <div
        className={cn(
          "clear-both",
          layout === "pills" && "flex flex-wrap gap-2",
          layout === "grid" && "grid grid-cols-2 gap-2 sm:grid-cols-3",
          layout === "stack" && "grid gap-2",
        )}
      >
        {choices.map((choice) => (
          <label key={choice.value} className={cn("choice", layout === "pills" && "py-2.5")}>
            <input
              type="radio"
              name={groupName}
              value={choice.value}
              checked={value === choice.value}
              disabled={choice.disabled}
              onChange={() => onChange(choice.value)}
            />
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-small font-semibold">{choice.label}</span>
              {choice.meta && <span className="font-mono text-micro">{choice.meta}</span>}
            </span>
            {choice.detail && <span className="text-micro opacity-75">{choice.detail}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
