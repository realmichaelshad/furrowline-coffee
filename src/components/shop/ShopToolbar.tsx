"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  SORT_OPTIONS,
  activeChips,
  isFiltered,
  type ActiveChip,
  type CoffeeFacetKey,
  type FacetCounts,
  type ShopFilters,
  type SortKey,
  type TypeFilter,
} from "@/lib/shop";
import { cn } from "@/lib/cn";
import { FacetChecks } from "./FacetChecks";
import { FacetPopover } from "./FacetPopover";
import { TypeSegment } from "./TypeSegment";
import { coffeeFacetNote, coffeeFacetsOff, countryOptions, originOptions, processOptions, roastOptions } from "./options";

export interface ShopActions {
  setType: (type: TypeFilter) => void;
  toggle: <K extends CoffeeFacetKey>(facet: K, value: ShopFilters[K][number]) => void;
  setSort: (sort: SortKey) => void;
  removeChip: (chip: ActiveChip) => void;
  clear: () => void;
}

/* ==========================================================================
   Filter and sort toolbar.
   - Desktop (xl, 1280+): one row: type segments, Roast and Origin & process
     menus, the live count and the sort select.
   - Laptops and wide tablets (56rem+): one row of type segments, a
     "Filter & sort" button (opens the drawer) and the count.
   - Phones: the button and count, then the type segments as a swipeable row.
   - From lg (1024+) the bar is pinned under the fixed header while the grid
     scrolls, and slides up with the header when it hides.
   - Under it: removable chips for every active filter, and Clear all.
   The live count is one polite status region for every layout.
   ========================================================================== */

function headerHeightPx(): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim();
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return 72;
  return value.endsWith("rem") ? n * Number.parseFloat(getComputedStyle(document.documentElement).fontSize) : n;
}

export function ShopToolbar({
  filters,
  counts,
  shown,
  total,
  actions,
  onOpenDrawer,
  drawerOpen,
}: {
  filters: ShopFilters;
  counts: FacetCounts;
  shown: number;
  total: number;
  actions: ShopActions;
  onOpenDrawer: () => void;
  drawerOpen: boolean;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const chips = activeChips(filters);
  const off = coffeeFacetsOff(filters);
  const note = coffeeFacetNote(filters);

  // Know when the bar is pinned under the header (for its frosted background and for sliding up when the header hides).
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    let io: IntersectionObserver | null = null;
    const observe = () => {
      io?.disconnect();
      const offset = Math.round(headerHeightPx()) + 1;
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          setStuck(!entry.isIntersecting && entry.boundingClientRect.top < offset);
        },
        { rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 },
      );
      io.observe(sentinel);
    };
    observe();
    window.addEventListener("resize", observe);
    return () => {
      io?.disconnect();
      window.removeEventListener("resize", observe);
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      <div className="shop-toolbar-wrap" data-stuck={stuck || undefined}>
        <div className="shop-toolbar">
          <button
            type="button"
            className="shop-filter-btn"
            onClick={onOpenDrawer}
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
          >
            <Icon name="filter" className="size-[1.1rem]" />
            <span>Filter &amp; sort</span>
            {chips.length > 0 && (
              <span className="facet-trigger-count">
                {chips.length}
                <span className="sr-only"> active</span>
              </span>
            )}
          </button>

          <div className="shop-toolbar-type">
            <TypeSegment value={filters.type} counts={counts.type} onChange={actions.setType} name="shop-type" />
          </div>

          <div className="shop-toolbar-facets">
            <FacetPopover label="Roast" activeCount={filters.roast.length} muted={off}>
              <FacetChecks
                legend="Roast level"
                options={roastOptions(counts)}
                selected={filters.roast}
                onToggle={(v) => actions.toggle("roast", v)}
                disabled={off}
                note={note}
              />
            </FacetPopover>
            <FacetPopover
              label="Origin & process"
              activeCount={filters.country.length + filters.origin.length + filters.process.length}
              muted={off}
            >
              <div className="grid gap-6">
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
                  note={note}
                />
              </div>
            </FacetPopover>
          </div>

          <p className="shop-toolbar-count" role="status" aria-live="polite" aria-atomic="true">
            <span className="shop-count-dot" aria-hidden="true" data-filtered={isFiltered(filters) || undefined} />
            Showing <span className="tabular-nums">{shown}</span> of <span className="tabular-nums">{total}</span>
          </p>

          <label className="shop-sort">
            <span className="eyebrow text-bark">Sort</span>
            <select value={filters.sort} onChange={(e) => actions.setSort(e.target.value as SortKey)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <Icon name="chevron-down" className="pointer-events-none size-4" />
          </label>
        </div>
      </div>

      <div className={cn("shop-chips", chips.length === 0 && "hidden")}>
        <p className="sr-only">Active filters</p>
        <ul className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <li key={chip.key}>
              <button type="button" className="active-chip" onClick={() => actions.removeChip(chip)}>
                <span>{chip.label}</span>
                <Icon name="close" className="size-3.5" />
                <span className="sr-only">, remove filter</span>
              </button>
            </li>
          ))}
          <li>
            <button type="button" className="link-sweep ml-2 text-small font-semibold text-clay" onClick={actions.clear}>
              Clear all
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
