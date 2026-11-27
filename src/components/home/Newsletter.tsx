import { Photo } from "@/components/photo/Photo";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import { NewsletterForm } from "./NewsletterForm";

/* (07) Newsletter: the latte photo opens with a clip reveal beside the form. */
export function Newsletter() {
  return (
    <section className="defer-render shell pb-section" aria-labelledby="newsletter-title">
      <div className="grid-editorial items-center gap-y-12 overflow-hidden rounded-[var(--radius-lg)] bg-linen p-3 md:p-4">
        <div className="col-span-4 md:col-span-5">
          <div className="overflow-hidden rounded-[var(--radius-md)]" data-reveal="clip">
            <Photo slot="latte" sizes="(min-width: 48rem) 40vw, 100vw" zoom />
          </div>
        </div>
        <div className="col-span-4 px-3 pb-8 md:col-span-6 md:col-start-7 md:px-0 md:pr-8 md:pb-0 lg:pr-16">
          <Eyebrow index={7} className="mb-6 text-bark">
            Roast-day letters
          </Eyebrow>
          <Lines id="newsletter-title" className="display text-display-m" lines={["Letters from", <em key="em">the roastery.</em>]} />
          <p className="mt-6 mb-8 max-w-[42ch] text-body text-bark" data-reveal="rise" data-reveal-delay="120">
            What&apos;s in the drum this week, which lots are about to land, and one brew tip worth trying. Short enough to read
            while the kettle boils.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
