import type { Metadata } from "next";
import { WholesaleHero } from "@/components/wholesale/WholesaleHero";
import { Offer } from "@/components/wholesale/Offer";
import { Steps } from "@/components/wholesale/Steps";
import { Pricing } from "@/components/wholesale/Pricing";
import { Voices } from "@/components/wholesale/Voices";
import { Inquiry } from "@/components/wholesale/Inquiry";

export const metadata: Metadata = {
  title: "Wholesale",
  description: "Coffee, training and equipment support for cafés, restaurants and offices.",
  alternates: { canonical: "/wholesale" },
};

/* Wholesale: the bar photo hero, what an account gets, how it works (the
   page's scroll scene), indicative pricing, two sample quotes and the
   inquiry form. No defer-render here: the hero's "Start an inquiry" scrolls
   straight to the form and needs real section heights to land on it. */
export default function WholesalePage() {
  return (
    <>
      <WholesaleHero />
      <Offer />
      <Steps />
      <Pricing />
      <Voices />
      <Inquiry />
    </>
  );
}
