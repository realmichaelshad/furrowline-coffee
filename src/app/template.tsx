import { ViewTransition, type ReactNode } from "react";

/* ==========================================================================
   Page transitions. The template remounts on every top-level navigation,
   so React's <ViewTransition> plays its exit/enter pair through the View
   Transitions API (Next navigations are transitions). The header is pinned
   with its own view-transition-name so only the page content moves.
   Browsers without the API get a short CSS fade on .page-enter after the
   first client navigation (see globals.css); reduced motion: instant swap.
   ========================================================================== */

export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div className="page-enter">{children}</div>
    </ViewTransition>
  );
}
