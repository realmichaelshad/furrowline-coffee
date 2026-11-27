"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Desktop facet menu: a disclosure button and a panel that drops below the
   sticky toolbar. Esc closes and returns focus to the button; a click
   outside or tabbing away closes it. The closed panel is visibility:hidden,
   so it is neither focusable nor announced. Opacity, transform only.
   ========================================================================== */

export function FacetPopover({
  label,
  activeCount,
  muted,
  align = "start",
  children,
}: {
  label: string;
  /** Number of picked values, shown as a badge on the button. */
  activeCount: number;
  /** Dim the button (the facet does not apply to the current type). */
  muted?: boolean;
  align?: "start" | "end";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    // Esc closes from anywhere (a click on a chip label can leave focus on <body>).
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const active = document.activeElement;
      const inside = !active || active === document.body || wrapRef.current?.contains(active);
      setOpen(false);
      if (inside) buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onBlur={(e) => {
        // Tabbing to something outside closes it; clicks outside are handled by pointerdown.
        const next = e.relatedTarget as Node | null;
        if (open && next && !wrapRef.current?.contains(next)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="facet-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        data-muted={muted || undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{label}</span>
        {activeCount > 0 && (
          <span className="facet-trigger-count">
            {activeCount}
            <span className="sr-only"> selected</span>
          </span>
        )}
        <Icon name="chevron-down" className="facet-trigger-chev size-4" />
      </button>
      <div id={panelId} className={cn("facet-panel", align === "end" && "facet-panel-end")} data-open={open || undefined}>
        {children}
      </div>
    </div>
  );
}
