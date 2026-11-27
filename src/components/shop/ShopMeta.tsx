import type { ReactNode } from "react";
import { SHIPPING, SUBSCRIPTION_DISCOUNT } from "@/content/site";
import { formatPrice } from "@/lib/pricing";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ArrowLink } from "@/components/ui/Button";
import { NextRoast } from "./NextRoast";

/* The shop header's aside: three facts a buyer wants before scrolling, and
   the way out for anyone who doesn't know where to start. */
export function ShopMeta() {
  const rows: Array<{ icon: IconName; label: string; value: ReactNode }> = [
    { icon: "truck", label: "Shipping", value: `Free over ${formatPrice(SHIPPING.freeOver, { compact: true })}` },
    { icon: "repeat", label: "Subscribe", value: `Save ${Math.round(SUBSCRIPTION_DISCOUNT * 100)}% on every bag` },
    { icon: "flame", label: "Next roast", value: <NextRoast /> },
  ];
  return (
    <div className="lg:pl-6">
      <dl className="shop-meta">
        {rows.map((row) => (
          <div key={row.label} className="shop-meta-row">
            <dt className="eyebrow flex shrink-0 items-center gap-2.5 text-bark">
              <Icon name={row.icon} className="size-4 shrink-0 text-clay" />
              {row.label}
            </dt>
            <dd className="text-small font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>
      <ArrowLink href="/#find-your-coffee" className="mt-6 text-small">
        Not sure? Three questions
      </ArrowLink>
    </div>
  );
}
