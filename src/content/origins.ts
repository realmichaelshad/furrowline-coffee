import type { PhotoSlot } from "./photos";

/* ==========================================================================
   Where the coffee comes from, for the origin route map (Home) and the
   sourcing story (Our Story). Coordinates are real regions; the farms and
   people are invented for this concept.
   ========================================================================== */

export interface OriginStop {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  /** Signature coffee grown here, if any. */
  coffee?: string;
  photo?: PhotoSlot;
  harvest: string;
  /** Short line in the brand voice. */
  note: string;
}

export const ROASTERY = {
  id: "alder-bend",
  name: "Alder Bend",
  country: "Oregon, USA",
  lat: 44.6,
  lon: -123.1,
  photo: "roastery" as PhotoSlot,
  note: "Roasted Tuesdays and Fridays in a 1920s seed warehouse.",
};

export const ORIGINS: OriginStop[] = [
  {
    id: "guji",
    name: "Guji",
    country: "Ethiopia",
    lat: 5.9,
    lon: 38.9,
    coffee: "first-light",
    photo: "origin-ethiopia",
    harvest: "Nov to Jan",
    note: "640 smallholder families deliver cherry to one washing station.",
  },
  {
    id: "huila",
    name: "Huila",
    country: "Colombia",
    lat: 2.0,
    lon: -75.9,
    coffee: "honey-ridge",
    photo: "origin-colombia",
    harvest: "Apr to Jun",
    note: "The Quintero family's honey lots, picked ripe and dried on raised beds.",
  },
  {
    id: "huehuetenango",
    name: "Huehuetenango",
    country: "Guatemala",
    lat: 15.3,
    lon: -91.5,
    coffee: "highland-almanac",
    photo: "origin-guatemala",
    harvest: "Jan to Mar",
    note: "Twenty-two neighbouring families, sun-drying on patios beside their homes.",
  },
  {
    id: "cerrado",
    name: "Cerrado",
    country: "Brazil",
    lat: -18.6,
    lon: -46.9,
    coffee: "deep-field",
    harvest: "May to Sep",
    note: "Naturals for body in our house espresso.",
  },
  {
    id: "nyeri",
    name: "Nyeri",
    country: "Kenya",
    lat: -0.4,
    lon: 36.9,
    coffee: "harvest-lantern",
    harvest: "Oct to Dec",
    note: "Sixty bags a season, when we can get them.",
  },
];

/* Route map projections (equirectangular crops of the coffee belt), shared by
   the map component and the "route-hills" textures so they line up.
   - ROUTE_MAP: tablets and up.
   - ROUTE_MAP_PHONE: the same stops with latitude drawn about 1.8× taller, so
     on a narrow screen the arcs, pins and belt have room to read. Points are
     projected, never scaled, so dots and pins stay round. */
export interface RouteMapSpec {
  width: number;
  height: number;
  latTop: number;
  latSpan: number;
  lonLeft: number;
  lonSpan: number;
}

export const ROUTE_MAP = { width: 1200, height: 640, latTop: 56, latSpan: 88, lonLeft: -140, lonSpan: 192 } as const satisfies RouteMapSpec;
export const ROUTE_MAP_PHONE = { width: 1200, height: 1080, latTop: 54, latSpan: 82, lonLeft: -136, lonSpan: 186 } as const satisfies RouteMapSpec;

export function projectOn(m: RouteMapSpec, lat: number, lon: number): [number, number] {
  return [((lon - m.lonLeft) / m.lonSpan) * m.width, ((m.latTop - lat) / m.latSpan) * m.height];
}

export function projectRoute(lat: number, lon: number): [number, number] {
  return projectOn(ROUTE_MAP, lat, lon);
}

/** Formats a coordinate pair as "5.9°N 38.9°E". */
export function formatCoords(lat: number, lon: number): string {
  const ns = `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? "N" : "S"}`;
  const ew = `${Math.abs(lon).toFixed(1)}°${lon >= 0 ? "E" : "W"}`;
  return `${ns} ${ew}`;
}
