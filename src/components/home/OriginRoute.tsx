import type { CSSProperties } from "react";
import {
  ORIGINS,
  ROASTERY,
  ROUTE_MAP,
  ROUTE_MAP_PHONE,
  formatCoords,
  projectOn,
  projectRoute as project,
  type OriginStop,
  type RouteMapSpec,
} from "@/content/origins";
import { STATS } from "@/content/site";
import { getProduct } from "@/content/products";
import { Photo } from "@/components/photo/Photo";
import { AfterLoad } from "@/components/photo/AfterLoad";
import { Mark } from "@/components/brand/Mark";
import { Texture } from "@/components/illustration/Texture";
import { SectionIntro } from "@/components/ui/Typography";
import { RouteScene } from "./RouteScene";
import "./route.css";

/* ==========================================================================
   (03) The route. A cartographic sketch of the coffee belt: latitude lines,
   the band between the tropics, a contour hill at each origin, and a line
   from every farm to the roastery that draws itself as you scroll
   (stroke-dashoffset). Counters count up underneath. The map is decorative;
   the stops are a real list for screen readers (and for phones).
   Phones get their own, taller drawing of the same map (ROUTE_MAP_PHONE):
   numbered pins that match the numbered list under it, the belt and its
   latitude labels set large enough to read.
   ========================================================================== */

const W = ROUTE_MAP.width;
const H = ROUTE_MAP.height;

/** Photo stops, numbered 1-3 on the phone map and in the list under it. */
const FEATURED = ORIGINS.filter((o) => o.photo);

/** A cubic arc from an origin up and over to the roastery, shaped on the wide map and stretched to fit `m`. */
function routePath(o: OriginStop, m: RouteMapSpec = ROUTE_MAP): string {
  const [x, y] = projectOn(m, o.lat, o.lon);
  const [hx, hy] = projectOn(m, ROASTERY.lat, ROASTERY.lon);
  const sx = m.width / m.lonSpan / (ROUTE_MAP.width / ROUTE_MAP.lonSpan);
  const sy = m.height / m.latSpan / (ROUTE_MAP.height / ROUTE_MAP.latSpan);
  const far = o.lon > 0;
  const c1 = far ? [x - 260 * sx, y - 330 * sy] : [x - 50 * sx, y - 120 * sy];
  const c2 = far ? [hx + 360 * sx, hy - 110 * sy] : [hx + 90 * sx, hy + 20 * sy];
  return `M${x.toFixed(1)} ${y.toFixed(1)}C${c1[0]!.toFixed(1)} ${c1[1]!.toFixed(1)} ${c2[0]!.toFixed(1)} ${c2[1]!.toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)}`;
}

const LATITUDES = [
  { lat: 45, label: "45°N" },
  { lat: 23.44, label: "Tropic of Cancer" },
  { lat: 0, label: "Equator" },
  { lat: -23.44, label: "Tropic of Capricorn" },
];

function RouteMap() {
  const cancer = project(23.44, 0)[1];
  const capricorn = project(-23.44, 0)[1];
  const home = project(ROASTERY.lat, ROASTERY.lon);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="route-svg route-svg-wide" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="belt-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>

      {/* graticule */}
      <g className="route-grid">
        {Array.from({ length: 10 }, (_, i) => {
          const x = project(0, -140 + i * 20)[0];
          return <line key={i} x1={x} x2={x} y1="0" y2={H} />;
        })}
      </g>

      {/* the coffee belt */}
      <rect x="0" y={cancer} width={W} height={capricorn - cancer} fill="url(#belt-hatch)" className="route-belt" />
      <text x={W - 16} y={cancer + 24} textAnchor="end" className="route-belt-label">
        THE COFFEE BELT
      </text>

      {LATITUDES.map((l) => {
        const y = project(l.lat, 0)[1];
        return (
          <g key={l.label} className="route-lat">
            <line x1="0" x2={W} y1={y} y2={y} />
            <text x="10" y={y - 7}>
              {l.label.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* routes: faint full path + the drawn line on top */}
      {ORIGINS.map((o) => (
        <path key={`${o.id}-ghost`} d={routePath(o)} className="route-ghost" />
      ))}
      {ORIGINS.map((o) => (
        <path key={o.id} d={routePath(o)} pathLength={1} className="route-line" data-route />
      ))}

      {ORIGINS.filter((o) => !o.photo).map((o) => {
        const [x, y] = project(o.lat, o.lon);
        return (
          <text key={`${o.id}-name`} x={x + 16} y={y + 4} className="route-minor-label">
            {o.name.toUpperCase()}, {o.country.toUpperCase()}
          </text>
        );
      })}

      {ORIGINS.map((o) => {
        const [x, y] = project(o.lat, o.lon);
        return (
          <g key={`${o.id}-dot`} className="route-dot" data-route-dot>
            <circle cx={x} cy={y} r="9" className="route-dot-halo" />
            <circle cx={x} cy={y} r="4.5" />
          </g>
        );
      })}

      <g className="route-home" data-route-home>
        <circle cx={home[0]} cy={home[1]} r="18" className="route-home-halo" />
        <circle cx={home[0]} cy={home[1]} r="7" />
      </g>
    </svg>
  );
}

/**
 * Phones: the same map drawn on ROUTE_MAP_PHONE (taller), with type and pins
 * sized for a ~360 px wide screen (1 unit ≈ 0.3 px): numbered pins for the
 * three photo stops, small dots for the others, and the roastery labelled.
 */
function PhoneRouteMap() {
  const m = ROUTE_MAP_PHONE;
  const at = (lat: number, lon: number) => projectOn(m, lat, lon);
  const cancer = at(23.44, 0)[1];
  const capricorn = at(-23.44, 0)[1];
  const [hx, hy] = at(ROASTERY.lat, ROASTERY.lon);
  return (
    <svg viewBox={`0 0 ${m.width} ${m.height}`} className="route-svg route-svg-phone" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="belt-hatch-phone" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1="0" y1="0" x2="0" y2="26" stroke="currentColor" strokeWidth="2.6" />
        </pattern>
      </defs>

      <rect x="0" y={cancer} width={m.width} height={capricorn - cancer} fill="url(#belt-hatch-phone)" className="route-belt" />
      {LATITUDES.slice(1).map((l) => {
        const y = at(l.lat, 0)[1];
        return (
          <g key={l.label} className="route-lat">
            <line x1="0" x2={m.width} y1={y} y2={y} />
          </g>
        );
      })}

      {ORIGINS.map((o) => (
        <path key={`${o.id}-ghost`} d={routePath(o, m)} className="route-ghost" />
      ))}
      {ORIGINS.map((o) => (
        <path key={o.id} d={routePath(o, m)} pathLength={1} className="route-line" data-route />
      ))}

      {ORIGINS.filter((o) => !o.photo).map((o) => {
        const [x, y] = at(o.lat, o.lon);
        return (
          <g key={`${o.id}-dot`} className="route-dot" data-route-dot>
            <circle cx={x} cy={y} r="24" className="route-dot-halo" />
            <circle cx={x} cy={y} r="12" />
          </g>
        );
      })}
      {FEATURED.map((o, i) => {
        const [x, y] = at(o.lat, o.lon);
        return (
          <g key={`${o.id}-pin`} className="route-pin" data-route-dot>
            <circle cx={x} cy={y} r="52" className="route-dot-halo" />
            <circle cx={x} cy={y} r="36" className="route-pin-disc" />
            <text x={x} y={y + 13} textAnchor="middle" className="route-pin-num">
              {i + 1}
            </text>
          </g>
        );
      })}

      <g className="route-home" data-route-home>
        <circle cx={hx} cy={hy} r="40" className="route-home-halo" />
        <circle cx={hx} cy={hy} r="17" />
      </g>
      {/* Type last, over the lines, each on a halo in the map colour. */}
      {LATITUDES.slice(1).map((l) => (
        <text key={l.label} x="18" y={at(l.lat, 0)[1] - 20} className="route-lat-label">
          {l.label.toUpperCase()}
        </text>
      ))}
      <text x={m.width - 18} y={cancer + 62} textAnchor="end" className="route-belt-label">
        THE COFFEE BELT
      </text>
      <text x={hx + 62} y={hy + 12} className="route-home-label">
        {ROASTERY.name.toUpperCase()} · THE ROASTERY
      </text>
    </svg>
  );
}

/** On tablets the map is too short for Huila's label to sit under Huehuetenango's: it flips to the left. */
const TABLET_LEFT = new Set(["huila"]);

/** Photo labels pinned on the map (tablets and up). */
function MapLabels() {
  const featured = FEATURED;
  const pos = (lat: number, lon: number) => {
    const [x, y] = project(lat, lon);
    return { left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` } as CSSProperties;
  };
  return (
    <div className="route-labels" aria-hidden="true">
      {featured.map((o) => {
        const coffee = o.coffee ? getProduct(o.coffee) : undefined;
        return (
          <div
            key={o.id}
            className="route-label"
            data-route-label
            data-side={o.lon > 0 ? "left" : "right"}
            data-tablet-side={TABLET_LEFT.has(o.id) ? "left" : undefined}
            style={pos(o.lat, o.lon)}
          >
            <span className="route-label-photo" data-route-photo>
              <Photo slot={o.photo!} fill alt="" sizes="72px" />
            </span>
            <span className="route-label-text">
              <span className="display block text-[1.25rem] leading-tight">{o.name}</span>
              <span className="block font-mono text-[0.6875rem] tracking-[0.12em] text-mist">{formatCoords(o.lat, o.lon)}</span>
              {coffee && <span className="mt-0.5 block text-micro italic text-peach">{coffee.name}</span>}
            </span>
          </div>
        );
      })}
      <div className="route-label route-label-home" data-route-label data-side="right" style={pos(ROASTERY.lat, ROASTERY.lon)}>
        <span className="route-label-photo" data-route-photo>
          <Photo slot={ROASTERY.photo} fill alt="" sizes="72px" />
        </span>
        <span className="route-label-text">
          <span className="display block text-[1.25rem] leading-tight">{ROASTERY.name}</span>
          <span className="block font-mono text-[0.6875rem] tracking-[0.12em] text-mist">{formatCoords(ROASTERY.lat, ROASTERY.lon)}</span>
          <span className="mt-0.5 block text-micro italic text-peach">The roastery</span>
        </span>
      </div>
    </div>
  );
}

const COUNTERS = [
  { value: STATS.partnerFarms, unit: "", label: "Partner farms in five countries" },
  { value: STATS.kgPerWeek, unit: "kg", label: "Roasted every week, 15 kg at a time" },
  { value: STATS.roastToDoorDays, unit: "days", label: "From the drum to your door" },
];

export function OriginRoute() {
  return (
    <section className="route on-dark" aria-labelledby="route-title">
      <RouteScene className="shell py-section">
        <div className="grid-editorial items-end gap-y-8">
          <SectionIntro
            className="col-span-4 md:col-span-7"
            index={3}
            eyebrow="The route"
            id="route-title"
            title={["Twelve farms.", "One line home."]}
          />
          <p className="col-span-4 text-lead text-mist md:col-span-4 md:col-start-9" data-reveal="rise" data-reveal-delay="160">
            We buy direct, pay well above market, and go back every harvest. The same farms, year after year,
            following the line from their slopes to our drum.
          </p>
        </div>

        <div className="route-map" data-route-map>
          <Texture id="route-hills" fit="fill" className="route-hills route-hills-wide" />
          <Texture id="route-hills-phone" fit="fill" className="route-hills route-hills-phone" />
          <RouteMap />
          <PhoneRouteMap />
          <MapLabels />
        </div>

        <ol className="route-stops md:sr-only" aria-label="Where our coffee grows">
          {FEATURED.map((o, i) => (
            <li key={o.id} className="route-stop">
              <span className="relative block size-16 shrink-0">
                <span className="relative block size-full overflow-hidden rounded-full bg-loam">
                  <AfterLoad>
                    <Photo slot={o.photo!} fill alt="" sizes="64px" />
                  </AfterLoad>
                </span>
                <span className="route-stop-num" aria-hidden="true">
                  {i + 1}
                </span>
              </span>
              <span>
                <span className="display block text-[1.375rem] leading-tight">
                  {o.name}, {o.country}
                </span>
                <span className="block font-mono text-micro text-mist">
                  {formatCoords(o.lat, o.lon)} · Harvest {o.harvest}
                </span>
                <span className="mt-1 block text-small text-mist">{o.note}</span>
              </span>
            </li>
          ))}
          <li className="route-stop">
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-clay">
              <Mark className="h-8 w-auto" color="var(--color-parchment)" />
            </span>
            <span>
              <span className="display block text-[1.375rem] leading-tight">{ROASTERY.name}, Oregon</span>
              <span className="mt-1 block text-small text-mist">{ROASTERY.note}</span>
            </span>
          </li>
        </ol>

        <dl className="route-counters">
          {COUNTERS.map((c) => (
            <div key={c.label} className="route-counter" data-reveal="rise">
              <dt className="eyebrow text-mist">{c.label}</dt>
              <dd className="display route-counter-value">
                <span className="sr-only">
                  {c.value} {c.unit}
                </span>
                <span aria-hidden="true">
                  <span data-count={c.value}>{c.value}</span>
                  {c.unit && <span className="route-counter-unit">{c.unit}</span>}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </RouteScene>
    </section>
  );
}
