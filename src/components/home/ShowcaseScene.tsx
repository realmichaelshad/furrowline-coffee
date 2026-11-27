"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Scene, type SceneSetup } from "@/components/motion/Scene";
import { isDesktopScene, isShowcaseLinear } from "@/lib/motion/env";
import { scrollToTarget } from "@/lib/motion/lenis";

/* ==========================================================================
   Pinned horizontal scroll for the signature four (desktop, fine pointer,
   motion allowed). Everything is transform-only:
   - the track slides left as the page scrolls (pin + scrub)
   - each bag turns from -14° to 6° and drifts up while its panel crosses
   - the arched photo drifts against the panel (parallax)
   - progress bar + active name in ShowcaseNav follow along
   - a pause between panels snaps to the nearest whole panel
   Keyboard: focus entering a panel scrolls the page to that panel; the nav
   buttons jump to a panel. On revert everything returns to the stacked
   layout (no data-pinned).
   ========================================================================== */

const GOTO = "showcase:goto";

const setup: SceneSetup = ({ gsap }, root) => {
  if (!isDesktopScene() || isShowcaseLinear()) return;
  const track = root.querySelector<HTMLElement>("[data-showcase-track]");
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-panel]"));
  if (!track || panels.length < 2) return;

  root.dataset.pinned = "";
  const progress = root.querySelector<HTMLElement>("[data-showcase-progress]");
  const navButtons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-showcase-goto]"));
  const counter = root.querySelector<HTMLElement>("[data-showcase-count]");
  const distance = () => track.scrollWidth - window.innerWidth;
  let active = -1;

  const setActive = (i: number) => {
    if (i === active) return;
    active = i;
    navButtons.forEach((b, j) => (j === i ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")));
    if (counter) counter.textContent = String(i + 1).padStart(2, "0");
  };
  setActive(0);

  // Pinning adds the slide distance to the page height. A visitor who is already past the section
  // (a reload part-way down the page) keeps looking at the same thing.
  const past = root.getBoundingClientRect().bottom <= 0;
  const heightBefore = document.documentElement.scrollHeight;

  const slide = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.9,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // A pause between panels settles on the nearest whole panel, never on half of one.
      snap: {
        snapTo: 1 / (panels.length - 1),
        duration: { min: 0.25, max: 0.7 },
        delay: 0.12,
        ease: "power2.inOut",
        inertia: false,
      },
      onUpdate(self) {
        if (progress) progress.style.transform = `scaleX(${0.25 + self.progress * 0.75})`;
        setActive(Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1))));
      },
    },
  });

  if (past) {
    const grew = document.documentElement.scrollHeight - heightBefore;
    if (grew !== 0) scrollToTarget(window.scrollY + grew, { immediate: true });
  }

  panels.forEach((panel) => {
    const sub = { trigger: panel, containerAnimation: slide, start: "left right", end: "right left", scrub: true } as const;
    const bag = panel.querySelector("[data-panel-bag]");
    const photo = panel.querySelector("[data-panel-photo] [data-reveal-zoom]");
    const copy = panel.querySelector("[data-panel-copy]");
    if (bag) gsap.fromTo(bag, { rotate: -14, yPercent: 10, xPercent: 18 }, { rotate: 6, yPercent: -8, xPercent: -14, ease: "none", scrollTrigger: sub });
    if (photo) gsap.fromTo(photo, { xPercent: -9, scale: 1.2 }, { xPercent: 9, scale: 1.2, ease: "none", scrollTrigger: sub });
    if (copy) gsap.fromTo(copy, { x: 110, opacity: 0.3 }, { x: 0, opacity: 1, ease: "none", scrollTrigger: { ...sub, end: "center center" } });
  });

  const scrollToPanel = (i: number, immediate: boolean) => {
    const st = slide.scrollTrigger;
    if (!st) return;
    const y = st.start + (st.end - st.start) * (i / (panels.length - 1));
    scrollToTarget(y, { immediate });
  };

  const onFocus = (e: FocusEvent) => {
    const panel = (e.target as Element | null)?.closest<HTMLElement>("[data-panel]");
    if (!panel) return;
    const i = panels.indexOf(panel);
    if (i >= 0) scrollToPanel(i, true);
  };
  const onGoto = (e: Event) => scrollToPanel((e as CustomEvent<number>).detail, false);
  track.addEventListener("focusin", onFocus);
  root.addEventListener(GOTO, onGoto);

  return () => {
    track.removeEventListener("focusin", onFocus);
    root.removeEventListener(GOTO, onGoto);
    delete root.dataset.pinned;
  };
};

export function ShowcaseScene(props: ComponentPropsWithoutRef<"div">) {
  return <Scene setup={setup} {...props} />;
}

/**
 * Progress, counter and jump-to buttons; only shown while the scene is pinned. Comes before the
 * panels in the DOM so keyboard users meet the jump buttons first, and steps down below the
 * site header whenever the header is showing (see showcase.css).
 */
export function ShowcaseNav({ names }: { names: string[] }) {
  return (
    <nav className="showcase-nav" aria-label="Signature coffees">
      <p className="font-mono text-micro tabular-nums" aria-hidden="true">
        <span data-showcase-count>01</span> / {String(names.length).padStart(2, "0")}
      </p>
      <span className="showcase-progress" aria-hidden="true">
        <span data-showcase-progress />
      </span>
      <ul className="flex flex-wrap gap-x-5 gap-y-1">
        {names.map((name, i) => (
          <li key={name}>
            <button
              type="button"
              data-showcase-goto
              className="showcase-goto"
              onClick={(e) =>
                e.currentTarget.closest("[data-showcase-viewport]")?.dispatchEvent(new CustomEvent(GOTO, { detail: i }))
              }
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
