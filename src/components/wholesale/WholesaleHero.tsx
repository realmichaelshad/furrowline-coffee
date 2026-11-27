import { Photo } from "@/components/photo/Photo";
import { Button } from "@/components/ui/Button";
import { Lines } from "@/components/ui/Typography";
import { InquiryButton } from "./InquiryButton";
import "./wholesale.css";

/* ==========================================================================
   Wholesale hero. The espresso bar fills a large rounded frame under the
   header; a dark scrim on the left (and along the bottom on phones) carries
   the headline. Entrance is CSS from first paint: the frame's mask opens
   from a smaller rounded rect (the photo is visible from frame one, so LCP
   is never held back), the photo settles from a push-in, the lines rise.
   A glass card on the right shows the house recipe on the bar.
   ========================================================================== */

export function WholesaleHero() {
  return (
    <header className="ws-hero">
      <div className="ws-hero-frame">
        <div className="ws-hero-media">
          {/* The frame is wider than 3:2 from md up (cover by width). On phones the 4:5 crop renders ~1.9×
              wide; 125vw keeps the first bytes small, and the scrim hides the slight softness. */}
          <Photo
            slot="espresso-bar"
            fill
            priority
            shade="left"
            quality={85}
            sizes="(min-width: 40rem) 100vw, 125vw"
            mediaClassName="ws-hero-zoom"
          />
          <div className="ws-hero-scrim" aria-hidden="true" />
        </div>

        <div className="ws-hero-copy shell">
          <p className="hero-fade eyebrow mb-5 text-parchment/85 lg:mb-7" style={{ ["--delay" as string]: "150ms" }}>
            <span className="hidden sm:inline">Wholesale · </span>Cafés, restaurants &amp; offices
          </p>
          <Lines
            as="h1"
            id="ws-hero-title"
            hero
            className="ws-hero-title display"
            lines={["Pour Furrowline", <em key="em">at your bar.</em>]}
          />
          <p className="hero-fade ws-hero-lead" style={{ ["--delay" as string]: "520ms" }}>
            Deep Field on the espresso grinder, a rotating single origin beside it, and a roaster who comes by to dial it
            in. Roasted to order every week in Alder Bend.
          </p>
          <div className="hero-fade mt-7 flex flex-wrap gap-3" style={{ ["--delay" as string]: "640ms" }}>
            <InquiryButton />
            <Button href="#pricing" size="lg" variant="outline-light" prefetch={false}>
              See pricing
            </Button>
          </div>
        </div>

        <p className="ws-hero-card hero-fade" style={{ ["--delay" as string]: "1000ms" }}>
          <span className="ws-hero-card-dot" aria-hidden="true" />
          <span>
            <span className="eyebrow block text-parchment/75">On the bar · Deep Field</span>
            <span className="display mt-1 block text-[1.0625rem] text-parchment">18 g in, 38 g out, 28 seconds</span>
          </span>
        </p>
      </div>
    </header>
  );
}
