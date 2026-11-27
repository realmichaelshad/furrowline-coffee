import type { ReactNode } from "react";
import { Stamp } from "@/components/brand/Stamp";
import { ProductImage } from "@/components/product/ProductImage";
import { ArrowLink, Button } from "@/components/ui/Button";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import { getProduct } from "@/content/products";
import { SheetStage } from "@/components/brand-guide/SheetStage";
import { CardsTile, CupAndBagTile, LyingTile, StorefrontTile } from "./BrandBoardSheet";

/* ==========================================================================
   The board, one mockup at a time: each tile drawn larger (vector, so it
   stays crisp) next to its production notes. On phones the tiles fill the
   width, which is where the slide above gets too small to read.
   ========================================================================== */

interface Note {
  id: string;
  letter: string;
  title: ReactNode;
  body: string;
  specs: Array<[string, string]>;
  tile: ReactNode;
  size: { w: number; h: number; max: number };
}

const NOTES: Note[] = [
  {
    id: "cup",
    letter: "a",
    title: (
      <>
        Cup <em>and pouch</em>
      </>
    ),
    body: "The two things that leave the café in someone's hand. The cup is clay all over so it reads from across the street; the pouch carries the coffee's own colour and the landscape it grew in.",
    specs: [
      ["Cup", "12 oz double-wall paper, clay, espresso lid"],
      ["Sleeve", "Corrugated kraft, one colour: the mark and the roastery line"],
      ["Pouch", "340 g stand-up, matte film, side gussets, one-way valve"],
    ],
    tile: <CupAndBagTile />,
    size: { w: 516, h: 737, max: 560 },
  },
  {
    id: "cards",
    letter: "b",
    title: (
      <>
        Business <em>cards</em>
      </>
    ),
    body: "Clay on the front, parchment on the back. The contour print bleeds off one edge on each side, so no two cards in a stack line up quite the same.",
    specs: [
      ["Stock", "600 gsm cotton, 3.5 × 2 in, square corners"],
      ["Front", "Reversed lockup over a tone-on-tone contour"],
      ["Back", "Name in Fraunces, role in DM Mono, the mark and a clay contour"],
    ],
    tile: <CardsTile />,
    size: { w: 344, h: 362, max: 560 },
  },
  {
    id: "flat",
    letter: "c",
    title: (
      <>
        Pouch, <em>flat lay</em>
      </>
    ),
    body: "The arched window sits above the fold, so the label reads on a shelf, in a hand and from above in a delivery box. Light colours like First Light keep the line work at full strength.",
    specs: [
      ["Print", "Four colours on matte film with a white underlay"],
      ["Window", "The landscape each coffee grew in, inside the arch"],
      ["Scale", "Four roast bars, filled light to dark"],
    ],
    tile: <LyingTile />,
    size: { w: 344, h: 363, max: 560 },
  },
  {
    id: "fascia",
    letter: "d",
    title: (
      <>
        Painted <em>fascia</em>
      </>
    ),
    body: "The roastery already had a blank timber board over the door and a lamp above it. The lockup is painted straight onto the wood in parchment enamel, so it glows when the lamp comes on at dusk.",
    specs: [
      ["Board", "Existing timber fascia, about 2.4 × 0.8 m"],
      ["Paint", "Parchment enamel, lettered from the outlined lockup"],
      ["Light", "The gooseneck lamp above; no lightbox"],
    ],
    tile: <StorefrontTile sizes="(min-width: 48rem) 920px, 100vw" />,
    size: { w: 364, h: 737, max: 420 },
  },
];

export function BoardBreakdown() {
  const mug = getProduct("contour-enamel-mug");
  const tote = getProduct("field-canvas-tote");
  return (
    <div id="board-notes" className="board-notes">
      <section aria-labelledby="board-notes-title" className="guide-page-shell pt-section-sm">
        <div className="grid-editorial items-end gap-y-6">
          <div className="col-span-4 md:col-span-7">
            <Eyebrow index={1} className="mb-5 text-bark">
              Production notes
            </Eyebrow>
            <Lines id="board-notes-title" lines={["Four objects,", <em key="em">one line.</em>]} className="display text-h1" />
          </div>
          <p data-reveal="rise" className="col-span-4 max-w-[42ch] text-body text-bark md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
            Each mockup is built from the same parts as the site: the outlined logo, the packaging artwork, the contour
            pattern and the palette. Nothing here is a stock template.
          </p>
        </div>

        <div className="mt-section-sm grid gap-y-[clamp(4rem,9vw,8rem)]">
          {NOTES.map((n, i) => (
            <article key={n.id} aria-labelledby={`board-note-${n.id}`} className="grid-editorial items-center gap-y-8">
              <div className={`col-span-4 md:col-span-7 ${i % 2 ? "md:order-2 md:col-start-6" : ""}`}>
                <div data-reveal="rise" className={i % 2 ? "board-note-end" : undefined}>
                  <SheetStage width={n.size.w} height={n.size.h} maxWidth={n.size.max} className="board-note-stage">
                    {n.tile}
                  </SheetStage>
                </div>
              </div>
              <div className={`col-span-4 md:col-span-4 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-9"}`} data-reveal="rise">
                <p className="eyebrow text-clay-deep">({n.letter})</p>
                <h3 id={`board-note-${n.id}`} className="display mt-3 text-h2">
                  {n.title}
                </h3>
                <p className="mt-4 max-w-[40ch] text-body text-bark">{n.body}</p>
                <dl className="mt-6">
                  {n.specs.map(([term, def]) => (
                    <div key={term} className="rule-t grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 text-small">
                      <dt className="eyebrow pt-0.5 text-bark">{term}</dt>
                      <dd>{def}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="board-shelf-title" className="guide-page-shell pt-section pb-section">
        <div className="board-shelf" data-reveal="rise">
          <div className="board-shelf-copy">
            <Eyebrow index={2} className="mb-5 text-bark">
              On the shelf too
            </Eyebrow>
            <h2 id="board-shelf-title" className="display text-h1">
              The mark travels <em>well.</em>
            </h2>
            <p className="mt-5 max-w-[38ch] text-body text-bark">
              The bean, the contour rings and the furrow rows carry onto the enamel mug and the canvas tote, and the
              roast stamp signs off anything that leaves the roastery.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href="/brand-guide" variant="dark" size="md" icon="arrow">
                Read the brand guide
              </Button>
              <ArrowLink href="/shop?type=gear">Shop gear and merch</ArrowLink>
            </div>
          </div>
          <div className="board-shelf-items">
            {mug && (
              <div className="board-shelf-item">
                <ProductImage product={mug} sizes="(min-width: 64rem) 16vw, 38vw" alt="Contour Enamel Mug with the furrowed bean" />
              </div>
            )}
            {tote && (
              <div className="board-shelf-item">
                <ProductImage product={tote} sizes="(min-width: 64rem) 16vw, 38vw" alt="Field Canvas Tote with the mark over a furrow print" />
              </div>
            )}
            <div className="board-shelf-stamp" aria-hidden="true">
              <Stamp color="var(--color-espresso)" markColor="var(--color-clay)" disc="var(--color-parchment)" spin />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
