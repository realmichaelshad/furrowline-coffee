import type { CSSProperties } from "react";
import { SUBSCRIPTION_INTERVALS, getProduct, type CoffeeProduct } from "@/content/products";
import { SUBSCRIPTION_DISCOUNT } from "@/content/site";
import { ProductImage } from "@/components/product/ProductImage";
import { Texture } from "@/components/illustration/Texture";
import { ArrowLink, Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/* ==========================================================================
   Editorial tile (b): subscribe and save. Moss is the subscription colour.
   A container query lays it out as a wide band (full grid width) or as a
   tall card when it shares a row with two products (3-column layout).
   The twelve-week calendar shows what each rhythm means in bags.
   Server component, passed into the shop island as a prop.
   ========================================================================== */

const WEEKS = 12;

function DeliveryCalendar() {
  const summary = SUBSCRIPTION_INTERVALS.map((every) => `every ${every} weeks is ${Math.ceil(WEEKS / every)} bags`).join(", ");
  return (
    <figure className="sub-cal" data-reveal="fade" data-reveal-delay="120">
      <figcaption className="eyebrow mb-3 flex items-center justify-between gap-4">
        <span>The next 12 weeks</span>
        <span aria-hidden="true">Bags</span>
      </figcaption>
      <div role="img" aria-label={`Over twelve weeks, ${summary}.`} className="grid gap-2.5">
        {SUBSCRIPTION_INTERVALS.map((every, row) => (
          <div key={every} className="sub-cal-row" aria-hidden="true">
            <span className="sub-cal-label">{every} wk</span>
            <span className="sub-cal-track">
              {Array.from({ length: WEEKS }, (_, week) => (
                <span
                  key={week}
                  className="sub-cal-dot"
                  data-on={week % every === 0 || undefined}
                  style={{ "--i": row * 3 + week } as CSSProperties}
                />
              ))}
            </span>
            <span className="sub-cal-total">{Math.ceil(WEEKS / every)}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function SubscribeBand() {
  const coffee = getProduct("highland-almanac") as CoffeeProduct;
  const percent = Math.round(SUBSCRIPTION_DISCOUNT * 100);
  // Lands on the product page with subscribe-and-save already chosen (every 2 weeks).
  const href = `/shop/${coffee.slug}?plan=sub2`;
  return (
    <article className="sub-band on-dark" aria-labelledby="sub-band-title">
      <Texture id="wide-b" className="text-parchment/[0.07]" />
      <div className="sub-band-copy">
        <p className="eyebrow flex items-center gap-2">
          <Icon name="repeat" className="size-4" />
          Subscribe &amp; save
        </p>
        <h3 id="sub-band-title" className="sub-band-title display">
          Every 2, 3 or 4 weeks. <em>{percent}% off every bag.</em>
        </h3>
        <p className="sub-band-lead">
          Skip or cancel any time. Roasted the morning it ships, and the price stays put while you stay.
        </p>
        <div className="sub-band-cta-wide">
          <Button href={href} variant="light" icon="arrow" magnetic>
            Subscribe to {coffee.name}
          </Button>
        </div>
        <div className="sub-band-cta-narrow">
          <ArrowLink href={href} className="text-small">
            Subscribe to {coffee.name}
          </ArrowLink>
        </div>
      </div>
      <DeliveryCalendar />
      <div className="sub-band-bag" aria-hidden="true">
        <ProductImage product={coffee} alt="" sizes="(min-width: 40rem) 220px, 1px" />
      </div>
    </article>
  );
}
