"use client";

import type { MouseEvent } from "react";
import { Button } from "@/components/ui/Button";
import { scrollToElement } from "./scroll";

/* "Start an inquiry": scrolls to the form (smoothly once Lenis runs) and
   moves focus to the form's heading so keyboard and screen-reader users
   land where the eye does. Without JS it is a plain #inquiry link. */
export function InquiryButton({ className }: { className?: string }) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const section = document.getElementById("inquiry");
    if (!section) return;
    event.preventDefault();
    scrollToElement(section, -8);
    document.getElementById("inquiry-title")?.focus({ preventScroll: true });
    window.history.replaceState(null, "", "#inquiry");
  };
  return (
    <Button href="#inquiry" size="lg" icon="arrow-down" magnetic className={className} onClick={onClick} prefetch={false} data-scroll="manual">
      Start an inquiry
    </Button>
  );
}
