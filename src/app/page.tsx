import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Showcase } from "@/components/home/Showcase";
import { Marquee } from "@/components/home/Marquee";
import { OriginRoute } from "@/components/home/OriginRoute";
import { StoryTeaser } from "@/components/home/StoryTeaser";
import { QuizSection } from "@/components/home/QuizSection";
import { Shelf } from "@/components/home/Shelf";
import { Newsletter } from "@/components/home/Newsletter";
import { SIGNATURE_COFFEES } from "@/content/products";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const notes = SIGNATURE_COFFEES.flatMap((c) => c.notes);

/* Home: the flagship. No <Suspense> wrappers around server sections: the
   page must hydrate in one pass before InteractionLayer marks reveals. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Showcase />
      <Marquee
        label="Tasting notes from the signature four"
        rows={[
          { items: notes.slice(0, 6), style: "serif", direction: 1 },
          { items: notes.slice(6), style: "outline", direction: -1 },
        ]}
      />
      <OriginRoute />
      <StoryTeaser />
      <QuizSection />
      <Shelf />
      <Newsletter />
    </>
  );
}
