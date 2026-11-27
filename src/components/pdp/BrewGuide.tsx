import { isCoffee, type BrewRecipe, type Product } from "@/content/products";
import { PHOTOS } from "@/content/photos";
import { HOW_TO } from "@/content/pdp";
import { Photo } from "@/components/photo/Photo";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import { BrewTabs } from "./BrewTabs";

/* ==========================================================================
   (03) Brew guide (coffee) or How to use it (gear), on a raised linen panel:
   a photograph in a rounded frame with a clip reveal and parallax, and the
   recipes as big numbers. Two or more recipes become an accessible
   tablist; a single recipe is shown as it is.
   ========================================================================== */

/**
 * Big number + small rest: "360 g at 94°C" → ["360 g", "at 94°C"],
 * "27 to 30 seconds" → ["27–30", "seconds"]. Anything else stays whole.
 */
function splitMeasure(value: string): [string, string] {
  const range = /^([\d:.]+) to ([\d:.]+)\s*(.*)$/.exec(value);
  if (range) return [`${range[1]}–${range[2]}`, range[3] ?? ""];
  const amount = /^([\d.,:]+(?:\s?(?:g|ml|kg|litres?))?)\s+(.+)$/.exec(value);
  return amount ? [amount[1] ?? value, amount[2] ?? ""] : [value, ""];
}

function Recipe({ recipe }: { recipe: BrewRecipe }) {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Dose", value: recipe.dose },
    { label: "Water", value: recipe.water },
    { label: "Time", value: recipe.time },
  ];
  return (
    <div>
      <dl className="pdp-recipe">
        {rows.map((row) => {
          const [big, small] = splitMeasure(row.value);
          return (
            <div key={row.label}>
              <dt className="eyebrow text-bark">{row.label}</dt>
              <dd>
                <span className="pdp-recipe-big display">{big}</span>
                {small && <span className="pdp-recipe-small">{small}</span>}
              </dd>
            </div>
          );
        })}
        <div className="pdp-recipe-wide">
          <dt className="eyebrow text-bark">Grind</dt>
          <dd className="display text-h3">{recipe.grind}</dd>
        </div>
      </dl>
      <p className="pdp-recipe-note">
        <Icon name="info" className="mt-0.5 size-[1.125rem] shrink-0 text-clay" />
        <span>{recipe.note}</span>
      </p>
    </div>
  );
}

function Panel({
  photo,
  index,
  eyebrow,
  title,
  children,
}: {
  photo: Parameters<typeof Photo>[0]["slot"];
  index: number;
  eyebrow: string;
  title: [string, string];
  children: React.ReactNode;
}) {
  return (
    <section className="defer-render shell py-section" aria-labelledby="pdp-brew-title">
      <div className="pdp-brew grid-editorial gap-y-10">
        <div className="col-span-4 md:col-span-5">
          <div className="pdp-brew-photo" data-reveal="clip">
            <div className="pdp-arch-media" data-parallax="0.05">
              <Photo
                slot={photo}
                fill
                zoom
                sizes={PHOTOS[photo].aspect === "3:2" ? "(min-width: 48rem) 66vw, 92vw" : "(min-width: 48rem) 44vw, 92vw"}
              />
            </div>
          </div>
        </div>
        <div className="col-span-4 md:col-span-7 md:pl-6 lg:col-span-6 lg:col-start-7 lg:pl-0">
          <Eyebrow index={index} className="mb-6 text-bark">
            {eyebrow}
          </Eyebrow>
          <Lines id="pdp-brew-title" className="display text-h1" lines={[title[0], <em key="em">{title[1]}</em>]} />
          <div className="mt-10" data-reveal="rise" data-reveal-delay="120">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function BrewGuide({ product }: { product: Product }) {
  if (isCoffee(product)) {
    const recipes = product.brew;
    return (
      <Panel photo="brew-gear" index={3} eyebrow="Brew guide" title={["Brew it", "the way we do."]}>
        {recipes.length > 1 ? (
          <BrewTabs label={`Brew recipes for ${product.name}`} labels={recipes.map((r) => r.method)}>
            {recipes.map((r) => (
              <Recipe key={r.method} recipe={r} />
            ))}
          </BrewTabs>
        ) : recipes[0] ? (
          <>
            <p className="eyebrow mb-6 flex items-center gap-2">
              <Icon name="coffee" className="size-4" />
              {recipes[0].method}
            </p>
            <Recipe recipe={recipes[0]} />
          </>
        ) : null}
      </Panel>
    );
  }

  const how = HOW_TO[product.slug];
  if (!how) return null;
  return (
    <Panel photo={how.photo} index={2} eyebrow="How to use it" title={how.title}>
      <ol className="pdp-steps">
        {how.steps.map((step, i) => (
          <li key={step.slice(0, 20)}>
            <span className="pdp-step-index" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
