import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import { GUIDE_VERSION } from "./guide-data";
import "./guide-page.css";

/* Compact page top: the sheet is the hero, so the headline stays short and
   the sheet starts inside the first screen on desktop. */
export function BrandGuideHero() {
  return (
    <header className="guide-hero guide-page-shell pt-[calc(var(--header-h)+clamp(2.5rem,6vw,5rem))] pb-[clamp(2rem,4vw,3.25rem)]">
      <div className="grid-editorial items-end gap-y-6">
        <div className="col-span-4 md:col-span-7">
          <Eyebrow className="hero-fade mb-5 text-bark">
            Identity · {GUIDE_VERSION.version} · {GUIDE_VERSION.date}
          </Eyebrow>
          <Lines as="h1" hero lines={["Furrowline", <em key="em">brand guide.</em>]} className="display text-display-m" />
        </div>
        <div className="hero-fade col-span-4 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9" style={{ ["--delay" as string]: "380ms" }}>
          <p className="text-body text-bark">
            The whole identity on one sheet: the furrowed bean and its spacing, twelve colours and four coffees, a
            three-family type system, the packaging and how we sound. Notes for each part follow below.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-small">
            <ArrowLink href="#guide-logo">Read the notes</ArrowLink>
            <ArrowLink href="/brand-board">See it in use</ArrowLink>
          </div>
        </div>
      </div>
    </header>
  );
}
