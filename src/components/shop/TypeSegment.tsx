"use client";

import { useId } from "react";
import { TYPE_OPTIONS, type TypeFilter } from "@/lib/shop";
import { cn } from "@/lib/cn";

/* Type picker: a segmented control built on native radios (arrow keys move
   between options). The selected pill fills in espresso from its centre. */
export function TypeSegment({
  value,
  counts,
  onChange,
  className,
  name,
}: {
  value: TypeFilter;
  counts: Record<TypeFilter, number>;
  onChange: (value: TypeFilter) => void;
  className?: string;
  name?: string;
}) {
  const auto = useId();
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="sr-only">Product type</legend>
      <div className="seg">
        {TYPE_OPTIONS.map((option) => (
          <label key={option.value} className="seg-option">
            <input
              type="radio"
              name={name ?? auto}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.short ? (
              <span>
                <span className="sm:hidden">{option.short}</span>
                <span className="max-sm:hidden">{option.label}</span>
              </span>
            ) : (
              <span>{option.label}</span>
            )}
            <span className="seg-count" aria-hidden="true">
              {counts[option.value]}
            </span>
            <span className="sr-only">, {counts[option.value]} products</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
