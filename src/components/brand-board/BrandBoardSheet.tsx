import { Bean } from "@/components/illustration/primitives";
import { ContourMask } from "@/components/brand-guide/ContourMask";
import { getProduct, isCoffee, type CoffeeProduct } from "@/content/products";
import { SITE } from "@/content/site";
import { LyingBag, StandingBag } from "./BagMockups";
import { CardBack, CardFront } from "./BusinessCards";
import { Cup } from "./Cup";
import { Storefront } from "./Storefront";
import "./brand-board.css";

/* ==========================================================================
   The brand board: a fixed 1280 × 769 presentation slide (rendered to
   showcase/brand-board.png). Four mockups, all SVG/CSS, lit from the
   top-left with shadows falling to the bottom-right:
   (a) takeaway cup and a standing pouch on an oat studio sweep
   (b) business cards on espresso
   (c) a pouch lying flat on sage with a few beans
   (d) the painted fascia on the roastery's storefront
   ========================================================================== */

function coffee(slug: string): CoffeeProduct {
  const p = getProduct(slug);
  if (!p || !isCoffee(p)) throw new Error(`Missing coffee: ${slug}`);
  return p;
}

const BEANS: Array<[number, number, number, number]> = [
  [44, 250, 9, -30],
  [66, 270, 8.5, 40],
  [34, 286, 8, 95],
  [282, 54, 9, 20],
  [304, 74, 8.5, -60],
  [298, 38, 8, 130],
  [312, 292, 8.5, 10],
  [28, 66, 8, -15],
];

/** (a) Cup and standing pouch, also used on its own in the breakdown. */
export function CupAndBagTile({ withTitle = false }: { withTitle?: boolean }) {
  return (
    <div className="board-tile board-tile-sweep" style={{ width: 516, height: 737 }}>
      <ContourMask id="wide-b" size="1296px 810px" position="130px -178px" className="board-sweep-contours" />
      {withTitle && (
        <div className="absolute top-[26px] left-[28px]">
          <p className="board-eyebrow">{SITE.name}</p>
          <h2 className="board-title" id="board-sheet-title">
            Identity <em>in use</em>
          </h2>
        </div>
      )}
      <StandingBag coffee={coffee("deep-field")} height={452} style={{ left: 182, top: 124 }} />
      <div className="absolute" style={{ left: 30, top: 314, width: 218 }}>
        <Cup className="block h-auto w-full" />
      </div>
      <p className="board-label board-label-dark" style={{ right: 24, bottom: 22 }}>
        (a) Cup &amp; pouch
      </p>
      {withTitle && (
        <p className="board-label board-label-dark" style={{ left: 28, bottom: 22 }}>
          {SITE.conceptLine}
        </p>
      )}
    </div>
  );
}

/** (b) Business cards. */
export function CardsTile() {
  return (
    <div className="board-tile board-tile-espresso" style={{ width: 344, height: 362 }}>
      <CardBack className="board-card-pos-back" />
      <CardFront className="board-card-pos-front" />
      <p className="board-label board-label-light" style={{ left: 22, bottom: 20 }}>
        (b) Business cards
      </p>
    </div>
  );
}

/** (c) A pouch lying flat, with a few beans. */
export function LyingTile() {
  return (
    <div className="board-tile board-tile-sage" style={{ width: 344, height: 363 }}>
      <svg className="board-beans absolute inset-0 h-full w-full" viewBox="0 0 344 363" aria-hidden="true">
        {BEANS.map(([x, y, r, rot], i) => (
          <Bean key={i} x={x} y={y} r={r} rotate={rot} fill={i % 3 === 0 ? "#3a2a20" : "#5c4a3c"} crease="#241913" />
        ))}
      </svg>
      <LyingBag coffee={coffee("first-light")} height={262} rotate={-26} style={{ left: 81, top: 46 }} />
      <p className="board-label board-label-dark" style={{ left: 22, bottom: 20 }}>
        (c) Pouch, flat lay
      </p>
    </div>
  );
}

/** (d) The painted fascia on the storefront. */
export function StorefrontTile({ priority = false, sizes }: { priority?: boolean; sizes?: string }) {
  return (
    <div className="board-tile board-tile-photo" style={{ width: 364, height: 737 }}>
      <Storefront width={364} height={737} scale={0.8} offset={[-407, -36]} priority={priority} sizes={sizes} />
      <span className="board-photo-scrim" aria-hidden="true" />
      <p className="board-label board-label-light" style={{ left: 22, bottom: 20 }}>
        (d) Painted fascia
      </p>
    </div>
  );
}

export function BrandBoardSheet() {
  return (
    <section data-sheet="brand-board" className="board-sheet" aria-labelledby="board-sheet-title">
      <div className="board-cell-a">
        <CupAndBagTile withTitle />
      </div>
      <div className="board-cell-b">
        <CardsTile />
      </div>
      <div className="board-cell-c">
        <LyingTile />
      </div>
      <div className="board-cell-d">
        <StorefrontTile priority />
      </div>
    </section>
  );
}
