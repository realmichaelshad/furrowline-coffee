import type { CSSProperties } from "react";
import { ORIGINS, formatCoords } from "@/content/origins";
import type { PhotoSlot } from "@/content/photos";
import { getProduct, isCoffee } from "@/content/products";
import { FARMS_LEAD, HOW_WE_BUY } from "@/content/story";
import { Photo } from "@/components/photo/Photo";
import { Texture } from "@/components/illustration/Texture";
import { ArrowLink } from "@/components/ui/Button";
import { SectionIntro } from "@/components/ui/Typography";
import "./story.css";

/* ==========================================================================
   (03) The farms: every origin as an editorial row, each with a photo in an
   arch thumbnail (the bag-label window). Then how we buy.
   ========================================================================== */

/**
 * Regions without an origin photo of their own get a tight detail crop from the harvest shots, so
 * all five rows read as one photographed set.
 */
const FARM_CROPS: Partial<Record<string, { slot: PhotoSlot; position: string; scale: number }>> = {
  cerrado: { slot: "cherries", position: "68% 56%", scale: 1.5 },
  nyeri: { slot: "hands-sorting", position: "78% 50%", scale: 1.7 },
};

function FarmArch({ origin }: { origin: (typeof ORIGINS)[number] }) {
  if (origin.photo) {
    return (
      <span className="farm-arch">
        {/* 3:2 photo in a ~0.8 arch renders ~1.9× the arch width (the arch is ~9rem at most). */}
        <Photo slot={origin.photo} fill alt="" sizes="(min-width: 48rem) 17rem, 9rem" />
      </span>
    );
  }
  const crop = FARM_CROPS[origin.id];
  if (crop) {
    return (
      <span className="farm-arch">
        <Photo slot={crop.slot} fill alt="" position={crop.position} scale={crop.scale} sizes="(min-width: 48rem) 20rem, 12rem" />
      </span>
    );
  }
  const coffee = origin.coffee ? getProduct(origin.coffee) : undefined;
  const palette = coffee && isCoffee(coffee) ? coffee.palette : undefined;
  return (
    <span
      className="farm-arch farm-arch-drawn"
      style={
        {
          "--arch-bg": palette?.stage ?? "var(--color-loam)",
          "--arch-ink": palette?.accent ?? "var(--color-peach)",
        } as CSSProperties
      }
    >
      <Texture id="square-a" position="50% 80%" className="farm-arch-contours" />
      <span className="farm-arch-sun" />
    </span>
  );
}

export function Farms() {
  return (
    <section id="farms" className="defer-render shell pt-section-sm pb-section" aria-labelledby="farms-title">
      <div className="grid-editorial items-end gap-y-8">
        <SectionIntro
          className="col-span-4 md:col-span-7"
          index={3}
          eyebrow="The farms"
          id="farms-title"
          title={["Twelve farms,", <em key="em">five regions.</em>]}
        />
        <p className="col-span-4 text-lead text-bark md:col-span-4 md:col-start-9" data-reveal="rise" data-reveal-delay="160">
          {FARMS_LEAD}
        </p>
      </div>

      <ol className="farm-list">
        {ORIGINS.map((origin, i) => {
          const coffee = origin.coffee ? getProduct(origin.coffee) : undefined;
          return (
            <li key={origin.id} className="farm-row" data-reveal="rise" data-reveal-delay={(i % 3) * 60}>
              <FarmArch origin={origin} />
              <div className="farm-name">
                <h3 className="display farm-title">{origin.name}</h3>
                <p className="eyebrow mt-2 text-bark">
                  {origin.country} · {formatCoords(origin.lat, origin.lon)}
                </p>
              </div>
              <dl className="farm-meta">
                <div>
                  <dt className="eyebrow text-bark">Harvest</dt>
                  <dd>{origin.harvest}</dd>
                </div>
                {coffee && (
                  <div>
                    <dt className="eyebrow text-bark">In the bag</dt>
                    <dd>{coffee.name}</dd>
                  </div>
                )}
              </dl>
              <p className="farm-note text-body text-bark">{origin.note}</p>
              {coffee && (
                <div className="farm-link">
                  <ArrowLink href={`/shop/${coffee.slug}`} className="text-small" aria-label={`Shop ${coffee.name}`}>
                    Shop
                  </ArrowLink>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="buy-panel" data-reveal="rise">
        <Texture id="wide-b" className="text-espresso/[0.06]" />
        <div className="relative grid-editorial gap-y-10">
          <div className="col-span-4 md:col-span-4">
            <p className="eyebrow mb-5 text-bark">How we buy</p>
            <h3 className="display text-h1">
              The same farms, <em>every year.</em>
            </h3>
          </div>
          <ol className="col-span-4 grid gap-8 md:col-span-8 md:grid-cols-3 md:gap-grid">
            {HOW_WE_BUY.map((item, i) => (
              <li key={item.title} className="buy-item">
                <span className="buy-index font-mono text-micro" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="display mt-4 text-h3">{item.title}</h4>
                <p className="mt-3 text-small text-bark">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
