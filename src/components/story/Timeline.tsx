import { TIMELINE } from "@/content/story";
import { SectionIntro } from "@/components/ui/Typography";
import "./story.css";

/* ==========================================================================
   (05) Ten years on Mill Race Road. A plain ordered list everywhere: on
   wide screens it runs across in six columns along a line that draws in
   from the left; below that it runs down a rail that draws from the top.
   ========================================================================== */

export function Timeline() {
  return (
    <section id="ten-years" className="defer-render shell py-section" aria-labelledby="timeline-title">
      <div className="grid-editorial items-end gap-y-8">
        <SectionIntro
          className="col-span-4 md:col-span-7"
          index={5}
          eyebrow="Ten years on Mill Race Road"
          id="timeline-title"
          title={["Ten years,", <em key="em">one drum.</em>]}
        />
        <p className="col-span-4 text-lead text-bark md:col-span-4 md:col-start-9" data-reveal="rise" data-reveal-delay="160">
          From forty kilos sold out of the loading door to twelve partner farms. The roaster is the one thing that hasn&apos;t
          changed.
        </p>
      </div>

      <div className="tl">
        <div className="tl-line" data-reveal="clip-x" aria-hidden="true">
          <span />
        </div>
        <ol className="tl-list">
          {TIMELINE.map((item, i) => (
            <li key={item.year} className="tl-item" data-reveal="rise" data-reveal-delay={i * 90}>
              <span className="tl-dot" aria-hidden="true" />
              <h3>
                <span className="display tl-year block">{item.year}</span>
                <span className="mt-3 block font-sans text-body font-semibold">{item.title}</span>
              </h3>
              <p className="mt-2 text-small text-bark">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
