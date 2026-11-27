import { CONTACT } from "@/content/site";
import { GETTING_HERE } from "@/content/visit";
import { Photo } from "@/components/photo/Photo";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import { TownMap } from "./TownMap";

/* ==========================================================================
   (02) Find us: the illustrated town plan, then the storefront at dusk
   beside the address, phone, email and getting-here notes. Every contact
   detail is on an element with data-contact (showcase captures hide them).
   ========================================================================== */

export function FindUs() {
  const tel = CONTACT.phone.replace(/[^\d]/g, "");
  return (
    <section id="find-us" className="bg-oat py-section" aria-labelledby="find-us-title">
      <div className="shell">
        <div className="grid-editorial mb-12 items-end gap-y-6 md:mb-16">
          <div className="col-span-4 md:col-span-7">
            <Eyebrow index={2} className="mb-6 text-bark">
              Find us
            </Eyebrow>
            <Lines id="find-us-title" className="display text-display-m" lines={["On the corner", <em key="em">of Mill Race Road.</em>]} />
          </div>
          <p className="col-span-4 max-w-[42ch] text-body text-bark md:col-span-4 md:col-start-9" data-reveal="rise" data-reveal-delay="120">
            Ten minutes&apos; walk from the depot, on the north bank of the river. Look for the brick corner with olive
            trees by the door.
          </p>
        </div>

        <TownMap />

        <div className="grid-editorial mt-section-sm gap-y-12">
          <div className="col-span-4 md:col-span-5">
            <div className="visit-store overflow-hidden rounded-[var(--radius-lg)]" data-reveal="clip">
              <div className="scale-[1.1]" data-parallax="0.06">
                <Photo slot="storefront" aspect={4 / 5} zoom sizes="(min-width: 48rem) 40vw, 92vw" position="56% 52%" />
              </div>
            </div>
          </div>

          <div className="col-span-4 md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
            <div id="visit-address" className="scroll-mt-32">
              <p className="eyebrow mb-4 text-bark">The roastery &amp; café</p>
              <address className="display text-h1 not-italic" data-contact>
                {CONTACT.street}
                <br />
                <span className="italic">{CONTACT.locality}</span>
              </address>
            </div>
            <ul className="mt-8 grid gap-3 text-body sm:grid-cols-2" aria-label="Phone and email">
              <li>
                <a href={`tel:${tel}`} className="visit-contact" data-contact>
                  <Icon name="phone" className="size-5 text-clay" />
                  <span className="link-sweep">{CONTACT.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="visit-contact" data-contact>
                  <Icon name="mail" className="size-5 text-clay" />
                  <span className="link-sweep">{CONTACT.email}</span>
                </a>
              </li>
            </ul>

            <h3 className="eyebrow mt-12 mb-2 text-bark">Getting here</h3>
            <ul className="visit-notes">
              {GETTING_HERE.map((note, i) => (
                <li key={note.title} data-reveal="rise" data-reveal-delay={String(i * 80)}>
                  <span className="visit-note-icon" aria-hidden="true">
                    <Icon name={note.icon} />
                  </span>
                  <div>
                    <h4 className="font-sans text-body font-semibold">{note.title}</h4>
                    <p className="mt-1 text-small text-bark">{note.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
