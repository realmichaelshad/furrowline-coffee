import type { GearProduct } from "@/content/products";
import { Texture } from "@/components/illustration/Texture";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import { splitName } from "./PdpHero";

/* ==========================================================================
   (01) Gear and merch: what it is and what it's made of, on an oat band
   with a quiet contour print. The specs are a real definition list.
   ========================================================================== */

export function GearDetails({ gear }: { gear: GearProduct }) {
  const [, rest] = splitName(gear.name);
  return (
    <section className="pdp-gear relative overflow-hidden bg-oat" aria-labelledby="pdp-gear-title">
      <Texture id="wide-b" className="text-espresso/[0.07]" position="20% 40%" />
      <div className="shell relative py-section">
        <div className="grid-editorial gap-y-12">
          <div className="col-span-4 md:col-span-6">
            <Eyebrow index={1} className="mb-6 text-bark">
              The details
            </Eyebrow>
            <Lines
              id="pdp-gear-title"
              className="display text-display-m"
              lines={["Made for", <em key="em">{gear.type === "merch" ? "every day." : "every morning."}</em>]}
            />
            <div className="mt-8 grid max-w-[46ch] gap-4 text-lead text-bark" data-reveal="rise" data-reveal-delay="120">
              {gear.description.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>

          <div className="col-span-4 md:col-span-5 md:col-start-8 md:pt-4">
            <p className="eyebrow mb-4 text-bark">{rest ? `The ${rest.toLowerCase()}` : "Specifications"}</p>
            <dl className="pdp-specs" data-reveal="rise" data-reveal-delay="160">
              {gear.specs.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
              {gear.variants && gear.variants.length > 1 && (
                <div>
                  <dt>Colours</dt>
                  <dd className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
                    {gear.variants.map((v) => (
                      <span key={v.id} className="inline-flex items-center gap-1.5">
                        <span className="pdp-spec-swatch" style={{ background: v.swatch }} aria-hidden="true" />
                        {v.label}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
