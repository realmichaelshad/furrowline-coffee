import type { CoffeeProduct } from "@/content/products";
import { Eyebrow } from "@/components/ui/Typography";
import { TasteMeter } from "@/components/ui/Meters";
import { NotesScene } from "./NotesScene";

/* ==========================================================================
   (01) In the cup. The three notes set as oversized type in a staircase,
   drifting into place as the section arrives (NotesScene), with the taste
   profile, the story of the lot and a facts strip.
   ========================================================================== */

export function TastingNotes({ coffee }: { coffee: CoffeeProduct }) {
  const [a, b, c] = coffee.notes;
  return (
    <section className="shell py-section" aria-labelledby="pdp-notes-title">
      <NotesScene className="grid-editorial gap-y-14">
        <div className="col-span-4 md:col-span-7">
          <Eyebrow index={1} className="mb-8 text-bark">
            In the cup
          </Eyebrow>
          <h2 id="pdp-notes-title" className="pdp-notes-big display" data-reveal="lines">
            <span className="sr-only">Tasting notes: </span>
            {[`${a},`, `${b.toLowerCase()} &`, c.toLowerCase()].map((line, i) => (
              <span key={line} className="line-mask" data-note-line style={{ ["--step" as string]: i }}>
                <span className="line-inner" style={{ ["--line-index" as string]: i }}>
                  {i === 2 ? <em>{line}</em> : line}
                  <sup className="pdp-notes-index" aria-hidden="true">
                    0{i + 1}
                  </sup>
                </span>
              </span>
            ))}
          </h2>
        </div>

        <div className="col-span-4 md:col-span-5 md:col-start-8 md:pt-16 lg:col-span-4 lg:col-start-9">
          <div data-taste data-reveal="rise">
            <p className="eyebrow mb-4 text-bark">Taste profile</p>
            <TasteMeter profile={coffee.profile} className="text-espresso" />
          </div>
          <div className="mt-10 grid gap-4 text-body text-bark" data-reveal="rise" data-reveal-delay="120">
            {coffee.description.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>

        <dl className="pdp-facts col-span-4 md:col-span-12">
          {coffee.facts.map((fact, i) => (
            <div key={fact.label} data-reveal="rise" data-reveal-delay={String(i * 90)}>
              <dt className="eyebrow text-bark">{fact.label}</dt>
              <dd className="display mt-3 text-h3">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </NotesScene>
    </section>
  );
}
