import { isCoffee, relatedProducts, type Product } from "@/content/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowLink } from "@/components/ui/Button";
import { Eyebrow, Lines } from "@/components/ui/Typography";

/* ==========================================================================
   Related products: three cards (a snap row on phones), with the shop one
   click away so the page never dead-ends.
   ========================================================================== */

export function Related({ product, index }: { product: Product; index: number }) {
  const items = relatedProducts(product.slug, 3);
  const coffee = isCoffee(product);
  return (
    <section className="defer-render pb-section" aria-labelledby="pdp-related-title">
      <div className="shell rule-t pt-section-sm">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow index={index} className="mb-6 text-bark">
              Keep exploring
            </Eyebrow>
            <Lines
              id="pdp-related-title"
              className="display text-h1"
              lines={coffee ? ["More from", <em key="em">the same drum.</em>] : ["Goes well", <em key="em">with this.</em>]}
            />
          </div>
          <div data-reveal="rise" data-reveal-delay="160">
            <ArrowLink href={coffee ? "/shop?type=coffee" : "/shop"} className="text-body">
              {coffee ? "See all coffee" : "See the whole shop"}
            </ArrowLink>
          </div>
        </div>
      </div>
      <ul className="pdp-related" aria-label="Related products">
        {items.map((item, i) => (
          <li key={item.slug} data-reveal="rise" data-reveal-delay={String(i * 90)}>
            <ProductCard product={item} sizes="lg" />
          </li>
        ))}
      </ul>
    </section>
  );
}
