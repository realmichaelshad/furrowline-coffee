import type { Metadata } from "next";
import { StoryOpening } from "@/components/story/StoryOpening";
import { Founder } from "@/components/story/Founder";
import { FarmToCup } from "@/components/story/FarmToCup";
import { Farms } from "@/components/story/Farms";
import { Values } from "@/components/story/Values";
import { Timeline } from "@/components/story/Timeline";
import { StoryClosing } from "@/components/story/StoryClosing";

export const metadata: Metadata = {
  title: "Our story",
  description: "How a seed warehouse on Mill Race Road became a small-batch roastery, and the farms we buy from.",
  alternates: { canonical: "/our-story" },
};

/* Our Story: the opening and roastery, Nadia's story, the sticky farm-to-cup
   chapters (the page's only GSAP scene), then the farms, what we won't do,
   ten years in six moments and the two next steps. Everything below the
   chapters renders lazily (defer-render). */
export default function OurStoryPage() {
  return (
    <>
      <StoryOpening />
      <Founder />
      <FarmToCup />
      <Farms />
      <Values />
      <Timeline />
      <StoryClosing />
    </>
  );
}
