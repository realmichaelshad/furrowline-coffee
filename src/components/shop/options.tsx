"use client";

import { ROAST_LEVELS } from "@/content/products";
import {
  COUNTRY_OPTIONS,
  ORIGIN_OPTIONS,
  PROCESS_OPTIONS,
  ROAST_OPTIONS,
  type CountryFacet,
  type FacetCounts,
  type OriginFacet,
  type ProcessFacet,
  type ShopFilters,
} from "@/lib/shop";
import type { RoastLevel } from "@/content/products";
import { RoastBars, type FacetOption } from "./FacetChecks";

/* Facet options with live counts, shared by the desktop toolbar and the mobile drawer. */

export function roastOptions(counts: FacetCounts): Array<FacetOption<RoastLevel>> {
  return ROAST_OPTIONS.map((o) => ({
    ...o,
    count: counts.roast[o.value],
    adornment: <RoastBars step={ROAST_LEVELS.find((r) => r.id === o.value)?.step ?? 1} />,
  }));
}

export function countryOptions(counts: FacetCounts): Array<FacetOption<CountryFacet>> {
  return COUNTRY_OPTIONS.map((o) => ({ ...o, count: counts.country[o.value] }));
}

export function originOptions(counts: FacetCounts): Array<FacetOption<OriginFacet>> {
  return ORIGIN_OPTIONS.map((o) => ({ ...o, count: counts.origin[o.value] }));
}

export function processOptions(counts: FacetCounts): Array<FacetOption<ProcessFacet>> {
  return PROCESS_OPTIONS.map((o) => ({ ...o, count: counts.process[o.value] }));
}

/** Why the coffee facets are switched off, or a hint about what picking one does. */
export function coffeeFacetNote(filters: ShopFilters): string {
  if (filters.type === "gear") return "Roast, origin and process describe coffee, so they are off while you browse brewing gear.";
  if (filters.type === "merch") return "Roast, origin and process describe coffee, so they are off while you browse merch.";
  if (filters.type === "all") return "Picking one narrows the list to coffee.";
  return "";
}

export function coffeeFacetsOff(filters: ShopFilters): boolean {
  return filters.type === "gear" || filters.type === "merch";
}
