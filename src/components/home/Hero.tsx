import { getProduct, type CoffeeProduct } from "@/content/products";
import { HERO_VIDEO } from "@/content/photos";
import { Photo } from "@/components/photo/Photo";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { Lines } from "@/components/ui/Typography";
import { hasHeroVideo } from "@/lib/photos.server";
import { HeroScene } from "./HeroScene";
import { HeroVideo } from "./HeroVideo";
import "./hero.css";

/* ==========================================================================
   Home hero. The photo fills an inset, rounded frame; the headline sits in
   the photo's dark left third (a bottom scrim takes over on phones).
   Entrance is CSS from first paint: the frame's mask opens from a smaller
   rounded rect (the photo is visible from frame one, so LCP is never held
   back), the image settles from a push-in, the headline lines rise.
   Scroll: HeroScene scrubs the photo, copy and bag (transform/opacity).
   ========================================================================== */

export function Hero() {
  const firstLight = getProduct("first-light") as CoffeeProduct;
  const video = hasHeroVideo();

  return (
    <HeroScene className="hero" aria-labelledby="hero-title">
      <div className="hero-frame">
        <div className="hero-media" data-hero-media>
          <Photo slot="hero-pour" fill priority sizes="100vw" quality={85} mediaClassName="hero-zoom" />
          {video && <HeroVideo src={HERO_VIDEO.path} poster="/photos/hero-pour.webp" />}
        </div>
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-copy shell" data-hero-copy>
          <div>
            <p className="hero-fade eyebrow mb-5 text-parchment/80 lg:mb-7" style={{ ["--delay" as string]: "150ms" }}>
              Small-batch roasters · <span className="hidden sm:inline">Alder Bend · </span>
              Est. 2016
            </p>
            <Lines
              as="h1"
              id="hero-title"
              hero
              className="hero-title display"
              lines={["Follow", <em key="em">the line</em>, "from farm", "to cup."]}
            />
          </div>
          <div className="hero-fade mt-7 lg:mt-0" style={{ ["--delay" as string]: "620ms" }}>
            <p className="hero-lead">
              Seasonal coffee from twelve partner farms, roasted twice a week and at your door two days later.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/shop" size="lg" icon="arrow" magnetic>
                Shop the coffee
              </Button>
              <Button href="/#find-your-coffee" size="lg" variant="outline-light" magnetic prefetch={false}>
                Find your coffee
              </Button>
            </div>
          </div>
        </div>

        <p className="hero-note hero-fade" style={{ ["--delay" as string]: "1100ms" }}>
          <span className="hero-note-dot" aria-hidden="true" />
          <span>
            <span className="block eyebrow text-parchment/70">On the drum this week</span>
            <span className="display mt-0.5 block text-[1.0625rem]">
              {firstLight.name} · <span className="italic">{firstLight.originLabel}</span>
            </span>
          </span>
        </p>

        <div className="hero-cue hero-fade motion-only" data-hero-cue aria-hidden="true" style={{ ["--delay" as string]: "1300ms" }}>
          <span className="eyebrow">Scroll</span>
          <span className="hero-cue-line">
            <span />
          </span>
        </div>
      </div>

      <div className="hero-bag" data-hero-bag aria-hidden="true">
        <div className="hero-bag-inner">
          <ProductImage product={firstLight} alt="" sizes="(min-width: 64rem) 15.5rem, 1px" />
        </div>
      </div>
    </HeroScene>
  );
}
