"use client";

import { useId, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/* ==========================================================================
   A multi-select facet: native checkboxes in a fieldset, styled as chips
   with a live count. Values with no matching products are disabled (the
   count says why), unless they are already picked and need unticking.
   ========================================================================== */

export interface FacetOption<T extends string> {
  value: T;
  label: string;
  count: number;
  /** Small visual before the label (decorative). */
  adornment?: ReactNode;
}

export function FacetChecks<T extends string>({
  legend,
  hideLegend,
  options,
  selected,
  onToggle,
  disabled,
  note,
  className,
}: {
  legend: string;
  hideLegend?: boolean;
  options: Array<FacetOption<T>>;
  selected: readonly T[];
  onToggle: (value: T) => void;
  /** Disables the whole group (e.g. roast while browsing gear). */
  disabled?: boolean;
  /** Shown under the chips and tied to the group with aria-describedby. */
  note?: ReactNode;
  className?: string;
}) {
  const noteId = useId();
  return (
    <fieldset className={cn("min-w-0", className)} aria-describedby={note ? noteId : undefined} disabled={disabled}>
      <legend className={cn("eyebrow mb-3 text-bark", hideLegend && "sr-only")}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = selected.includes(option.value);
          const empty = option.count === 0 && !checked;
          return (
            <label key={option.value} className="facet-chip" data-empty={empty || undefined}>
              <input
                type="checkbox"
                value={option.value}
                checked={checked}
                disabled={disabled || empty}
                onChange={() => onToggle(option.value)}
              />
              <span className="facet-chip-box" aria-hidden="true">
                <Icon name="check" className="size-3" strokeWidth={2.2} />
              </span>
              {option.adornment}
              <span>{option.label}</span>
              <span className="facet-chip-count" aria-hidden="true">
                {option.count}
              </span>
              <span className="sr-only">
                , {option.count} {option.count === 1 ? "product" : "products"}
              </span>
            </label>
          );
        })}
      </div>
      {note && (
        <p id={noteId} className="mt-3 flex items-start gap-2 text-micro text-bark">
          <Icon name="info" className="mt-px size-4 shrink-0" />
          <span>{note}</span>
        </p>
      )}
    </fieldset>
  );
}

/** Four tiny furrow bars, the roast meter in miniature (decorative). */
export function RoastBars({ step }: { step: number }) {
  return (
    <span className="facet-roast" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <span key={i} data-on={i <= step || undefined} />
      ))}
    </span>
  );
}
