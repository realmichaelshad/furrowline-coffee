import { isCoffee, type Product } from "@/content/products";
import { COFFEE_FAQ, GEAR_FAQ } from "@/content/pdp";
import { ArrowLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Lines } from "@/components/ui/Typography";

/* ==========================================================================
   Questions, answered with native <details>: keyboard and screen readers
   get disclosure behaviour for free; the plus turns into a cross and the
   answer rises in (transform/opacity).
   ========================================================================== */

export function Faq({ product, index }: { product: Product; index: number }) {
  const items = isCoffee(product) ? COFFEE_FAQ : GEAR_FAQ;
  return (
    <section className="defer-render shell pb-section" aria-labelledby="pdp-faq-title">
      <div className="grid-editorial gap-y-10">
        <div className="col-span-4 md:col-span-4">
          <Eyebrow index={index} className="mb-6 text-bark">
            Questions
          </Eyebrow>
          <Lines id="pdp-faq-title" className="display text-h1" lines={["Good to", <em key="em">know.</em>]} />
          <p className="mt-6 max-w-[34ch] text-body text-bark" data-reveal="rise" data-reveal-delay="120">
            Something else on your mind? Drop by the café in Alder Bend. The roasters are usually behind the bar.
          </p>
          <div className="mt-6" data-reveal="rise" data-reveal-delay="180">
            <ArrowLink href="/visit">Visit the café</ArrowLink>
          </div>
        </div>
        <div className="col-span-4 md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
          <ul className="pdp-faq" data-reveal="rise" data-reveal-delay="120">
            {items.map((item) => (
              <li key={item.q}>
                <details className="pdp-faq-item">
                  <summary>
                    <span className="display text-h3">{item.q}</span>
                    <span className="pdp-faq-icon" aria-hidden="true">
                      <Icon name="plus" className="size-5" />
                    </span>
                  </summary>
                  <p className="pdp-faq-answer">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
