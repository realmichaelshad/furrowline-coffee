import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import "@/components/brand-guide/guide-page.css";

/* Compact page top: the board is the hero, so the headline stays short and
   the board starts inside the first screen on desktop. */
export function BrandBoardHero() {
  return (
    <header className="guide-hero guide-page-shell pt-[calc(var(--header-h)+clamp(2.5rem,6vw,5rem))] pb-[clamp(2rem,4vw,3.25rem)]">
      <div className="grid-editorial items-end gap-y-6">
        <div className="col-span-4 md:col-span-7">
          <Eyebrow className="hero-fade mb-5 text-bark">Identity · in use</Eyebrow>
          <Lines as="h1" hero lines={["Brand", <em key="em">board.</em>]} className="display text-display-m" />
        </div>
        <div className="hero-fade col-span-4 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9" style={{ ["--delay" as string]: "380ms" }}>
          <p className="text-body text-bark">
            The furrowed bean on the things people actually hold: a takeaway cup, a 12 oz pouch, a business card and the
            sign over the roastery door. The cup, pouches and cards are drawn in SVG and CSS; the sign is lettered onto a
            photo of the door.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-small">
            <ArrowLink href="#board-notes">Production notes</ArrowLink>
            <ArrowLink href="/brand-guide">Brand guide</ArrowLink>
          </div>
        </div>
      </div>
    </header>
  );
}
