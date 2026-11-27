import type { CSSProperties } from "react";
import { SIGNATURE_COFFEES } from "@/content/products";
import { SIGNATURE_PHOTO } from "@/content/photos";
import { Photo } from "@/components/photo/Photo";
import { ProductImage } from "@/components/product/ProductImage";
import { SectionIntro } from "@/components/ui/Typography";
import { CoffeeQuiz } from "./CoffeeQuiz";
import "./quiz.css";

/* (05) Find your coffee: intro and a fan of the four bags beside the quiz. */
export function QuizSection() {
  // The result stage's arched origin photos. Rendered here (server), only mounted with the result.
  const photos = Object.fromEntries(
    SIGNATURE_COFFEES.map((coffee) => [
      coffee.slug,
      // The arch is portrait, so the 3:2 photo covering it renders about 1.5× the arch height wide.
      <Photo key={coffee.slug} slot={SIGNATURE_PHOTO[coffee.slug] ?? "roastery"} fill alt="" sizes="(min-width: 64rem) 30rem, 96vw" />,
    ]),
  );
  return (
    <section id="find-your-coffee" className="quiz-section defer-render" aria-labelledby="quiz-title">
      <div className="shell py-section">
        <div className="grid-editorial items-center gap-y-14">
          <div className="col-span-4 md:col-span-5">
            <SectionIntro
              index={5}
              eyebrow="Find your coffee"
              id="quiz-title"
              title={["Three questions.", "One good bag."]}
              lead="Tell us how you brew and what you like in a cup, and we'll match you with one of the signature four."
            />
            <div className="quiz-fan" aria-hidden="true" data-reveal="rise" data-reveal-delay="240">
              {SIGNATURE_COFFEES.map((coffee, i) => (
                <div key={coffee.slug} className="quiz-fan-bag" style={{ "--i": i } as CSSProperties}>
                  <ProductImage product={coffee} alt="" sizes="(min-width: 64rem) 8rem, 6rem" />
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-4 md:col-span-7 lg:col-span-6 lg:col-start-7">
            <CoffeeQuiz photos={photos} />
          </div>
        </div>
      </div>
    </section>
  );
}
