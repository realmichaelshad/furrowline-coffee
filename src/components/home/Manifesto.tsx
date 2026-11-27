import type { ReactNode } from "react";
import { getProduct, type CoffeeProduct } from "@/content/products";
import { SITE } from "@/content/site";
import type { PhotoSlot } from "@/content/photos";
import { Photo } from "@/components/photo/Photo";
import { AfterLoad } from "@/components/photo/AfterLoad";
import { ProductImage } from "@/components/product/ProductImage";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Typography";
import { ManifestoScene } from "./ManifestoScene";
import "./manifesto.css";

/* ==========================================================================
   (01) The statement: oversized serif copy with small photo "pills" set in
   the line, read word by word as you scroll (opacity scrub). Without JS or
   with reduced motion every word is simply there at full strength.
   ========================================================================== */

function Words({ text }: { text: string }) {
  return (
    <>
      {text
        .trim()
        .split(/\s+/)
        .map((word, i) => (
          <span key={i} data-w className="manifesto-word">
            {word}{" "}
          </span>
        ))}
    </>
  );
}

function Pill({ slot, children }: { slot?: PhotoSlot; children?: ReactNode }) {
  return (
    <span className="manifesto-pill" data-pill aria-hidden="true">
      <span className="manifesto-pill-inner" data-pill-inner>
        {slot ? (
          <AfterLoad>
            <Photo slot={slot} fill alt="" sizes="(min-width: 48rem) 10rem, 5rem" />
          </AfterLoad>
        ) : (
          children
        )}
      </span>
    </span>
  );
}

export function Manifesto() {
  const deepField = getProduct("deep-field") as CoffeeProduct;
  return (
    <section className="manifesto shell pt-section pb-section-sm" aria-labelledby="manifesto-title">
      <Eyebrow as="h2" index={1} className="mb-10 text-bark">
        <span id="manifesto-title">What we do</span>
      </Eyebrow>
      <ManifestoScene className="manifesto-text display">
        <Words text="Coffee is a farm crop." /> <Pill slot="cherries" />{" "}
        <Words text="We buy it from twelve families we know by name, roast it in small batches" />{" "}
        <Pill slot="beans-roasting" /> <Words text="twice a week, and send it to your door" />{" "}
        <Pill>
          <span className="manifesto-pill-bag">
            <AfterLoad>
              <ProductImage product={deepField} alt="" sizes="(min-width: 48rem) 5rem, 3rem" />
            </AfterLoad>
          </span>
        </Pill>{" "}
        <Words text="while it still smells of the drum." />
      </ManifestoScene>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-6 md:mt-16">
        <div className="flex items-center gap-4">
          <span className="relative block size-14 overflow-hidden rounded-full bg-oat">
            <AfterLoad>
              <Photo slot="founder" fill alt="" sizes="56px" position="46% 20%" />
            </AfterLoad>
          </span>
          <p className="text-small leading-snug">
            <span className="block font-semibold">{SITE.founder.name}</span>
            <span className="text-bark">{SITE.founder.role}</span>
          </p>
        </div>
        <ArrowLink href="/our-story" className="text-body">
          Read our story
        </ArrowLink>
      </div>
    </section>
  );
}
