import { isCoffee, sizesFor, type Product } from "@/content/products";
import { SITE } from "@/content/site";
import { packagingSrc } from "@/components/product/ProductImage";
import { PdpProvider } from "./PdpProvider";
import { PdpHero } from "./PdpHero";
import { TastingNotes } from "./TastingNotes";
import { OriginBand } from "./OriginBand";
import { GearDetails } from "./GearDetails";
import { BrewGuide } from "./BrewGuide";
import { Faq } from "./Faq";
import { Related } from "./Related";
import "./pdp.css";

/* ==========================================================================
   Product detail page (/shop/[slug]). One layout for coffee and for gear
   and merch:
     hero (sticky stage + configurator)
     coffee: (01) in the cup · (02) origin or blend · (03) brew guide
     gear:   (01) the details · (02) how to use it
     questions · related
   The wrapper is the fly-to-cart scope: add to cart flies the stage art.
   Server components throughout; the client islands are the stage switch,
   the configurator (one shared context), the brew tabs and one scroll scene.
   ========================================================================== */

function JsonLd({ product }: { product: Product }) {
  const prices = isCoffee(product) ? sizesFor(product).map((s) => product.prices[s.id] ?? 0) : [product.price];
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    image: `${SITE.url}${packagingSrc(product)}`,
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: (Math.min(...prices) / 100).toFixed(2),
      highPrice: (Math.max(...prices) / 100).toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="pdp" data-fly-scope>
      <PdpProvider slug={product.slug}>
        <PdpHero product={product} />
      </PdpProvider>

      {isCoffee(product) ? (
        <>
          <TastingNotes coffee={product} />
          <OriginBand coffee={product} />
          <BrewGuide product={product} />
          <Faq product={product} index={4} />
          <Related product={product} index={5} />
        </>
      ) : (
        <>
          <GearDetails gear={product} />
          <BrewGuide product={product} />
          <Faq product={product} index={3} />
          <Related product={product} index={4} />
        </>
      )}

      <span className="block h-px" data-pdp-end aria-hidden="true" />
      <JsonLd product={product} />
    </div>
  );
}
