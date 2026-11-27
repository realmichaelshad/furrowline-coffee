import { SITE } from "@/content/site";
import { Photo } from "@/components/photo/Photo";
import { Stamp } from "@/components/brand/Stamp";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, Lines } from "@/components/ui/Typography";

/* ==========================================================================
   (04) Story teaser: the roastery photo opens with a clip reveal and drifts
   on its own parallax layer, the sorting close-up moves at a different speed,
   and a roast-day stamp turns on the corner. Copy is short and specific.
   ========================================================================== */

export function StoryTeaser() {
  return (
    <section className="defer-render shell py-section" aria-labelledby="story-title">
      <div className="grid-editorial gap-y-12">
        <div className="relative col-span-4 md:col-span-7">
          <div className="overflow-hidden rounded-[var(--radius-md)]" data-reveal="clip">
            <div data-parallax="0.06" className="scale-[1.12]">
              <Photo slot="roastery" sizes="(min-width: 48rem) 58vw, 100vw" zoom />
            </div>
          </div>
          <Stamp
            spin
            className="absolute -top-10 right-6 size-28 md:-top-14 md:-right-10 md:size-36"
            color="var(--color-parchment)"
            disc="var(--color-clay)"
          />
        </div>

        <div className="col-span-4 flex flex-col justify-center md:col-span-5 md:pl-6 lg:pl-12">
          <Eyebrow index={4} className="mb-6 text-bark">
            The roastery
          </Eyebrow>
          <Lines
            id="story-title"
            className="display text-h1"
            lines={["Roasted in a 1920s", "seed warehouse on", <em key="em">Mill Race Road.</em>]}
          />
          <p className="mt-6 max-w-[42ch] text-body text-bark" data-reveal="rise" data-reveal-delay="120">
            {SITE.founder.name} bought a second-hand fifteen-kilo drum roaster in {SITE.founded} and parked it where the
            town used to keep its seed. Every batch is still roasted on it by hand, by ear and by smell, twice a week.
          </p>
          <div className="mt-8" data-reveal="rise" data-reveal-delay="200">
            <ArrowLink href="/our-story" className="text-body">
              Read our story
            </ArrowLink>
          </div>
        </div>

        <div className="col-span-4 hidden md:col-span-3 md:col-start-2 md:block">
          <div className="overflow-hidden rounded-[var(--radius-md)] md:-mt-28" data-reveal="clip" data-reveal-delay="120">
            <div data-parallax="-0.08">
              <Photo slot="hands-sorting" aspect={4 / 5} sizes="(min-width: 48rem) 24vw, 100vw" zoom />
            </div>
          </div>
        </div>

        <figure className="col-span-4 self-end md:col-span-6 md:col-start-6" data-reveal="rise">
          <blockquote className="display text-h2 italic leading-[1.15] text-espresso">
            “Every farm follows a line: the contour of the hill, the rows raked across the patio. Our job is to keep it
            unbroken all the way to your cup.”
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-3 text-small">
            <span className="relative block size-11 overflow-hidden rounded-full">
              <Photo slot="founder" fill alt="" sizes="44px" position="46% 20%" />
            </span>
            <span>
              <span className="font-semibold">{SITE.founder.name}</span>
              <span className="text-bark"> · {SITE.founder.role}</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
