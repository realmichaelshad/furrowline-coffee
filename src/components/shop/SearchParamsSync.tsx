"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { normalizeFilters, parseFilters, type ShopFilters } from "@/lib/shop";

/* ==========================================================================
   Reads ?type=…&roast=… and pushes the parsed filters into the shop's
   state. Renders nothing; it lives inside <Suspense fallback={null}> so the
   static HTML still carries the full, unfiltered grid. Runs on direct loads
   and on soft navigations that only change the query (footer links).
   ========================================================================== */

export function SearchParamsSync({ onChange }: { onChange: (filters: ShopFilters, initial: boolean) => void }) {
  const params = useSearchParams();
  const query = params.toString();
  const first = useRef(true);
  const latest = useRef(onChange);
  latest.current = onChange;

  useEffect(() => {
    latest.current(normalizeFilters(parseFilters(query)), first.current);
    first.current = false;
  }, [query]);

  return null;
}
