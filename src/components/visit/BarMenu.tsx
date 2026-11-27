import Link from "next/link";
import { BAR_MENU, CUPPING, type MenuGroup } from "@/content/visit";
import { getProduct, isCoffee } from "@/content/products";
import { formatPrice } from "@/lib/pricing";
import { Photo } from "@/components/photo/Photo";
import { Button } from "@/components/ui/Button";
import { Eyebrow, Lines, SectionIntro } from "@/components/ui/Typography";

/* ==========================================================================
   (03) What's on the bar: a short printed-menu layout with dotted leaders
   and mono prices, the pour-over rotation linked to the shop. Then (04) the
   Saturday public cupping on an espresso band with the cupping photo.
   ========================================================================== */

function MenuColumn({ group, index }: { group: MenuGroup; index: number }) {
  return (
    <section className="bar-col" aria-labelledby={`menu-${group.id}`} data-reveal="rise" data-reveal-delay={String(index * 110)}>
      <div className="bar-col-head">
        <h3 id={`menu-${group.id}`} className="display text-h2">
          {group.title}
        </h3>
        {group.price !== undefined && <p className="bar-price-tag">{formatPrice(group.price)} a cup</p>}
      </div>
      <p className="mt-3 text-small text-bark">{group.intro}</p>
      <ul className="bar-list">
        {group.items.map((item) => {
          const product = item.slug ? getProduct(item.slug) : undefined;
          const swatch = product && isCoffee(product) ? product.palette.bag : undefined;
          return (
            <li key={item.name} className="bar-item">
              <span className="bar-item-line">
                {swatch && <span className="bar-swatch" style={{ backgroundColor: swatch }} aria-hidden="true" />}
                {product ? (
                  <Link href={`/shop/${product.slug}`} className="bar-item-name link-sweep">
                    {item.name}
                  </Link>
                ) : (
                  <span className="bar-item-name">{item.name}</span>
                )}
                {item.price !== undefined && (
                  <>
                    <span className="bar-leader" aria-hidden="true" />
                    <span className="bar-item-price">{formatPrice(item.price)}</span>
                  </>
                )}
              </span>
              <span className="bar-item-detail">{item.detail}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function BarMenu() {
  return (
    <section id="on-the-bar" className="shell py-section" aria-labelledby="bar-title">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-8 md:mb-20">
        <SectionIntro
          index={3}
          eyebrow="On the bar"
          id="bar-title"
          title={["What's on", <em key="em">the bar.</em>]}
          lead="A short menu, made well. Oat milk costs nothing extra, and batch-brew refills are a dollar."
        />
      </div>
      <div className="bar-grid">
        {BAR_MENU.map((group, i) => (
          <MenuColumn key={group.id} group={group} index={i} />
        ))}
      </div>
    </section>
  );
}

export function Cupping() {
  const facts = [
    { value: String(CUPPING.bowls), label: "Bowls on the table" },
    { value: String(CUPPING.minutes), label: "Minutes, give or take" },
    { value: String(CUPPING.seats), label: "Seats, first come" },
    { value: "$0", label: "It's free" },
  ];
  return (
    <section className="defer-render shell pb-section" aria-labelledby="cupping-title">
      <div className="cupping on-dark">
        <div className="cupping-media" data-reveal="clip">
          <div className="scale-[1.08]" data-parallax="0.05">
            <Photo
              slot="cupping"
              aspect={4 / 3}
              zoom
              sizes="(min-width: 64rem) 90vw, 180vw"
              position="63% 33%"
              scale={1.75}
              alt="A cupping spoon breaking the crust on a bowl of fresh grounds."
            />
          </div>
        </div>
        <div className="cupping-copy">
          <Eyebrow index={4} className="mb-6 text-mist">
            {CUPPING.day}s at {CUPPING.time}
          </Eyebrow>
          <Lines id="cupping-title" className="display text-display-m text-parchment" lines={["Public", <em key="em">cupping.</em>]} />
          <p className="mt-6 max-w-[44ch] text-body text-mist" data-reveal="rise" data-reveal-delay="120">
            {CUPPING.body}
          </p>
          <dl className="cupping-facts" data-reveal="rise" data-reveal-delay="180">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse">
                <dt className="mt-1 font-mono text-[0.6875rem] tracking-[0.12em] text-mist uppercase">{f.label}</dt>
                <dd className="display text-h1 text-peach">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-9 flex flex-wrap gap-3" data-reveal="rise" data-reveal-delay="240">
            <Button href="/shop?type=coffee" variant="light" icon="arrow" magnetic>
              This week&apos;s coffees
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
