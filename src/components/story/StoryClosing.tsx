import Link from "next/link";
import type { CSSProperties } from "react";
import { SIGNATURE_COFFEES } from "@/content/products";
import { Photo } from "@/components/photo/Photo";
import { ProductImage } from "@/components/product/ProductImage";
import { Texture } from "@/components/illustration/Texture";
import { ArrowLink, Button } from "@/components/ui/Button";
import "./story.css";

/* ==========================================================================
   Closing: the two next steps after the story. The signature four as a
   fanned shelf of bags (each one a link) with the shop button, and the
   roastery's front door for anyone close enough to visit.
   ========================================================================== */

export function StoryClosing() {
  return (
    <section className="defer-render shell pb-section" aria-labelledby="closing-title">
      <h2 id="closing-title" className="sr-only">
        Where to next
      </h2>
      <div className="grid-editorial gap-y-[var(--spacing-grid)]">
        <div className="story-cta story-cta-shop on-dark col-span-4 md:col-span-7" data-reveal="rise">
          <Texture id="panel-4" className="text-parchment/[0.06]" position="85% 40%" />
          <div className="relative">
            <p className="eyebrow mb-5 text-mist">The signature four</p>
            <h3 className="display text-h1 text-parchment">
              Taste the line <em className="text-peach">for yourself.</em>
            </h3>
            <p className="mt-5 max-w-[38ch] text-body text-mist">
              Four coffees from four of our farms, roasted on Tuesday or Friday and at your door two days later.
            </p>
          </div>
          <ul className="story-cta-bags" aria-label="Signature coffees">
            {SIGNATURE_COFFEES.map((coffee, i) => (
              <li key={coffee.slug} style={{ "--i": i } as CSSProperties}>
                <Link href={`/shop/${coffee.slug}`} className="story-cta-bag" data-cursor="View">
                  <ProductImage product={coffee} alt="" sizes="(min-width: 64rem) 9rem, 22vw" />
                  <span className="story-cta-bag-name">{coffee.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="relative">
            <Button href="/shop?type=coffee" variant="light" size="lg" icon="arrow" magnetic>
              Shop the signature four
            </Button>
          </div>
        </div>

        <div className="story-cta story-cta-visit col-span-4 md:col-span-5" data-reveal="rise" data-reveal-delay="120">
          <div className="story-cta-arch" data-reveal="clip">
            <div>
              <Photo slot="storefront" fill zoom sizes="(min-width: 48rem) 36vw, 92vw" position="50% 46%" />
            </div>
          </div>
          <div>
            <p className="eyebrow mb-5 text-bark">Mill Race Road</p>
            <h3 className="display text-h1">
              Visit <em>the roastery.</em>
            </h3>
            <p className="mt-5 max-w-[34ch] text-body text-bark">
              The café is the warehouse&apos;s front room, a few steps from the drum. Come on a Tuesday or Friday to hear it
              running.
            </p>
            <div className="mt-7">
              <ArrowLink href="/visit" className="text-body">
                Hours and directions
              </ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
