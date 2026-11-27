import { SITE } from "@/content/site";
import { Photo } from "@/components/photo/Photo";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import { OpenNowPill } from "./OpenNowPill";

/* ==========================================================================
   Visit hero. Headline and the live open-now pill, then the café photo in a
   large rounded frame. The frame's mask opens from a smaller rounded rect on
   first paint (CSS only, the photo is visible from frame one, so LCP is never
   held back) while the image settles from a slight push-in. The bar sits on
   the right of the photo, so phones crop to it.
   ========================================================================== */

export function VisitHero() {
  return (
    <header className="visit-hero shell pt-[calc(var(--header-h)+clamp(3rem,8vw,7rem))]">
      <div className="grid-editorial items-end gap-y-8">
        <div className="col-span-4 md:col-span-8">
          <Eyebrow className="hero-fade mb-6 text-bark">
            Visit · {SITE.town}, Oregon
          </Eyebrow>
          <Lines as="h1" hero lines={["Come by", <em key="em">the roastery.</em>]} className="display text-display-l" />
        </div>
        <div className="hero-fade col-span-4 md:col-span-4 md:pb-3" style={{ ["--delay" as string]: "420ms" }}>
          <OpenNowPill />
          <p className="mt-5 max-w-[40ch] text-body text-bark">
            The café is the front room of the roastery: a long oak bar, the drum roaster behind the glass, and whatever we
            roasted that morning in the grinders.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-small">
            <ArrowLink href="#hours">Hours</ArrowLink>
            <ArrowLink href="#find-us">Getting here</ArrowLink>
            <ArrowLink href="#on-the-bar">The menu</ArrowLink>
          </div>
        </div>
      </div>

      <figure className="visit-hero-frame">
        <div className="visit-hero-media">
          <Photo
            slot="cafe-interior"
            fill
            priority
            sizes="(min-width: 90rem) 1328px, (min-width: 40rem) 92vw, 125vw"
            position="62% 50%"
            mediaClassName="visit-hero-zoom"
          />
        </div>
        <figcaption className="visit-hero-caption hero-fade" style={{ ["--delay" as string]: "900ms" }}>
          <span className="eyebrow block text-mist">The front room</span>
          <span className="display mt-0.5 block text-[1.0625rem] text-parchment">
            Saturday, a little after nine
          </span>
        </figcaption>
      </figure>
    </header>
  );
}
