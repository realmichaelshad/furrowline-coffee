import { CONTACT } from "@/content/site";
import { SIGNATURE_COFFEES } from "@/content/products";
import { INQUIRY_COFFEES, NEXT_STEPS, type InquiryCoffee } from "@/content/wholesale";
import { ProductImage } from "@/components/product/ProductImage";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/Typography";
import { InquiryForm, type CoffeeOption } from "./InquiryForm";
import "./wholesale.css";

/* ==========================================================================
   (05) The inquiry: what happens after you send it on the left, the form on
   the right in a raised linen panel, and the wholesale contact details
   underneath for anyone who would rather talk (data-contact, so showcase
   captures can hide them).
   ========================================================================== */

const isInquiryCoffee = (slug: string): slug is InquiryCoffee => (INQUIRY_COFFEES as readonly string[]).includes(slug);

export function Inquiry() {
  const coffees: CoffeeOption[] = SIGNATURE_COFFEES.filter((coffee) => isInquiryCoffee(coffee.slug)).map((coffee) => ({
    slug: coffee.slug as InquiryCoffee,
    name: coffee.name,
    notes: coffee.notes.map((note, i) => (i === 0 ? note : note.toLowerCase())).join(", "),
    art: <ProductImage product={coffee} alt="" sizes="2.75rem" />,
  }));

  return (
    <section id="inquiry" className="shell pb-section" aria-labelledby="inquiry-title">
      <div className="ws-inquiry">
        <div className="ws-inquiry-intro">
          <Eyebrow index={5} className="mb-6 text-bark">
            Inquiry
          </Eyebrow>
          <h2 id="inquiry-title" tabIndex={-1} className="display text-display-m scroll-mt-28">
            Start an <em>inquiry.</em>
          </h2>
          <p className="mt-6 max-w-[38ch] text-lead text-bark">
            Tell us a little about your bar. Nadia or someone from the wholesale team writes back, not a mailing list.
          </p>
          <h3 className="eyebrow mt-10 text-bark">What happens next</h3>
          <ol className="ws-next">
            {NEXT_STEPS.map((step, i) => (
              <li key={step}>
                <span className="ws-next-index" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="text-small">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="ws-inquiry-form">
          <InquiryForm coffees={coffees} />
        </div>
      </div>

      <div className="ws-contact">
        <p className="display text-h3">Rather talk it through?</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 text-body">
          <li>
            <a href={`mailto:${CONTACT.wholesaleEmail}`} className="ws-contact-link" data-contact>
              <Icon name="mail" className="size-5 shrink-0" />
              <span className="link-sweep">{CONTACT.wholesaleEmail}</span>
            </a>
          </li>
          <li>
            <a href={`tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`} className="ws-contact-link" data-contact>
              <Icon name="phone" className="size-5 shrink-0" />
              <span className="link-sweep">{CONTACT.phone}</span>
            </a>
          </li>
        </ul>
        <p className="text-small text-bark">Weekdays, 8 am to 4 pm. Monday mornings we&apos;re at the cupping table.</p>
      </div>
    </section>
  );
}
