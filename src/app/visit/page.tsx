import type { Metadata } from "next";
import { VisitHero } from "@/components/visit/VisitHero";
import { HoursSection } from "@/components/visit/HoursSection";
import { FindUs } from "@/components/visit/FindUs";
import { BarMenu, Cupping } from "@/components/visit/BarMenu";
import { VisitClosing } from "@/components/visit/VisitClosing";
import "@/components/visit/visit.css";

export const metadata: Metadata = {
  title: "Visit the café",
  description: "Our café and roastery bar on Mill Race Road: hours, directions and what's on the bar.",
  alternates: { canonical: "/visit" },
};

/* Visit: hero with the live open-now pill, the week's hours, the town plan
   and directions, the bar menu and the Saturday cupping. Static; the open-now
   pill and today's row are small client islands that render after mount. */
export default function VisitPage() {
  return (
    <>
      <VisitHero />
      <HoursSection />
      <FindUs />
      <BarMenu />
      <Cupping />
      <VisitClosing />
    </>
  );
}
