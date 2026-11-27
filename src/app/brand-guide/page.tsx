import type { Metadata } from "next";
import { BrandGuideHero } from "@/components/brand-guide/BrandGuideHero";
import { BrandGuideSheet } from "@/components/brand-guide/BrandGuideSheet";
import { GuideBreakdown } from "@/components/brand-guide/GuideBreakdown";
import { SheetStage } from "@/components/brand-guide/SheetStage";

export const metadata: Metadata = {
  title: "Brand guide",
  description: "The Furrowline identity on one sheet: logo and clear space, colour, type, packaging, pattern and voice.",
  robots: { index: false, follow: false },
};

/* The one-page brand guide (the 1280 × 769 sheet the showcase renders), then
   the same system broken down into readable sections for every screen size. */
export default function BrandGuidePage() {
  return (
    <>
      <BrandGuideHero />
      <div className="guide-stage-band">
        <SheetStage width={1280} height={769} fit="page">
          <BrandGuideSheet />
        </SheetStage>
      </div>
      <GuideBreakdown />
    </>
  );
}
