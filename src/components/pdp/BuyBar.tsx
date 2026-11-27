"use client";

import { useEffect, useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { formatPrice } from "@/lib/pricing";
import { optionsSummary, toCartLine } from "@/lib/product-options";
import { usePdp } from "./PdpProvider";

/* ==========================================================================
   Phones and tablets: a buy bar slides up from the bottom once the main
   add-to-cart button has scrolled away above the viewport, and slides off
   again when the end of the product content arrives (so it never sits on
   the footer). It is hidden while the cart drawer or the menu is open (CSS,
   any open <dialog>), respects the safe-area inset, and is inert while
   hidden. It only mounts the first time it is needed, so its thumbnail
   never loads with the page.
   ========================================================================== */

export function BuyBar() {
  const { product, options, qty, summary } = usePdp();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(width < 64rem)");
    const buy = document.querySelector("[data-pdp-buy]");
    const end = document.querySelector("[data-pdp-end]");
    if (!buy) return;
    let buyPassed = false;
    let endInView = false;
    let frame = 0;
    const apply = () => {
      const show = query.matches && buyPassed && !endInView;
      if (show) {
        setMounted(true);
        // Two frames so the bar paints off-screen before it slides in.
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => (frame = requestAnimationFrame(() => setVisible(true))));
      } else {
        cancelAnimationFrame(frame);
        setVisible(false);
      }
    };
    // Huge one-sided margins turn "in view" into "in view or below" (buy button) and
    // "in view or above" (end of content), so even a jump past either one is noticed.
    const buyIo = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        buyPassed = !!entry && !entry.isIntersecting;
        apply();
      },
      { rootMargin: "0px 0px 100000px 0px" },
    );
    const endIo = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        endInView = !!entry && entry.isIntersecting;
        apply();
      },
      { rootMargin: "100000px 0px 0px 0px" },
    );
    buyIo.observe(buy);
    if (end) endIo.observe(end);
    query.addEventListener("change", apply);
    return () => {
      buyIo.disconnect();
      endIo.disconnect();
      query.removeEventListener("change", apply);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!mounted) return null;
  const summaryText = optionsSummary(product, options);

  return (
    <div
      className="pdp-buybar"
      data-visible={visible || undefined}
      data-fly-scope
      inert={!visible}
      aria-hidden={!visible || undefined}
    >
      <div className="shell flex items-center gap-3">
        <span className="pdp-buybar-thumb" data-fly-source aria-hidden="true">
          <ProductImage product={product} variant={options.variant} alt="" sizes="48px" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="display block truncate text-[1.125rem] leading-tight">{product.name}</span>
          <span className="block truncate font-mono text-micro text-bark">
            {qty > 1 ? `${qty} × ` : ""}
            {summaryText || formatPrice(summary.unit)}
          </span>
        </span>
        <AddToCartButton line={toCartLine(product, options, qty)} size="md" className="shrink-0">
          Add · {formatPrice(summary.total)}
        </AddToCartButton>
      </div>
    </div>
  );
}
