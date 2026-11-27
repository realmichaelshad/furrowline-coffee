import { OFFER } from "@/content/wholesale";
import { Icon } from "@/components/ui/Icon";
import { SectionIntro } from "@/components/ui/Typography";
import "./wholesale.css";

/* ==========================================================================
   (01) What a wholesale account gets: four columns on hairline rules, each
   with its glyph in a ring, the promise, the detail and one plain-spoken
   line in mono at the foot.
   ========================================================================== */

export function Offer() {
  return (
    <section className="shell py-section" aria-labelledby="offer-title">
      <div className="grid-editorial items-end gap-y-8">
        <SectionIntro
          className="col-span-4 md:col-span-7"
          index={1}
          eyebrow="What you get"
          id="offer-title"
          title={["Coffee, training", <em key="em">and a roaster on call.</em>]}
        />
        <p className="col-span-4 text-lead text-bark md:col-span-4 md:col-start-9" data-reveal="rise" data-reveal-delay="160">
          One account covers the coffee, the people pulling it and the kit it runs through. No contracts, no minimum term,
          one weekly order.
        </p>
      </div>

      <ul className="ws-offer">
        {OFFER.map((item, i) => (
          <li key={item.title} className="ws-offer-item" data-reveal="rise" data-reveal-delay={i * 90}>
            <span className="ws-offer-icon" aria-hidden="true">
              <Icon name={item.icon} className="size-6" />
            </span>
            <h3 className="display mt-7 text-h3">{item.title}</h3>
            <p className="mt-3 text-small text-bark">{item.body}</p>
            <p className="ws-offer-meta eyebrow">{item.meta}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
