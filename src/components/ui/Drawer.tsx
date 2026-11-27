"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { lockScroll, unlockScroll } from "@/lib/motion/lenis";
import { prefersReducedMotion } from "@/lib/motion/env";

/* ==========================================================================
   Drawer / dialog on the native <dialog> element (showModal): the rest of
   the page becomes inert, focus is trapped inside, Esc closes, and focus
   returns to whatever opened it. Slides in from the right or left, or wipes
   down full-screen (side="full", used by the mobile menu). The contents
   mount on first open, so closed drawers cost nothing at page load.
   ========================================================================== */

const CLOSE_MS = 560;

export function Drawer({
  open,
  onClose,
  side = "right",
  label,
  labelledBy,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left" | "full";
  /** Accessible name when there is no visible heading to point at. */
  label?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  // The contents render from the first open on (and stay for the close animation and later opens),
  // so a closed drawer adds no markup to the page and nothing to hydrate on load.
  const [hasOpened, setHasOpened] = useState(open);
  if (open && !hasOpened) setHasOpened(true);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      clearTimeout(closeTimer.current);
      if (!dialog.open) {
        returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        dialog.showModal();
        lockScroll();
      }
      // Two frames so the closed state paints before the transition starts.
      requestAnimationFrame(() => requestAnimationFrame(() => (dialog.dataset.state = "open")));
    } else if (dialog.open) {
      dialog.dataset.state = "closing";
      const finish = () => {
        dialog.close();
        delete dialog.dataset.state;
        unlockScroll();
        returnFocus.current?.focus({ preventScroll: true });
      };
      if (prefersReducedMotion()) finish();
      else closeTimer.current = setTimeout(finish, CLOSE_MS);
    }
  }, [open]);

  useEffect(
    () => () => {
      clearTimeout(closeTimer.current);
      if (ref.current?.open) unlockScroll();
    },
    [],
  );

  return (
    <dialog
      ref={ref}
      className={cn("drawer", className)}
      data-side={side}
      aria-label={labelledBy ? undefined : label}
      // The heading it points at only exists once the contents have rendered (see hasOpened).
      aria-labelledby={hasOpened ? labelledBy : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // A click on the ::backdrop lands on the dialog element itself.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-full flex-col">{hasOpened ? children : null}</div>
    </dialog>
  );
}
