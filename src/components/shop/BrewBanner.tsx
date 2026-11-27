import { getProduct, type CoffeeProduct } from "@/content/products";
import { Photo } from "@/components/photo/Photo";
import { Button } from "@/components/ui/Button";

/* ==========================================================================
   Editorial tile (a): "Brew it like we do". The brew-gear still life has
   its gear on the left and open oak on the right, so the copy card sits on
   the right. Wide (container query): the photo fills the tile and opens
   with a clip reveal on a slow parallax layer. Narrow (phones): photo on
   top, card below. The recipe is the real one from First Light.
   Server component, passed into the shop island as a prop.
   ========================================================================== */

export function BrewBanner() {
  const coffee = getProduct("first-light") as CoffeeProduct;
  const recipe = coffee.brew.find((b) => b.method === "Pour-over") ?? coffee.brew[0]!;
  const rows = [
    { label: "Coffee", value: recipe.dose.replace(" coffee", "") },
    { label: "Water", value: recipe.water },
    { label: "Grind", value: recipe.grind.split(",")[0] },
    { label: "Time", value: recipe.time },
  ];
  return (
    <article className="brew-tile" aria-labelledby="brew-tile-title">
      <div className="brew-media" data-reveal="clip">
        <div className="brew-media-inner scale-[1.1]" data-parallax="0.05">
          <Photo
            slot="brew-gear"
            fill
            zoom
            sizes="(min-width: 80rem) 92vw, (min-width: 64rem) 70vw, 100vw"
          />
        </div>
      </div>
      <div className="brew-card" data-reveal="rise" data-reveal-delay="160">
        <p className="eyebrow text-bark">The pour-over on our bar</p>
        <h3 id="brew-tile-title" className="brew-title display">
          Brew it <em>like we do.</em>
        </h3>
        <dl className="brew-recipe">
          {rows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="brew-lead">
          A ceramic dripper, a kettle with a slow, steady pour and a grinder that holds its setting. The same three
          things on our bar, every morning.
        </p>
        <Button href="/shop?type=gear" variant="dark" size="sm" icon="arrow" scroll={false}>
          Shop brewing gear
        </Button>
      </div>
    </article>
  );
}
