"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion/env";

/* ==========================================================================
   FLIP for a reordering list, on the Web Animations API (transform and
   opacity only, no GSAP). Usage:
     const flip = useFlipGrid(entries);
     flip.capture();            // right before the state change
     <ul ref={flip.ref}> … <li data-flip-key={entry.key}> … </ul>
     {flip.leaving.map(…)}       // render leavers inside the same list
   - Staying items glide from where they were to where they are now.
   - Entering items rise and fade in with a short stagger.
   - Leaving items are kept for a moment, absolutely positioned where they
     were, fade and scale out, then drop from the DOM. They are inert and
     hidden from assistive tech the whole time.
   React reorders the real children (never CSS `order`), so the tab order
   always matches what is on screen. Under reduced motion, or when capture()
   was not called, changes are instant.
   Rects are viewport-relative, so a shift of the whole list (chips row,
   scroll clamping when the page gets shorter) is animated too.
   ========================================================================== */

export interface FlipEntry {
  key: string;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Leaver<T> {
  id: number;
  entry: T;
  /** Position inside the list container, in px. */
  rect: Rect;
}

const EASE_OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IN = "cubic-bezier(0.5, 0, 0.75, 0)";
const ITEM_SELECTOR = ":scope > [data-flip-key]:not([data-leaving])";

function readRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

export function useFlipGrid<T extends FlipEntry>(entries: T[]) {
  const ref = useRef<HTMLUListElement>(null);
  const snapshot = useRef<Map<string, Rect> | null>(null);
  const known = useRef<Map<string, T>>(new Map(entries.map((e) => [e.key, e])));
  const nextId = useRef(0);
  const [leaving, setLeaving] = useState<Array<Leaver<T>>>([]);

  /** Records where every item is right now. Call it just before changing the entries. */
  const capture = useCallback(() => {
    const list = ref.current;
    if (!list || prefersReducedMotion()) {
      snapshot.current = null;
      return;
    }
    const map = new Map<string, Rect>();
    list.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((node) => {
      const key = node.dataset.flipKey;
      if (key) map.set(key, readRect(node));
    });
    snapshot.current = map;
  }, []);

  const signature = entries.map((e) => e.key).join("|");

  useLayoutEffect(() => {
    const list = ref.current;
    const before = snapshot.current;
    const previous = known.current;
    const current = new Map(entries.map((e) => [e.key, e]));
    known.current = current;
    snapshot.current = null;

    if (!list || !before) {
      // Instant change: drop any leavers still on screen.
      setLeaving((l) => (l.length ? [] : l));
      return;
    }

    let entering = 0;
    list.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((node) => {
      const key = node.dataset.flipKey;
      if (!key) return;
      node.getAnimations().forEach((a) => a.cancel());
      const from = before.get(key);
      const to = readRect(node);
      if (from) {
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
        node.animate([{ transform: `translate3d(${dx}px, ${dy}px, 0)` }, { transform: "translate3d(0, 0, 0)" }], {
          duration: 720,
          easing: EASE_OUT_EXPO,
        });
      } else {
        const inView = to.top < window.innerHeight && to.top + to.height > 0;
        node.animate(
          [
            { opacity: 0, transform: "translate3d(0, 1.75rem, 0) scale(0.96)" },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          ],
          { duration: 760, delay: 140 + (inView ? entering++ : entering) * 55, easing: EASE_OUT_EXPO, fill: "backwards" },
        );
      }
    });

    const base = list.getBoundingClientRect();
    const gone: Array<Leaver<T>> = [];
    before.forEach((rect, key) => {
      if (current.has(key)) return;
      const entry = previous.get(key);
      if (!entry) return;
      gone.push({
        id: nextId.current++,
        entry,
        rect: { left: rect.left - base.left, top: rect.top - base.top, width: rect.width, height: rect.height },
      });
    });
    setLeaving((l) => {
      const kept = l.filter((x) => !current.has(x.entry.key));
      return gone.length || kept.length !== l.length ? [...kept, ...gone] : l;
    });
    // `entries` is captured through `signature`; the snapshot is a ref.
  }, [signature]);

  // Start the exit animation for leavers that just mounted, and drop them when done.
  useLayoutEffect(() => {
    const list = ref.current;
    if (!list) return;
    list.querySelectorAll<HTMLElement>(":scope > [data-leaving]:not([data-leave-started])").forEach((node) => {
      node.dataset.leaveStarted = "";
      const id = Number(node.dataset.leaving);
      const anim = node.animate(
        [
          { opacity: 1, transform: "scale(1)" },
          { opacity: 0, transform: "scale(0.92)" },
        ],
        { duration: 340, easing: EASE_IN, fill: "forwards" },
      );
      const done = () => setLeaving((l) => l.filter((x) => x.id !== id));
      anim.onfinish = done;
      anim.oncancel = done;
    });
  }, [leaving]);

  return { ref, capture, leaving };
}
