import { getProduct, type Product } from "@/content/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { SectionIntro } from "@/components/ui/Typography";

/* (06) Also on the shelf: the rest of the range as product cards (hover
   lift, quick add, View cursor). A snap row on phones, four up on desktop. */

const SLUGS = ["harvest-lantern", "slow-acre-decaf", "field-day", "contour-dripper"];

export function Shelf() {
  const products = SLUGS.map((slug) => getProduct(slug)).filter((p): p is Product => Boolean(p));
  return (
    <section className="defer-render py-section" aria-labelledby="shelf-title">
      <div className="shell">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <SectionIntro index={6} eyebrow="Also on the shelf" id="shelf-title" title={["Seasonal lots,", "decaf and gear."]} />
          <Button href="/shop" variant="outline" icon="arrow" data-reveal="rise">
            Shop everything
          </Button>
        </div>
      </div>
      <ul className="shelf-row no-scrollbar">
        {products.map((product, i) => (
          <li key={product.slug} data-reveal="rise" data-reveal-delay={String(i * 90)}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
