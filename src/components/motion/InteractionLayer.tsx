"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getLenis, headerOffset, onLenis } from "@/lib/motion/lenis";
import { hasFinePointer, isShowcaseLinear, motionAllowed, whenIdle } from "@/lib/motion/env";
import { onDomChange } from "@/lib/motion/dom";

/* ==========================================================================
   One client component that powers the attribute-driven interactions, so
   server components can opt in without shipping their own JS:
   - data-reveal="rise|fade|clip|clip-x|scale|lines"   scroll-in reveals
     (optional data-reveal-delay="120" in ms)
   - data-parallax="0.12"                              scroll parallax (speed)
   - data-magnetic                                     magnetic hover (fine pointers)
     with optional [data-magnetic-inner] child that moves further
   - data-cursor="View"                                cursor-follow bubble label
   Nothing is hidden unless motion is allowed AND the element starts below
   the fold, so first paint always shows real content.
   ========================================================================== */

export function InteractionLayer() {
  const pathname = usePathname();
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Lazy textures: mark [data-texture] elements once they come within ~1.5 viewports.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.near = "";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "150% 0px 150% 0px" },
    );
    const scan = () =>
      document.querySelectorAll<HTMLElement>("[data-texture]:not([data-near])").forEach((el) => io.observe(el));
    scan();
    const off = onDomChange(scan);
    return () => {
      io.disconnect();
      off();
    };
  }, [pathname]);

  // Reveals
  useEffect(() => {
    if (!motionAllowed() || isShowcaseLinear()) return;
    const pending = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("reveal-in");
          el.classList.remove("reveal-pending");
          pending.delete(el);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    const scan = () => {
      const fresh = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-ready])"));
      if (!fresh.length) return;
      // Read every position first, then write: one layout for the whole batch, never one per element.
      const vh = window.innerHeight;
      const below = fresh.map((el) => el.getBoundingClientRect().top >= vh * 0.94);
      fresh.forEach((el, i) => {
        el.dataset.revealReady = "";
        const delay = el.dataset.revealDelay;
        if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
        if (!below[i] || el.matches(":focus-within")) return; // already visible or focused: leave it alone
        el.classList.add("reveal-pending");
        pending.add(el);
        io.observe(el);
      });
    };
    // The first pass waits for an idle moment after hydration so its layout read stays off the path to
    // the first paint (and LCP). Everything it may hide is below the fold, out of sight until then.
    let off = () => {};
    const cancelFirstScan = whenIdle(() => {
      scan();
      off = onDomChange(scan);
    }, 600);
    // Keyboard focus never lands on something still waiting to reveal: show it (and its parents) at once.
    const onFocusIn = (e: FocusEvent) => {
      let el = e.target instanceof Element ? e.target.closest<HTMLElement>(".reveal-pending") : null;
      while (el) {
        el.classList.add("reveal-in");
        el.classList.remove("reveal-pending");
        pending.delete(el);
        io.unobserve(el);
        el = el.parentElement?.closest<HTMLElement>(".reveal-pending") ?? null;
      }
    };
    document.addEventListener("focusin", onFocusIn);
    return () => {
      cancelFirstScan();
      document.removeEventListener("focusin", onFocusIn);
      io.disconnect();
      off();
      // Never leave anything hidden behind: un-hide and un-mark whatever is still waiting,
      // so a re-run (route change, strict mode) can pick it up again.
      pending.forEach((el) => {
        el.classList.remove("reveal-pending");
        delete el.dataset.revealReady;
      });
    };
  }, [pathname]);

  // Keep keyboard focus on screen. The browser scrolls a focused element into view, but deferred
  // sections (content-visibility: auto) can change height as they render, which pushes the element
  // back out of view. Check again once layout settles and nudge it into view if needed.
  useEffect(() => {
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const ensureVisible = (el: HTMLElement) => {
      if (document.activeElement !== el || getLenis()?.isScrolling === "smooth") return; // never fight a scripted scroll
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      if (r.top >= headerOffset() && r.bottom <= window.innerHeight) return;
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
    };
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target;
      if (!(el instanceof HTMLElement) || el.closest("dialog") || !el.matches(":focus-visible")) return;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      raf = requestAnimationFrame(() => requestAnimationFrame(() => ensureVisible(el)));
      timer = setTimeout(() => ensureVisible(el), 320);
    };
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  // Parallax
  useEffect(() => {
    if (!motionAllowed() || isShowcaseLinear()) return;
    const items = new Map<HTMLElement, number>();
    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target as HTMLElement);
          else visible.delete(e.target as HTMLElement);
        }
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    const collect = () => {
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        if (items.has(el)) return;
        items.set(el, Number.parseFloat(el.dataset.parallax ?? "0.1") || 0.1);
        io.observe(el);
      });
    };
    collect();
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!motionAllowed()) {
        items.forEach((_, el) => (el.style.transform = ""));
        return;
      }
      const vh = window.innerHeight;
      // Reads first, then writes, so a frame never interleaves layout reads with style writes.
      const moves = Array.from(visible, (el) => {
        const rect = (el.parentElement ?? el).getBoundingClientRect();
        const offset = rect.top + rect.height / 2 - vh / 2;
        return [el, -offset * (items.get(el) ?? 0)] as const;
      });
      for (const [el, y] of moves) el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", request, { passive: true });
    const detach = onLenis((lenis) => lenis?.on("scroll", request));
    const off = onDomChange(() => {
      collect();
      request();
    });
    request();
    return () => {
      window.removeEventListener("scroll", request);
      detach();
      off();
      io.disconnect();
      cancelAnimationFrame(frame);
      items.forEach((_, el) => (el.style.transform = ""));
    };
  }, [pathname]);

  // Magnetic buttons + cursor bubble (fine pointers only)
  useEffect(() => {
    if (!motionAllowed() || !hasFinePointer()) return;
    const bubble = bubbleRef.current;
    let active: HTMLElement | null = null;
    let target = { x: 0, y: 0 };
    let pos = { x: 0, y: 0 };
    let raf = 0;
    let showing = false;

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      if (bubble) bubble.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.3 || showing ? requestAnimationFrame(loop) : 0;
    };

    const release = (el: HTMLElement) => {
      el.style.transform = "";
      const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
      if (inner) inner.style.transform = "";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!motionAllowed()) {
        onLeave();
        return;
      }
      target = { x: e.clientX, y: e.clientY };
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (active && active !== el) release(active);
      active = el;
      if (el) {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        // Clamped, so a wide (block) button drifts as little as a compact one.
        el.style.transform = `translate3d(${clampPx(dx * 0.28, 14)}px, ${clampPx(dy * 0.38, 14)}px, 0)`;
        const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
        if (inner) inner.style.transform = `translate3d(${clampPx(dx * 0.12, 10)}px, ${clampPx(dy * 0.16, 10)}px, 0)`;
      }
      const cursorEl = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]") ?? null;
      const label = cursorEl?.dataset.cursor;
      if (bubble) {
        if (label) {
          if (!showing) {
            pos = { ...target };
          }
          bubble.dataset.label = label;
          const text = bubble.firstElementChild as HTMLElement | null;
          if (text && text.textContent !== label) text.textContent = label;
          bubble.classList.add("is-visible");
          showing = true;
        } else if (showing) {
          bubble.classList.remove("is-visible");
          showing = false;
        }
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    function onLeave() {
      if (active) release(active);
      active = null;
      bubble?.classList.remove("is-visible");
      showing = false;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      cancelAnimationFrame(raf);
      if (active) release(active);
    };
  }, []);

  // Hide the bubble when the route changes under the pointer.
  useEffect(() => {
    bubbleRef.current?.classList.remove("is-visible");
  }, [pathname]);

  return (
    <div ref={bubbleRef} className="view-cursor" aria-hidden="true">
      <span>View</span>
    </div>
  );
}

/** Clamp a magnetic offset to ±max px (one decimal is plenty for a transform). */
function clampPx(value: number, max: number): string {
  return Math.max(-max, Math.min(max, value)).toFixed(1);
}
