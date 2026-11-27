import { Logo } from "@/components/brand/Logo";
import { Mark } from "@/components/brand/Mark";
import { Contours } from "@/components/illustration/primitives";
import { SITE } from "@/content/site";

/* ==========================================================================
   Business cards, 3.5 × 2 in (252 × 144 at board scale), seen from above:
   the clay front carries the reversed lockup over a tone-on-tone contour
   print; the parchment back carries the name, role, mark and a clay contour
   print. No contact details anywhere, by design. Paper grain, a lit top-left
   edge, a shaded bottom-right edge and a cast shadow sell the stock.
   ========================================================================== */

const FIRST_NAME = SITE.founder.name.split(" ")[0] ?? "Nadia";
const INITIAL = SITE.founder.name.split(" ")[1]?.[0] ?? "F";

export function CardFront({ className }: { className?: string }) {
  return (
    <div className={`board-card board-card-front ${className ?? ""}`}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 252 144" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <Contours
          hills={[{ cx: 214, cy: 30, r: 120, levels: 11, stretch: 1.3, wobble: 0.2, seed: 91 }]}
          stroke="var(--color-clay-deep)"
          strokeWidth={1.1}
        />
      </svg>
      <div className="relative w-[156px]">
        <Logo variant="horizontal" markColor="var(--color-linen)" textColor="var(--color-linen)" className="block h-auto w-full" title={`${SITE.name} business card, front`} />
      </div>
    </div>
  );
}

export function CardBack({ className }: { className?: string }) {
  return (
    <div className={`board-card board-card-back ${className ?? ""}`}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 252 144" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <Contours
          hills={[{ cx: 236, cy: 118, r: 96, levels: 9, stretch: 1.25, wobble: 0.22, seed: 17 }]}
          stroke="var(--color-clay)"
          strokeWidth={1}
          opacity={0.42}
        />
      </svg>
      <div className="board-card-back-body">
        <Mark className="h-[22px] w-auto" color="var(--color-clay)" />
        <div>
          <p className="board-card-name">
            {FIRST_NAME} {INITIAL}.
          </p>
          <p className="board-card-role">Head roaster</p>
        </div>
        <p className="board-card-brand">{SITE.shortName} · Est. {SITE.founded}</p>
      </div>
    </div>
  );
}
