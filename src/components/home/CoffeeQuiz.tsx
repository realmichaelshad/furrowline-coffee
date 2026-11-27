"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { getProduct, type CoffeeProduct } from "@/content/products";
import { ProductImage } from "@/components/product/ProductImage";
import { Texture } from "@/components/illustration/Texture";
import type { TextureId } from "@/content/textures";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { formatPrice } from "@/lib/pricing";
import { defaultPick } from "@/lib/product-options";
import { QUIZ_QUESTIONS, isComplete, scoreQuiz, type QuizDraft, type QuestionId } from "@/lib/quiz";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Find your coffee: three radio questions, then a match from the signature
   four with the reasons behind it and an add-to-cart that flies the bag.
   The match is staged like the showcase panels: the coffee's colour, its
   origin photo in an arch (server-rendered, passed in as `photos`) and the
   bag overlapping it.
   Focus moves to each new question (and to the result) so screen readers
   announce it; Back keeps earlier answers. Logic lives in src/lib/quiz.ts.
   ========================================================================== */

export function CoffeeQuiz({ photos }: { photos: Record<string, ReactNode> }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<QuizDraft>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    heading.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (next: number) => {
    moved.current = true;
    setStep(next);
  };

  const total = QUIZ_QUESTIONS.length;
  const done = step >= total && isComplete(draft);
  const result = done ? scoreQuiz(draft) : null;
  const coffee = result ? (getProduct(result.slug) as CoffeeProduct) : null;
  const pick = coffee ? defaultPick(coffee) : null;

  return (
    <div className="quiz-card" aria-live="off">
      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="eyebrow text-bark">{coffee ? "Your match" : `Question ${step + 1} of ${total}`}</p>
        <ol className="flex gap-1.5" aria-hidden="true">
          {QUIZ_QUESTIONS.map((q, i) => (
            <li key={q.id} className={cn("quiz-pip", (i < step || coffee) && "is-done", i === step && !coffee && "is-current")} />
          ))}
        </ol>
      </div>

      {coffee && result && pick ? (
        <div key="result" className="quiz-step grid gap-8 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" data-fly-scope>
          <div className="quiz-stage" style={{ "--stage": coffee.palette.stage, "--ink": coffee.palette.ink } as CSSProperties}>
            <Texture id={`panel-${coffee.signatureIndex ?? 1}` as TextureId} className="quiz-stage-contours" />
            <div className="quiz-arch">{photos[coffee.slug]}</div>
            <span className="quiz-stage-index">
              N° 0{coffee.signatureIndex} <span className="opacity-70">/ 04</span>
            </span>
            <div className="quiz-bag" data-fly-source>
              <ProductImage product={coffee} sizes="(min-width: 64rem) 9rem, 40vw" />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 ref={heading} tabIndex={-1} className="display text-h1 outline-none">
              {coffee.name}
            </h3>
            <p className="mt-2 text-small text-bark">
              {coffee.originLabel} · {coffee.processLabel}
            </p>
            <ul className="mt-5 grid gap-2.5 text-small text-pretty">
              {result.reasons.map((reason) => (
                <li key={reason} className="flex gap-2.5">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-moss" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
              <AddToCartButton line={pick.line} size="md">
                Add {pick.short} · {formatPrice(pick.unit, { compact: true })}
              </AddToCartButton>
              <Link href={`/shop/${coffee.slug}`} className="arrow-link text-small">
                <span className="link-sweep">See the coffee</span>
                <Icon name="arrow" className="arrow-link-icon size-4" />
              </Link>
            </div>
            <button
              type="button"
              className="link-sweep mt-5 self-start text-micro font-semibold text-bark hover:text-espresso"
              onClick={() => {
                setDraft({});
                go(0);
              }}
            >
              Start over
            </button>
          </div>
        </div>
      ) : (
        <QuestionStep
          key={step}
          index={step}
          draft={draft}
          headingRef={heading}
          onAnswer={(id, value) => setDraft((d) => ({ ...d, [id]: value }))}
          onBack={step > 0 ? () => go(step - 1) : undefined}
          onNext={() => go(step + 1)}
          last={step === total - 1}
        />
      )}
    </div>
  );
}

function QuestionStep({
  index,
  draft,
  headingRef,
  onAnswer,
  onBack,
  onNext,
  last,
}: {
  index: number;
  draft: QuizDraft;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onAnswer: (id: QuestionId, value: string) => void;
  onBack?: () => void;
  onNext: () => void;
  last: boolean;
}) {
  const question = QUIZ_QUESTIONS[index];
  if (!question) return null;
  const value = draft[question.id];
  const name = `quiz-${question.id}`;
  return (
    <form
      className="quiz-step"
      onSubmit={(e) => {
        e.preventDefault();
        if (value) onNext();
      }}
    >
      <h3 id={`${name}-title`} ref={headingRef} tabIndex={-1} className="display text-h2 outline-none">
        {question.title}
      </h3>
      <fieldset aria-labelledby={`${name}-title`}>
        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {question.options.map((option) => (
            <label key={option.value} className="choice quiz-choice">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onAnswer(question.id, option.value)}
              />
              <span className="flex items-center justify-between gap-3">
                <span className="text-body font-semibold">{option.label}</span>
                <span className="quiz-tick" aria-hidden="true">
                  <Icon name="check" className="size-3.5" strokeWidth={2} />
                </span>
              </span>
              <span className="text-micro opacity-75">{option.detail}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-8 flex items-center justify-between gap-4">
        {onBack ? (
          <button type="button" onClick={onBack} className="arrow-link text-small text-bark hover:text-espresso">
            <Icon name="arrow-left" className="size-4" />
            <span className="link-sweep">Back</span>
          </button>
        ) : (
          <span />
        )}
        <Button type="submit" variant="dark" size="md" icon="arrow" disabled={!value}>
          {last ? "See my match" : "Next question"}
        </Button>
      </div>
    </form>
  );
}
