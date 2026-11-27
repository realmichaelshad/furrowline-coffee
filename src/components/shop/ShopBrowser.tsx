"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/content/products";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/States";
import { Button, ArrowLink } from "@/components/ui/Button";
import { scrollToTarget } from "@/lib/motion/lenis";
import {
  DEFAULT_FILTERS,
  clearFilters,
  facetCounts,
  isFiltered,
  normalizeFilters,
  parseFilters,
  removeChip,
  sameFilters,
  serializeFilters,
  setType,
  toggleFacet,
  visibleProducts,
  type ShopFilters,
} from "@/lib/shop";
import { SearchParamsSync } from "./SearchParamsSync";
import { ShopToolbar, type ShopActions } from "./ShopToolbar";
import { FilterDrawer } from "./FilterDrawer";
import { useFlipGrid } from "./useFlipGrid";
import "./shop.css";

/* ==========================================================================
   The shop's one client island: filter state, URL sync, the toolbar and
   drawer, and the animated grid.
   - The static HTML is the full, unfiltered grid (DEFAULT_FILTERS); the
     query string is applied after hydration by <SearchParamsSync>.
   - Filter changes write the URL with history.replaceState (no scroll jump,
     no history spam) and play a FLIP pass over the grid.
   - Two editorial tiles (server-rendered, passed in as props) sit in the
     flow only while nothing is filtered: after the 4th and 8th product,
     which leaves no holes at 1, 2, 3 or 4 columns (see shop.css).
   ========================================================================== */

type Entry = { key: string; kind: "product"; product: Product } | { key: string; kind: "tile"; tile: "subscribe" | "brew" };

const TOTAL = PRODUCTS.length;

function buildEntries(products: Product[], withTiles: boolean): Entry[] {
  const list: Entry[] = products.map((product) => ({ key: product.slug, kind: "product", product }));
  if (!withTiles) return list;
  if (list.length >= 8) list.splice(8, 0, { key: "tile-brew", kind: "tile", tile: "brew" });
  if (list.length >= 4) list.splice(4, 0, { key: "tile-subscribe", kind: "tile", tile: "subscribe" });
  return list;
}

export function ShopBrowser({ subscribeBand, brewBanner }: { subscribeBand: ReactNode; brewBanner: ReactNode }) {
  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const filtersRef = useRef(filters);
  const sectionRef = useRef<HTMLElement>(null);

  const visible = useMemo(() => visibleProducts(filters), [filters]);
  const counts = useMemo(() => facetCounts(PRODUCTS, filters), [filters]);
  const filtered = isFiltered(filters);
  const entries = useMemo(() => buildEntries(visible, !filtered), [visible, filtered]);
  const { ref: gridRef, capture, leaving } = useFlipGrid(entries);
  // Read inside apply() (a stable callback), so it is synced after render rather than during it.
  const drawerOpenRef = useRef(drawerOpen);
  useEffect(() => {
    drawerOpenRef.current = drawerOpen;
  }, [drawerOpen]);

  /** Brings the top of the results back into view when the visitor was deep in the grid. */
  const revealResults = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top;
    if (top < 0) scrollToTarget(section, { offset: -96 });
  }, []);

  const apply = useCallback(
    (next: ShopFilters, opts: { animate?: boolean; writeUrl?: boolean; scroll?: boolean } = {}) => {
      const { animate = true, writeUrl = true, scroll = true } = opts;
      if (sameFilters(filtersRef.current, next)) return;
      if (animate) capture();
      filtersRef.current = next;
      setFilters(next);
      if (writeUrl) {
        const qs = serializeFilters(next);
        const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
        window.history.replaceState(null, "", url);
      }
      if (scroll && !drawerOpenRef.current) requestAnimationFrame(revealResults);
    },
    [capture, revealResults],
  );

  const actions: ShopActions = useMemo(
    () => ({
      setType: (type) => apply(setType(filtersRef.current, type)),
      toggle: (facet, value) => apply(toggleFacet(filtersRef.current, facet, value)),
      setSort: (sort) => apply({ ...filtersRef.current, sort }),
      removeChip: (chip) => {
        apply(removeChip(filtersRef.current, chip));
        // Keep keyboard focus in the chips row (the pressed chip is gone).
        requestAnimationFrame(() => {
          const section = sectionRef.current;
          const next =
            section?.querySelector<HTMLButtonElement>(".shop-chips:not(.hidden) .active-chip") ??
            section?.querySelector<HTMLInputElement>(".shop-toolbar-type input:checked");
          next?.focus({ preventScroll: true });
        });
      },
      clear: () => apply(clearFilters(filtersRef.current)),
    }),
    [apply],
  );

  // Query string → state (direct loads and soft navigations such as the footer links).
  const onParams = useCallback(
    (parsed: ShopFilters, initial: boolean) => {
      apply(parsed, { animate: !initial, writeUrl: false, scroll: !initial });
      // Canonicalise hand-written URLs (?roast=light becomes ?type=coffee&roast=light).
      const canonical = serializeFilters(parsed);
      if (canonical !== window.location.search.replace(/^\?/, "")) {
        window.history.replaceState(null, "", `${window.location.pathname}${canonical ? `?${canonical}` : ""}${window.location.hash}`);
      }
    },
    [apply],
  );

  // Links to /shop?… inside the shop (the editorial tiles, the empty state) filter in place.
  const onClickCapture = (e: MouseEvent<HTMLElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element).closest<HTMLAnchorElement>("a[href]");
    if (!link || link.target) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== "/shop") return;
    e.preventDefault();
    apply(normalizeFilters(parseFilters(url.search)));
  };

  return (
    <section
      ref={sectionRef}
      className="shop shell pb-section"
      aria-labelledby="shop-results-title"
      onClickCapture={onClickCapture}
    >
      <h2 id="shop-results-title" className="sr-only">
        Products
      </h2>
      <Suspense fallback={null}>
        <SearchParamsSync onChange={onParams} />
      </Suspense>

      <ShopToolbar
        filters={filters}
        counts={counts}
        shown={visible.length}
        total={TOTAL}
        actions={actions}
        drawerOpen={drawerOpen}
        onOpenDrawer={() => setDrawerOpen(true)}
      />

      <ul ref={gridRef} className="shop-grid" data-filtered={filtered || undefined}>
        {entries.map((entry, i) =>
          entry.kind === "product" ? (
            <li key={entry.key} data-flip-key={entry.key} className="shop-item">
              <div data-reveal="rise" data-reveal-delay={String((i % 4) * 80)}>
                <ProductCard product={entry.product} />
              </div>
            </li>
          ) : (
            <li key={entry.key} data-flip-key={entry.key} className={`shop-item shop-tile shop-tile-${entry.tile}`}>
              {entry.tile === "subscribe" ? subscribeBand : brewBanner}
            </li>
          ),
        )}
        {leaving.map(({ id, entry, rect }) => (
          <li
            key={`leave-${id}`}
            data-flip-key={entry.key}
            data-leaving={id}
            aria-hidden="true"
            inert
            className={`shop-item shop-leaving${entry.kind === "tile" ? ` shop-tile shop-tile-${entry.tile}` : ""}`}
            style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
          >
            {entry.kind === "product" ? <ProductCard product={entry.product} headingLevel="h4" /> : entry.tile === "subscribe" ? subscribeBand : brewBanner}
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <div className="shop-empty">
          <EmptyState
            headingLevel="h3"
            title="Nothing in that row"
            actions={
              <>
                <Button size="sm" icon="arrow" onClick={actions.clear}>
                  Clear filters
                </Button>
                <Button href="/#find-your-coffee" size="sm" variant="outline">
                  Find your coffee
                </Button>
              </>
            }
          >
            No coffee matches all of those at once. Loosen a filter or two, or let three quick questions pick one for you.
          </EmptyState>
        </div>
      )}

      <div className="shop-foot">
        <p className="text-small text-bark">
          Every coffee is roasted to order on Tuesdays and Fridays and ships within 48 hours.
        </p>
        <ArrowLink href="/#find-your-coffee" className="text-small">
          Not sure? Three questions
        </ArrowLink>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          requestAnimationFrame(revealResults);
        }}
        filters={filters}
        counts={counts}
        shown={visible.length}
        actions={actions}
      />
    </section>
  );
}
