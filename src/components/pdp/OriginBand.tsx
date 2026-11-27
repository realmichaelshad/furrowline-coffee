import type { CSSProperties } from "react";
import type { CoffeeProduct } from "@/content/products";
import { ORIGINS, formatCoords } from "@/content/origins";
import { PHOTOS, aspectRatio, type PhotoSlot } from "@/content/photos";
import { BLEND_STORIES, ORIGIN_STORIES, STAGE_TEXTURE } from "@/content/pdp";
import { Photo } from "@/components/photo/Photo";
import { Texture } from "@/components/illustration/Texture";
import { Eyebrow, Lines } from "@/components/ui/Typography";

/* ==========================================================================
   (02) A full-bleed band on the coffee's own colour.
   - Single origins: the origin photo in the arch (the window shape from the
     bag label) with a clip reveal and parallax, and the farm facts.
   - Blends: a proportional blend bar whose segments grow in on reveal
     (transform: scaleX), each component listed with its process.
   Text always uses the coffee's ink at full strength on its stage colour.
   ========================================================================== */

/** Rendered width of a photo cover-cropped into the portrait arch (aspect 0.8 desktop, 0.86 phones). */
function archSizes(slot: PhotoSlot): string {
  const ratio = aspectRatio(PHOTOS[slot].aspect);
  const desktop = Math.max(38, Math.round(38 * (ratio / 0.8)));
  const phone = Math.max(92, Math.round(92 * (ratio / 0.86)));
  return `(min-width: 48rem) ${desktop}vw, ${phone}vw`;
}

function Band({
  coffee,
  label,
  children,
}: {
  coffee: CoffeeProduct;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="pdp-band defer-render"
      aria-labelledby="pdp-band-title"
      data-band={label}
      style={{ "--stage": coffee.palette.stage, "--ink": coffee.palette.ink, "--accent": coffee.palette.accent } as CSSProperties}
    >
      <Texture id={STAGE_TEXTURE[coffee.slug] ?? "wide-a"} className="pdp-band-contours" position="70% 50%" />
      <div className="shell relative py-section">{children}</div>
    </section>
  );
}

export function OriginBand({ coffee }: { coffee: CoffeeProduct }) {
  if (coffee.blend) return <BlendBand coffee={coffee} />;
  const origin = coffee.origin;
  const story = ORIGIN_STORIES[coffee.slug];
  if (!origin || !story) return null;
  const stop = ORIGINS.find((o) => o.coffee === coffee.slug);
  const [region, area] = origin.region.split(", ");
  const facts: Array<{ label: string; value: string; wide?: boolean }> = [
    { label: "Country", value: origin.country },
    { label: "Region", value: origin.region },
    { label: "Producer", value: origin.producer, wide: true },
    { label: "Altitude", value: origin.altitude },
    { label: "Varieties", value: origin.varieties.join(", ") },
    { label: "Harvest", value: origin.harvest },
    { label: "Process", value: coffee.processLabel },
  ];

  return (
    <Band coffee={coffee} label="Origin">
      <div className="grid-editorial items-center gap-y-12">
        <div className="col-span-4 md:col-span-5">
          <div className="pdp-arch" data-reveal="clip">
            <div className="pdp-arch-media" data-parallax="0.06">
              {/* A 3:2 photo covering a portrait arch renders ~1.8× the arch width: size for that. */}
              <Photo slot={story.photo} fill zoom sizes={archSizes(story.photo)} />
            </div>
          </div>
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-7">
          <Eyebrow index={2} className="mb-6">
            Origin{stop ? ` · ${formatCoords(stop.lat, stop.lon)}` : ""}
          </Eyebrow>
          <Lines
            id="pdp-band-title"
            className="display text-display-m"
            lines={area ? [`${region},`, `${area},`, <em key="em">{origin.country}.</em>] : [`${region},`, <em key="em">{origin.country}.</em>]}
          />
          <p className="mt-6 max-w-[44ch] text-lead" data-reveal="rise" data-reveal-delay="120">
            {story.lead}
          </p>
          <dl className="pdp-origin-facts" data-reveal="rise" data-reveal-delay="200">
            {facts.map((f) => (
              <div key={f.label} className={f.wide ? "col-span-2" : undefined}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Band>
  );
}

function BlendBand({ coffee }: { coffee: CoffeeProduct }) {
  const blend = coffee.blend ?? [];
  const story = BLEND_STORIES[coffee.slug];
  const tones = [coffee.palette.ink, coffee.palette.accent, coffee.palette.tones[1]];
  const count = ["One", "Two", "Three", "Four"][blend.length - 1] ?? String(blend.length);
  const description = blend.map((b) => `${b.share}% ${b.origin}, ${b.process.toLowerCase()}`).join("; ");

  return (
    <Band coffee={coffee} label="The blend">
      <div className="grid-editorial items-center gap-y-12">
        <div className="col-span-4 md:col-span-5">
          <div className="pdp-blend-photo" data-reveal="clip">
            <div className="pdp-arch-media" data-parallax="0.06">
              <Photo slot={story?.photo ?? "beans-roasting"} fill zoom sizes="(min-width: 48rem) 46vw, 96vw" />
            </div>
          </div>
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-7">
          <Eyebrow index={2} className="mb-6">
            The blend
          </Eyebrow>
          <Lines
            id="pdp-band-title"
            className="display text-display-m"
            lines={[`${count} origins,`, <em key="em">roasted apart.</em>]}
          />
          {story && (
            <p className="mt-6 max-w-[44ch] text-lead" data-reveal="rise" data-reveal-delay="120">
              {story.lead}
            </p>
          )}

          <div className="pdp-blend" data-reveal="fade" data-reveal-delay="160">
            <div className="pdp-blend-bar" role="img" aria-label={`Blend: ${description}.`}>
              {blend.map((b, i) => (
                <span
                  key={b.origin}
                  className="pdp-blend-seg"
                  style={{ flexGrow: b.share, background: tones[i % tones.length], "--i": i } as CSSProperties}
                />
              ))}
            </div>
            <ul className="pdp-blend-list">
              {blend.map((b, i) => (
                <li key={b.origin}>
                  <span className="pdp-blend-share display">
                    {b.share}
                    <span>%</span>
                  </span>
                  <span className="flex items-center gap-2 text-small font-semibold">
                    <span className="pdp-blend-dot" style={{ background: tones[i % tones.length] }} aria-hidden="true" />
                    {b.origin}
                  </span>
                  <span className="text-micro">{b.process} process</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Band>
  );
}
