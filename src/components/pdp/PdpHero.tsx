import Link from "next/link";
import { ROAST_LEVELS, isCoffee, type Product } from "@/content/products";
import { PHOTOS, aspectRatio } from "@/content/photos";
import { ORIGINS, formatCoords } from "@/content/origins";
import { SHIPPING } from "@/content/site";
import { STAGE_TEXTURE, STAGE_VIEWS } from "@/content/pdp";
import { Photo } from "@/components/photo/Photo";
import { Texture } from "@/components/illustration/Texture";
import { ProductBadge } from "@/components/ui/Badge";
import { RoastMeter } from "@/components/ui/Meters";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Lines } from "@/components/ui/Typography";
import { cardStage } from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/cn";
import { Stage } from "./Stage";
import { Configurator, PriceTag } from "./Configurator";
import { BuyBar } from "./BuyBar";

/* ==========================================================================
   Top of the product page. Desktop: the stage sticks on the left while the
   configurator column scrolls past it. Phones and tablets: the stage comes
   first (not sticky), then the details, with the buy bar taking over once
   the main button has scrolled away.
   Entrances are CSS from first paint (the stage opens, the bag rises, the
   name rises line by line); the bag is never transparent, so LCP is not
   held back.
   ========================================================================== */

const TYPE_LABEL = { coffee: "Coffee", gear: "Brewing gear", merch: "Merch" } as const;

/** Rendered width of a cover-cropped photo in the stage, by its aspect ratio. */
function stagePhotoSizes(ratio: number): string {
  // Desktop stage: ~46-53vw wide and (100vh - 7.5rem) tall. Phones: ~92vw square-ish.
  if (ratio > 1.2) return "(min-width: 64rem) calc((100vh - 7.5rem) * 1.5), 140vw";
  if (ratio > 0.9) return "(min-width: 64rem) calc(100vh - 7.5rem), 96vw";
  return "(min-width: 64rem) 54vw, 92vw";
}

/** "First Light" → ["First", "Light"]; the second part is set in italic. */
export function splitName(name: string): [string, string] {
  const [first = name, ...rest] = name.split(" ");
  return [first, rest.join(" ")];
}

function Reassurance({ product }: { product: Product }) {
  const items: Array<{ icon: IconName; text: string }> = isCoffee(product)
    ? [
        { icon: "flame", text: `Roasted ${product.facts.find((f) => f.label === "Roasted")?.value.replace("&", "and") ?? "twice a week"}` },
        { icon: "clock", text: "Ships within 48 hours" },
        { icon: "truck", text: `Free shipping over ${formatPrice(SHIPPING.freeOver, { compact: true })}` },
      ]
    : [
        { icon: "clock", text: "Ships within 48 hours" },
        { icon: "truck", text: `Free shipping over ${formatPrice(SHIPPING.freeOver, { compact: true })}` },
        { icon: "repeat", text: "30-day returns" },
      ];
  return (
    <ul className="pdp-reassure" aria-label="Delivery">
      {items.map((item) => (
        <li key={item.text}>
          <Icon name={item.icon} className="size-[1.125rem] shrink-0 text-clay" />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function Meta({ product }: { product: Product }) {
  if (!isCoffee(product)) {
    return (
      <dl className="pdp-meta">
        {product.specs.slice(0, 3).map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <>
      <dl className="pdp-meta">
        <div>
          <dt>Roast</dt>
          <dd className="flex items-center gap-2">
            <RoastMeter roast={product.roast} showLabel={false} />
            <span aria-hidden="true">{ROAST_LEVELS.find((r) => r.id === product.roast)?.label}</span>
          </dd>
        </div>
        <div>
          <dt>Origin</dt>
          <dd>{product.originLabel}</dd>
        </div>
        <div>
          <dt>Process</dt>
          <dd>{product.processLabel}</dd>
        </div>
      </dl>
      <ul className="pdp-notes" aria-label="Tasting notes">
        {product.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </>
  );
}

export function PdpHero({ product }: { product: Product }) {
  const coffee = isCoffee(product) ? product : null;
  const { stage, ink } = cardStage(product);
  const view = STAGE_VIEWS[product.slug] ?? { photo: product.photo ?? "roastery", labels: ["Bag", "Photo"] };
  const spec = PHOTOS[view.photo];
  const origin = ORIGINS.find((o) => o.coffee === product.slug);
  const indexLabel = coffee?.signatureIndex
    ? `N° 0${coffee.signatureIndex} / 04`
    : origin
      ? formatCoords(origin.lat, origin.lon)
      : coffee
        ? coffee.originLabel
        : TYPE_LABEL[product.type];
  const [first, rest] = splitName(product.name);
  const typeHref = `/shop?type=${product.type}`;

  return (
    <section className="pdp-hero shell" aria-labelledby="pdp-title">
      <div className="pdp-hero-grid">
        <div className="pdp-stage-col">
          <Stage
            stage={stage}
            ink={ink}
            labels={view.labels}
            sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 40vw, 50vw"
            photo={
              <Photo
                slot={view.photo}
                fill
                zoom
                sizes={stagePhotoSizes(aspectRatio(spec.aspect))}
                mediaClassName="pdp-stage-photo-media"
              />
            }
          >
            <Texture id={STAGE_TEXTURE[product.slug] ?? "wide-a"} className="pdp-stage-contours" position="85% 40%" />
            <span className="pdp-stage-window" aria-hidden="true" />
            <ProductBadge product={product} className="pdp-stage-badge" />
            <span className="pdp-stage-index">{indexLabel}</span>
          </Stage>
        </div>

        <div className="pdp-info">
          <nav aria-label="Breadcrumb" className="hero-fade" style={{ ["--delay" as string]: "80ms" }}>
            <ol className="pdp-crumbs">
              <li>
                <Link href="/shop" className="link-sweep">
                  Shop
                </Link>
                <Icon name="chevron-right" className="size-3.5" />
              </li>
              <li>
                <Link href={typeHref} className="link-sweep">
                  {TYPE_LABEL[product.type]}
                </Link>
                <Icon name="chevron-right" className="size-3.5" />
              </li>
              <li>
                <span aria-current="page">{product.name}</span>
              </li>
            </ol>
          </nav>

          <Lines
            as="h1"
            hero
            id="pdp-title"
            className={cn("pdp-title display", rest.length > 10 && "is-long")}
            lines={rest ? [first, <em key="em">{rest}</em>] : [first]}
          />

          <p className="hero-fade pdp-tagline" style={{ ["--delay" as string]: "380ms" }}>
            {product.tagline}
          </p>

          <div className="hero-fade" style={{ ["--delay" as string]: "460ms" }}>
            <PriceTag />
          </div>

          <div className="hero-fade" style={{ ["--delay" as string]: "540ms" }}>
            <Meta product={product} />
          </div>

          <div className="hero-fade" style={{ ["--delay" as string]: "620ms" }}>
            <Configurator />
            <Reassurance product={product} />
          </div>
        </div>
      </div>
      <BuyBar />
    </section>
  );
}
