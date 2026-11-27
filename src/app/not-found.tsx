import type { Metadata } from "next";
import { ArrowLink, Button } from "@/components/ui/Button";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import { FieldIllustration } from "@/components/not-found/FieldIllustration";
import "@/components/not-found/not-found.css";

// Next marks the 404 response noindex itself, so no robots entry here (it would print the tag twice).
export const metadata: Metadata = { title: "Page not found" };

/* Designed 404: "This row runs out here." A ploughed field whose furrows run
   off the frame, and one clay line that stops at a flag. Server-only, no JS. */
export default function NotFound() {
  return (
    <section className="shell pt-[calc(var(--header-h)+clamp(2.5rem,6vw,4.5rem))] pb-section" aria-labelledby="nf-title">
      <div className="grid-editorial items-end gap-y-8">
        <div className="col-span-4 md:col-span-8">
          <Eyebrow className="hero-fade mb-6 text-bark">Error 404 · Page not found</Eyebrow>
          <Lines as="h1" id="nf-title" hero lines={["This row", <em key="em">runs out here.</em>]} className="display text-display-l" />
        </div>
        <div className="hero-fade col-span-4 md:col-span-4 md:pb-3" style={{ ["--delay" as string]: "420ms" }}>
          <p className="max-w-[40ch] text-body text-bark">
            There&apos;s no page at this address. It may have moved, or the link has a typo. Pick up the line from one of
            these instead.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button href="/" icon="arrow" magnetic>
              Back home
            </Button>
            <Button href="/shop" variant="outline">
              Shop coffee
            </Button>
          </div>
          <ArrowLink href="/#find-your-coffee" className="mt-5 text-small">
            Find your coffee in three questions
          </ArrowLink>
        </div>
      </div>

      <div className="nf-frame">
        <FieldIllustration />
        <p className="nf-caption" aria-hidden="true">
          Field notes · the plough stopped here
        </p>
      </div>
    </section>
  );
}
