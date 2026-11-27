import { SITE } from "@/content/site";
import { FOUNDER } from "@/content/story";
import { Photo } from "@/components/photo/Photo";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import "./story.css";

/* ==========================================================================
   (01) The founder. Nadia's portrait at five columns (clip reveal, slow
   counter-parallax) against her story at six, with a pull quote in display
   italic and three numbers from the roastery floor.
   ========================================================================== */

export function Founder() {
  return (
    <section id="founder" className="shell pt-section-sm pb-section-sm" aria-labelledby="founder-title">
      <div className="grid-editorial gap-y-14">
        <div className="story-founder-col col-span-4 md:col-span-5">
          <figure className="story-founder">
            <div className="story-founder-frame" data-reveal="clip">
              <div data-parallax="-0.05" className="scale-[1.08]">
                <Photo slot="founder" aspect={4 / 5} zoom sizes="(min-width: 90rem) 544px, (min-width: 48rem) 40vw, 92vw" />
              </div>
            </div>
            <figcaption className="story-founder-tag">
              <span className="display block text-[1.125rem] leading-tight">{SITE.founder.name}</span>
              <span className="eyebrow mt-1 block text-bark">{SITE.founder.role}</span>
            </figcaption>
          </figure>
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-7 md:pt-10">
          <Eyebrow index={1} className="mb-6 text-bark">
            The founder
          </Eyebrow>
          <Lines
            id="founder-title"
            className="display text-h1"
            lines={[FOUNDER.title[0], <em key="em">{FOUNDER.title[1]}</em>]}
          />
          <div className="mt-8 grid max-w-[60ch] gap-5 text-body text-bark">
            {FOUNDER.paragraphs.map((p, i) => (
              <p key={i} data-reveal="rise" data-reveal-delay={i === 0 ? 120 : undefined}>
                {p}
              </p>
            ))}
          </div>

          <figure className="story-quote" data-reveal="rise">
            <span className="story-quote-mark" aria-hidden="true">
              “
            </span>
            <blockquote>
              <p className="display text-h2 italic">{FOUNDER.quote}</p>
            </blockquote>
            <figcaption className="mt-5 text-small">
              <span className="font-semibold">{SITE.founder.name}</span>
              <span className="text-bark">, on roasting by ear</span>
            </figcaption>
          </figure>

          <dl className="story-facts">
            {FOUNDER.facts.map((fact, i) => (
              <div key={fact.label} data-reveal="rise" data-reveal-delay={i * 80}>
                <dt className="text-micro text-bark">{fact.label}</dt>
                <dd className="display story-facts-value">
                  {fact.value}
                  {fact.unit && <span className="story-facts-unit"> {fact.unit}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
