"use client";

import { useId } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  SORT_OPTIONS,
  TYPE_OPTIONS,
  isFiltered,
  type FacetCounts,
  type ShopFilters,
  type SortKey,
  type TypeFilter,
} from "@/lib/shop";
import { FacetChecks } from "./FacetChecks";
import { coffeeFacetNote, coffeeFacetsOff, countryOptions, originOptions, processOptions, roastOptions } from "./options";
import type { ShopActions } from "./ShopToolbar";

/* ==========================================================================
   Phones and tablets: every facet and the sort order in the shared left
   Drawer (a real modal dialog: focus trap, Esc, focus returns to the
   "Filter & sort" button). Changes apply live behind the panel; the sticky
   footer says how many products are showing and closes the drawer.
   ========================================================================== */

export function FilterDrawer({
  open,
  onClose,
  filters,
  counts,
  shown,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  filters: ShopFilters;
  counts: FacetCounts;
  shown: number;
  actions: ShopActions;
}) {
  const titleId = useId();
  const off = coffeeFacetsOff(filters);
  const note = coffeeFacetNote(filters);
  const filtered = isFiltered(filters);

  return (
    <Drawer open={open} onClose={onClose} side="left" labelledBy={titleId} className="filter-drawer">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--rule)] px-5 py-4 sm:px-7">
        <div>
          <p className="eyebrow text-bark">The shop</p>
          <h2 id={titleId} className="display mt-1 text-h3">
            Filter &amp; sort
          </h2>
        </div>
        <button type="button" onClick={onClose} className="icon-btn" aria-label="Close filters">
          <Icon name="close" className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-7 sm:px-7" data-lenis-prevent>
        <div className="grid gap-9">
          <ChoiceGroup<TypeFilter>
            legend="Type"
            value={filters.type}
            onChange={actions.setType}
            choices={TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label, meta: counts.type[o.value] }))}
            layout="grid"
            className="filter-drawer-type"
          />
          <FacetChecks
            legend="Roast"
            options={roastOptions(counts)}
            selected={filters.roast}
            onToggle={(v) => actions.toggle("roast", v)}
            disabled={off}
            note={note || undefined}
          />
          <FacetChecks
            legend="Country"
            options={countryOptions(counts)}
            selected={filters.country}
            onToggle={(v) => actions.toggle("country", v)}
            disabled={off}
          />
          <FacetChecks
            legend="Style"
            options={originOptions(counts)}
            selected={filters.origin}
            onToggle={(v) => actions.toggle("origin", v)}
            disabled={off}
          />
          <FacetChecks
            legend="Process"
            options={processOptions(counts)}
            selected={filters.process}
            onToggle={(v) => actions.toggle("process", v)}
            disabled={off}
          />
          <ChoiceGroup<SortKey>
            legend="Sort by"
            value={filters.sort}
            onChange={actions.setSort}
            choices={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            layout="stack"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 border-t border-[var(--rule)] bg-linen px-5 py-4 sm:px-7">
        {/* aria-disabled, not disabled: clearing must not drop keyboard focus out of the dialog. */}
        <Button
          variant="ghost"
          size="md"
          onClick={() => filtered && actions.clear()}
          aria-disabled={!filtered || undefined}
          className="px-4"
        >
          Clear all
        </Button>
        <Button size="md" block onClick={onClose} icon="arrow" className="flex-1">
          {shown === 0 ? "Nothing matches yet" : `Show ${shown} ${shown === 1 ? "product" : "products"}`}
        </Button>
      </div>
    </Drawer>
  );
}
