import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { ShopMeta } from "@/components/shop/ShopMeta";
import { SubscribeBand } from "@/components/shop/SubscribeBand";
import { BrewBanner } from "@/components/shop/BrewBanner";

export const metadata: Metadata = {
  title: "Shop coffee and brewing gear",
  description: "Seasonal single origins, our house espresso, decaf and brewing gear. Roasted Tuesdays and Fridays.",
  alternates: { canonical: "/shop" },
};

/* Shop: a static page. The grid ships unfiltered in the HTML; the one client
   island (ShopBrowser) applies ?type=…&roast=… after hydration and animates
   every change. The editorial tiles are server-rendered and passed in. */
export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="The shop"
        title={["Coffee, gear", <em key="em">and good habits.</em>]}
        lead="Roasted Tuesdays and Fridays, shipped within 48 hours."
        aside={<ShopMeta />}
      />
      <ShopBrowser subscribeBand={<SubscribeBand />} brewBanner={<BrewBanner />} />
    </>
  );
}
