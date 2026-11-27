"use client";

import { Icon } from "@/components/ui/Icon";
import { scrollToTarget } from "@/lib/motion/lenis";

export function BackToTop() {
  return (
    <button
      type="button"
      className="group inline-flex items-center gap-2 font-semibold text-parchment"
      onClick={() => {
        scrollToTarget(0);
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
    >
      <span className="link-sweep">Back to top</span>
      <Icon name="arrow-down" className="size-4 rotate-180 transition-transform duration-500 group-hover:-translate-y-0.5" />
    </button>
  );
}
