import { Eyebrow, Lines } from "@/components/ui/Typography";
import { Icon } from "@/components/ui/Icon";
import { HoursTable } from "./HoursTable";
import { OpenNowPill } from "./OpenNowPill";

/* (01) Hours: the week as a designed table, today's row filled in. */
export function HoursSection() {
  return (
    <section id="hours" className="shell py-section" aria-labelledby="hours-title">
      <div className="grid-editorial gap-y-12">
        <div className="col-span-4 md:col-span-5 lg:col-span-4">
          <Eyebrow index={1} className="mb-6 text-bark">
            Hours
          </Eyebrow>
          <Lines id="hours-title" className="display text-display-m" lines={["Six days", "a week,", <em key="em">closed Mondays.</em>]} />
          <p className="mt-6 max-w-[38ch] text-body text-bark" data-reveal="rise" data-reveal-delay="120">
            Mondays we cup, clean the roaster and plan the week&apos;s batches. Every other day the bar opens early and the
            kitchen stops when the pastries run out.
          </p>
          <div className="mt-8" data-reveal="rise" data-reveal-delay="180">
            <OpenNowPill />
          </div>
        </div>
        <div className="col-span-4 md:col-span-7 lg:col-span-7 lg:col-start-6" data-reveal="rise" data-reveal-delay="120">
          <HoursTable />
          <p className="mt-5 flex items-start gap-2 text-micro text-bark">
            <Icon name="clock" className="mt-px size-4 shrink-0" />
            <span>
              Pacific time. Holiday hours go up on the door and in the roast-day letter a week ahead.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
