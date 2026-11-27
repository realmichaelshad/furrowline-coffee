import { useId, type CSSProperties } from "react";
import type { CoffeeProduct } from "@/content/products";
import { Bag } from "@/components/packaging/Bag";

/* ==========================================================================
   Coffee pouch mockups built on the <Bag> artwork.
   - <StandingBag>: turned toward the light (perspective + rotateY), with a
     side gusset in shadow, a film sheen and a crimp highlight, and a floor
     shadow that falls to the bottom-right.
   - <LyingBag>: laid flat on a surface, seen from above with a slight
     perspective tilt; its shadow is drawn by an unrotated parent so it
     always falls to the bottom-right like everything else on the board.
   ========================================================================== */

/* Outline of the pouch body inside the Bag's 320 × 460 viewBox. */
const BODY =
  "M40 22H280L285 62C291 160 296 300 298 394C299 416 288 430 266 432H54C32 430 21 416 22 394C24 300 29 160 35 62Z";

type BagCoffee = CoffeeProduct;

/** Glossy film sheen and crimp highlight, drawn over the bag in its own coordinates. */
function Sheen({ angle = 112 }: { angle?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 320 460" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${uid}-c`}>
          <path d={BODY} />
        </clipPath>
        <linearGradient id={`${uid}-g`} gradientTransform={`rotate(${angle - 90} 0.5 0.5)`}>
          <stop offset="0.12" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.22" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.27" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.36" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.46" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-crimp`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${uid}-c)`}>
        <rect width="320" height="460" fill={`url(#${uid}-g)`} />
        <rect x="30" y="23" width="260" height="2.2" fill={`url(#${uid}-crimp)`} />
        <rect x="30" y="56" width="260" height="1.6" fill={`url(#${uid}-crimp)`} opacity="0.8" />
      </g>
    </svg>
  );
}

export function StandingBag({
  coffee,
  height,
  turn = -22,
  className,
  style,
}: {
  coffee: BagCoffee;
  height: number;
  /** rotateY in degrees; negative turns the face toward the light on the left. */
  turn?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const width = (height * 320) / 460;
  return (
    <div
      className={`board-standing ${className ?? ""}`}
      style={{ width, height, "--turn": `${turn}deg`, "--bag": coffee.palette.bag, ...style } as CSSProperties}
    >
      <span className="board-floor" aria-hidden="true" />
      <div className="board-standing-3d">
        <span className="board-gusset" aria-hidden="true" />
        <div className="board-standing-face">
          <Bag coffee={coffee} shadow={false} className="block h-full w-full" title={`${coffee.name} coffee pouch, standing`} />
          <Sheen />
        </div>
      </div>
    </div>
  );
}

export function LyingBag({
  coffee,
  height,
  rotate = -24,
  className,
  style,
}: {
  coffee: BagCoffee;
  height: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const width = (height * 320) / 460;
  return (
    <div className={`board-lying ${className ?? ""}`} style={{ width, height, "--rot": `${rotate}deg`, ...style } as CSSProperties}>
      <div className="board-lying-3d">
        <Bag coffee={coffee} shadow={false} className="block h-full w-full" title={`${coffee.name} coffee pouch, lying flat`} />
        <Sheen angle={130} />
      </div>
    </div>
  );
}
