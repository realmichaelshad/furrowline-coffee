"use client";

import { useEffect, useRef } from "react";
import { motionAllowed } from "@/lib/motion/env";
import { onLenis } from "@/lib/motion/lenis";
import { cn } from "@/lib/cn";
import "./marquee.css";

/* ==========================================================================
   Velocity-reactive marquee. Two rows drift in opposite directions; scroll
   speed is added to the drift and the scroll direction flips it, so the
   notes rush past when you fling the page and idle when you stop.
   transform only, and the loop only runs while the band is on screen.
   Reduced motion: the rows sit still. The band is decorative (aria-hidden);
   the same notes are listed for screen readers.
   ========================================================================== */

interface Row {
  items: string[];
  style: "serif" | "outline";
  direction: 1 | -1;
}

export function Marquee({ rows, label }: { rows: Row[]; label: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !motionAllowed()) return;
    const tracks = Array.from(el.querySelectorAll<HTMLElement>("[data-marquee-track]"));
    const offsets = tracks.map(() => 0);
    const widths = tracks.map((t) => t.scrollWidth / 2);
    let velocity = 0;
    let direction = 1;
    let visible = false;
    let raf = 0;
    let last = performance.now();
    let lastY = window.scrollY;

    const measure = () => tracks.forEach((t, i) => (widths[i] = t.scrollWidth / 2));
    const ro = new ResizeObserver(measure);
    tracks.forEach((t) => ro.observe(t));

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (Math.abs(dy) > 0.5) direction = dy > 0 ? 1 : -1;
      velocity = Math.min(60, velocity + Math.abs(dy) * 0.35);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const detachLenis = onLenis(() => {
      lastY = window.scrollY;
    });

    const tick = (now: number) => {
      if (!motionAllowed()) {
        // Reduced motion switched on mid-visit: settle and stop.
        tracks.forEach((t) => (t.style.transform = ""));
        raf = 0;
        return;
      }
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      velocity *= Math.pow(0.04, dt); // ease back to the idle drift
      const speed = 38 + velocity * 26;
      tracks.forEach((t, i) => {
        const rowDir = Number(t.dataset.direction ?? 1);
        const w = widths[i] || 1;
        let x = (offsets[i] ?? 0) - speed * dt * rowDir * direction;
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        offsets[i] = x;
        t.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      });
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible && !raf && motionAllowed()) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);

    return () => {
      io.disconnect();
      ro.disconnect();
      detachLenis();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      tracks.forEach((t) => (t.style.transform = ""));
    };
  }, []);

  return (
    <div className="marquee" ref={root}>
      <p className="sr-only">
        {label}: {rows.flatMap((r) => r.items).join(", ")}.
      </p>
      <div aria-hidden="true">
        {rows.map((row, r) => (
          <div key={r} className={cn("marquee-row", `marquee-${row.style}`)}>
            <div className="marquee-track" data-marquee-track data-direction={row.direction}>
              {[0, 1].map((copy) => (
                <div key={copy} className="marquee-group">
                  {row.items.map((item) => (
                    <span key={`${copy}-${item}`} className="marquee-item">
                      <span>{item}</span>
                      <span className="marquee-mark" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
