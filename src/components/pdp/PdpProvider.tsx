"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getProduct, type Product } from "@/content/products";
import {
  clampQuantity,
  defaultOptions,
  mergeOptionsIntoSearch,
  parseOptions,
  priceSummary,
  sameOptions,
  sanitizeOptions,
  type PriceSummary,
  type ProductOptions,
} from "@/lib/product-options";

/* ==========================================================================
   Shared state for one product page: the chosen options and quantity, and
   the price summary derived from them. The stage (variant art), the price,
   the configurator and the mobile buy bar all read it.
   - Static HTML always renders the default options. After mount the URL
     (?size=2lb&grind=espresso&plan=sub3, ?color=clay) is applied, and every
     change is written back with history.replaceState, so a configured
     product can be shared without blocking the static page.
   ========================================================================== */

interface PdpContextValue {
  product: Product;
  options: ProductOptions;
  update: (patch: Partial<ProductOptions>) => void;
  qty: number;
  setQty: (qty: number) => void;
  summary: PriceSummary;
  /** Counts the visitor's own changes (0 until they touch anything). */
  changes: number;
  /** True once the visitor approaches an option that swaps the art (load the other colours early). */
  primed: boolean;
  prime: () => void;
}

const PdpContext = createContext<PdpContextValue | null>(null);

export function usePdp(): PdpContextValue {
  const ctx = useContext(PdpContext);
  if (!ctx) throw new Error("usePdp must be used inside <PdpProvider>");
  return ctx;
}

export function PdpProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const product = getProduct(slug);
  if (!product) throw new Error(`Unknown product ${slug}`);
  const [options, setOptions] = useState<ProductOptions>(() => defaultOptions(product));
  const [qty, setQtyState] = useState(1);
  const [changes, setChanges] = useState(0);
  const [primed, setPrimed] = useState(false);
  const dirty = useRef(false);

  // Shared links: read the options from the URL once the page is interactive.
  useEffect(() => {
    const fromUrl = parseOptions(product, window.location.search);
    setOptions((prev) => (sameOptions(prev, fromUrl) ? prev : fromUrl));
  }, [product]);

  // Keep the URL in step with the visitor's choices (never on first render).
  useEffect(() => {
    if (!dirty.current) return;
    const { pathname, search, hash } = window.location;
    const next = mergeOptionsIntoSearch(search, product, options);
    if (next !== search) window.history.replaceState(window.history.state, "", `${pathname}${next}${hash}`);
  }, [options, product]);

  const update = useCallback(
    (patch: Partial<ProductOptions>) => {
      dirty.current = true;
      setOptions((prev) => sanitizeOptions(product, { ...prev, ...patch }));
      setChanges((n) => n + 1);
    },
    [product],
  );

  const setQty = useCallback((value: number) => {
    setQtyState(clampQuantity(value));
    setChanges((n) => n + 1);
  }, []);

  const prime = useCallback(() => setPrimed(true), []);

  const summary = useMemo(() => priceSummary(product, options, qty), [product, options, qty]);

  const value = useMemo<PdpContextValue>(
    () => ({ product, options, update, qty, setQty, summary, changes, primed, prime }),
    [product, options, update, qty, setQty, summary, changes, primed, prime],
  );

  return <PdpContext.Provider value={value}>{children}</PdpContext.Provider>;
}
