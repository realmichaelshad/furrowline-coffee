"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import { Texture } from "@/components/illustration/Texture";
import "@/components/not-found/not-found.css";

/* ==========================================================================
   Route error boundary. The header, footer and cart stay put (they live in
   the root layout); only the page area is replaced. "Try again" re-renders
   the segment with reset(); the home link is the way out. Focus moves to the
   alert panel so keyboard and screen-reader users land on the message.
   ========================================================================== */

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    document.getElementById("err-panel")?.focus({ preventScroll: true });
  }, [error]);

  return (
    <section className="shell pt-[calc(var(--header-h)+clamp(3rem,8vw,6rem))] pb-section" aria-labelledby="err-title">
      <Eyebrow className="hero-fade mb-6 text-bark">Something went sideways</Eyebrow>
      <Lines
        as="h1"
        id="err-title"
        hero
        lines={["That didn't pour", <em key="em">quite right.</em>]}
        className="display text-display-l"
      />

      <div id="err-panel" tabIndex={-1} className="err-panel hero-fade outline-none" role="alert" style={{ ["--delay" as string]: "380ms" }}>
        <Texture id="square-a" fit="cover" position="85% 40%" className="text-clay/[0.08]" />
        <div className="flex max-w-[46rem] flex-col gap-6 sm:flex-row sm:items-start">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-error/10 text-error" aria-hidden="true">
            <Icon name="alert" className="size-6" />
          </span>
          <div>
            <h2 className="display text-h3 text-error">This page didn&apos;t load</h2>
            <p className="mt-2 max-w-[52ch] text-body text-bark">
              A hiccup on our side, not yours. Your cart is safe. Try once more, or head back to the start of the line.
            </p>
            {error.digest && (
              <p className="mt-3 font-mono text-micro text-bark">Reference {error.digest}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => reset()} icon="repeat" iconPosition="start">
                Try again
              </Button>
              <Button href="/" variant="outline" icon="arrow">
                Back home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
