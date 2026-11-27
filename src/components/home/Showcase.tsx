import Link from "next/link";
import type { CSSProperties } from "react";
import { ROAST_LEVELS, SIGNATURE_COFFEES, type CoffeeProduct } from "@/content/products";
import { SIGNATURE_PHOTO } from "@/content/photos";
import type { TextureId } from "@/content/textures";
import { Photo } from "@/components/photo/Photo";
import { ProductImage } from "@/components/product/ProductImage";
import { Texture } from "@/components/illustration/Texture";
import { Button } from "@/components/ui/Button";
import { RoastMeter } from "@/components/ui/Meters";
import { SectionIntro } from "@/components/ui/Typography";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { formatPrice } from "@/lib/pricing";
import { defaultPick } from "@/lib/product-options";
import { ShowcaseNav, ShowcaseScene } from "./ShowcaseScene";
import "./showcase.css";

/* ==========================================================================
   (02) The signature four. One panel per coffee on its own colour, with the
   origin photo in an arched window (the same arch as the bag label) and
   the bag floating over it.
   - Desktop + fine pointer + motion: ShowcaseScene pins the section and
     scrolls the panels sideways; bags turn and drift, photos parallax,
     colours sweep from coffee to coffee. Focus moving into a panel scrolls
     the page to it, so keyboard users are never stranded off-screen.
   - Touch / small screens: a native scroll-snap carousel.
   - Reduced motion, no JS, or showcase "linear" captures: panels stack.
   ========================================================================== */

function Panel({ coffee, total }: { coffee: CoffeeProduct; total: number }) {
  const roast = ROAST_LEVELS.find((r) => r.id === coffee.roast)?.label ?? "";
  const titleId = `showcase-${coffee.slug}`;
  const index = coffee.signatureIndex ?? 1;
  const slot = SIGNATURE_PHOTO[coffee.slug] ?? coffee.photo ?? "roastery";
  const [first, ...rest] = coffee.name.split(" ");
  const pick = defaultPick(coffee);
  return (
    <article
      className="showcase-panel"
      data-panel
      data-fly-scope
      aria-labelledby={titleId}
      style={{ "--stage": coffee.palette.stage, "--ink": coffee.palette.ink, "--accent": coffee.palette.accent } as CSSProperties}
    >
      <Texture id={`panel-${index}` as TextureId} className="showcase-contours" />

      <div className="showcase-visual">
        <div className="showcase-arch" data-panel-photo>
          {/* The arch is portrait, so a 3:2 photo covering it renders ~1.5× the arch height wide. */}
          <Photo slot={slot} fill alt="" sizes="(min-width: 64rem) 78vw, 135vw" zoom />
        </div>
        <div className="showcase-bag" data-panel-bag>
          <div data-fly-source>
            <ProductImage product={coffee} sizes="(min-width: 64rem) and (hover: hover) 23rem, 38vw" />
          </div>
        </div>
      </div>

      <div className="showcase-copy" data-panel-copy>
        <p className="flex items-center gap-4 eyebrow">
          <span>
            N° 0{index} <span className="font-normal">/ 0{total}</span>
          </span>
          <span className="h-px w-10 bg-current opacity-40" aria-hidden="true" />
          <RoastMeter roast={coffee.roast} />
        </p>
        <h3 id={titleId} className="showcase-name display">
          {first} {rest.length > 0 && <em>{rest.join(" ")}</em>}
        </h3>
        <p className="showcase-notes display">
          {coffee.notes[0]}, {coffee.notes[1].toLowerCase()} &amp; {coffee.notes[2].toLowerCase()}
        </p>
        <dl className="showcase-meta">
          <div>
            <dt>Origin</dt>
            <dd>{coffee.origin ? coffee.originLabel : "Brazil · Colombia · Guatemala"}</dd>
          </div>
          <div>
            <dt>Process</dt>
            <dd>{coffee.processLabel}</dd>
          </div>
          <div>
            <dt>Roast</dt>
            <dd>{roast}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <AddToCartButton
            line={pick.line}
            variant={coffee.palette.ink === "#241913" ? "dark" : "light"}
            size="lg"
            magnetic
          >
            Add {pick.short} · {formatPrice(pick.unit, { compact: true })}
          </AddToCartButton>
          <Link href={`/shop/${coffee.slug}`} className="showcase-link arrow-link group">
            <span className="link-sweep">Grind, size &amp; subscribe</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Showcase() {
  const coffees = SIGNATURE_COFFEES;
  return (
    <section id="coffees" className="showcase" aria-labelledby="showcase-title">
      <div className="shell pb-14 md:pb-20">
        <div className="grid-editorial items-end gap-y-8">
          <SectionIntro
            className="col-span-4 md:col-span-8"
            index={2}
            eyebrow="The signature four"
            id="showcase-title"
            title={["Four coffees,", "four landscapes."]}
          />
          <div className="col-span-4 md:col-span-4" data-reveal="rise" data-reveal-delay="200">
            <p className="text-lead text-bark">
              Each bag carries the place it grew: terraces, ridges, a raked patio and one long night field.
            </p>
            <div className="mt-6">
              <Button href="/shop?type=coffee" variant="outline" size="md" icon="arrow">
                All coffee
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ShowcaseScene className="showcase-viewport" data-showcase-viewport>
        <ShowcaseNav names={coffees.map((c) => c.name)} />
        <div className="showcase-track" data-showcase-track>
          {coffees.map((coffee) => (
            <Panel key={coffee.slug} coffee={coffee} total={coffees.length} />
          ))}
        </div>
      </ShowcaseScene>
    </section>
  );
}
