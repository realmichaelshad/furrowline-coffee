"use client";

import { Children, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Brew recipes as an accessible tablist (WAI-ARIA tabs pattern): arrow
   keys, Home and End move between tabs and activate them, only the active
   tab is in the tab order, and each panel is labelled by its tab. Panels
   are server-rendered children; the first one shows in the static HTML.
   The underline slides between tabs (transform only).
   ========================================================================== */

export function BrewTabs({ labels, children, label }: { labels: string[]; children: ReactNode; label: string }) {
  const panels = Children.toArray(children);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const base = useId();

  const select = (i: number, focus = false) => {
    const next = (i + labels.length) % labels.length;
    setActive(next);
    setTouched(true);
    if (focus) tabs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: labels.length - 1 };
    const target = keys[e.key];
    if (target === undefined) return;
    e.preventDefault();
    select(target, true);
  };

  return (
    <div className="pdp-tabs" data-touched={touched || undefined}>
      <div
        role="tablist"
        aria-label={label}
        className="pdp-tablist"
        style={{ "--count": labels.length, "--active": active } as CSSProperties}
      >
        {labels.map((text, i) => (
          <button
            key={text}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className={cn("pdp-tab", i === active && "is-active")}
            onClick={() => select(i)}
            onKeyDown={onKeyDown}
          >
            {text}
          </button>
        ))}
        <span className="pdp-tab-line" aria-hidden="true" />
      </div>
      {panels.map((panel, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${base}-panel-${i}`}
          aria-labelledby={`${base}-tab-${i}`}
          tabIndex={0}
          hidden={i !== active}
          className="pdp-tabpanel"
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
