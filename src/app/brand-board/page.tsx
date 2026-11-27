import type { Metadata } from "next";
import { BrandBoardHero } from "@/components/brand-board/BrandBoardHero";
import { BrandBoardSheet } from "@/components/brand-board/BrandBoardSheet";
import { BoardBreakdown } from "@/components/brand-board/BoardBreakdown";
import { SheetStage } from "@/components/brand-guide/SheetStage";

export const metadata: Metadata = {
  title: "Brand board",
  description: "The Furrowline identity in use: a takeaway cup, coffee pouches, business cards and the roastery's painted sign.",
  robots: { index: false, follow: false },
};

/* The brand board (the 1280 × 769 slide the showcase renders), then each
   mockup on its own, larger, with the production notes. */
export default function BrandBoardPage() {
  return (
    <>
      <BrandBoardHero />
      <div className="guide-stage-band">
        <SheetStage width={1280} height={769} fit="page">
          <BrandBoardSheet />
        </SheetStage>
      </div>
      <BoardBreakdown />
    </>
  );
}
