"use client";

import { useId, useRef, type CSSProperties } from "react";
import { GRINDS, SIZES, SUBSCRIPTION_INTERVALS, isCoffee, sizesFor, type CoffeeProduct, type GearProduct } from "@/content/products";
import { ProductImage } from "@/components/product/ProductImage";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Icon } from "@/components/ui/Icon";
import { SUBSCRIPTION_DISCOUNT } from "@/content/site";
import { MAX_QTY } from "@/lib/cart";
import { ONE_TIME, formatPrice, unitPrice } from "@/lib/pricing";
import { optionsSummary, purchaseLabel, toCartLine } from "@/lib/product-options";
import { cn } from "@/lib/cn";
import { usePdp } from "./PdpProvider";

/* ==========================================================================
   The configurator: live price, size / grind / purchase for coffee (or the
   colour for gear), quantity and add to cart.
   - Every price shown is what the visitor would pay if they picked it
     (sizes include the current grind and plan, and so on).
   - Choices are native radios. Selection fills in with a sweep from below
     (transform), the price rolls to its new value, and the delivery rhythm
     rises in when subscribing.
   ========================================================================== */

export function PriceTag() {
  const { product, options, summary, changes } = usePdp();
  const saving = summary.savings > 0;
  const perBag = isCoffee(product) ? "a bag" : "each";
  const live = `${formatPrice(summary.unit)} ${perBag}${saving ? `, ${formatPrice(summary.regularUnit)} regular. You save ${formatPrice(summary.regularUnit - summary.unit)} on every delivery.` : "."}`;
  return (
    <div className="pdp-price" data-rolled={changes > 0 || undefined}>
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="pdp-price-mask" aria-hidden="true">
          <span key={summary.unit} className="pdp-price-value display">
            {formatPrice(summary.unit)}
          </span>
        </span>
        {saving && (
          <span className="pdp-price-extra flex items-baseline gap-3" aria-hidden="true">
            <s className="font-mono text-small text-bark">{formatPrice(summary.regularUnit)}</s>
            <span className="pdp-save">
              <Icon name="repeat" className="size-3.5" />
              You save {formatPrice(summary.regularUnit - summary.unit)}
            </span>
          </span>
        )}
      </p>
      <p className="mt-2 text-small text-bark">
        {isCoffee(product) ? optionsSummary(product, options) : product.type === "merch" ? "Merch · ships with any order" : "Brewing gear"}
        {summary.perCup !== undefined && <span> · about {formatPrice(summary.perCup)} a cup</span>}
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {live}
      </p>
    </div>
  );
}

function CoffeeOptions({ coffee }: { coffee: CoffeeProduct }) {
  const { options, update } = usePdp();
  const grind = options.grind ?? "whole";
  const purchase = options.purchase;
  const sizes = sizesFor(coffee);
  const grindDetail = GRINDS.find((g) => g.id === grind)?.detail;

  return (
    <>
      <ChoiceGroup
        legend="Size"
        layout="grid"
        className={cn("pdp-sizes", sizes.length === 2 && "pdp-sizes-2")}
        value={options.size ?? "12oz"}
        onChange={(size) => update({ size })}
        choices={sizes.map((s) => ({
          value: s.id,
          label: <span className="display text-[1.375rem] leading-none">{s.label}</span>,
          meta: formatPrice(unitPrice(coffee, { size: s.id, grind, purchase })),
          detail: s.detail,
        }))}
      />

      <div>
        <ChoiceGroup
          legend="Grind"
          className="pdp-grinds"
          value={grind}
          onChange={(g) => update({ grind: g })}
          choices={GRINDS.map((g) => ({
            value: g.id,
            label: g.label,
            meta: g.surcharge > 0 ? `+${formatPrice(g.surcharge, { compact: true })}` : undefined,
          }))}
        />
        <p className="pdp-hint mt-3 flex items-start gap-2 text-micro text-bark" aria-live="polite">
          <Icon name={grind === "whole" ? "leaf" : "info"} className="mt-px size-4 shrink-0" />
          <span key={grind} className="pdp-hint-text">
            {grindDetail}
          </span>
        </p>
      </div>

      <PlanChoice coffee={coffee} />
    </>
  );
}

function PlanChoice({ coffee }: { coffee: CoffeeProduct }) {
  const { options, update } = usePdp();
  const name = useId();
  const subscribed = options.purchase.mode === "subscribe";
  const every = options.purchase.mode === "subscribe" ? options.purchase.every : 2;
  const priceOpts = { size: options.size, grind: options.grind };
  const once = unitPrice(coffee, { ...priceOpts, purchase: ONE_TIME });
  const sub = unitPrice(coffee, { ...priceOpts, purchase: { mode: "subscribe", every } });

  return (
    <fieldset className="pdp-plan min-w-0">
      <legend className="eyebrow mb-3 float-left">Purchase</legend>
      <div className="clear-both grid gap-2">
        <label className="choice pdp-plan-card">
          <input type="radio" name={name} value="once" checked={!subscribed} onChange={() => update({ purchase: ONE_TIME })} />
          <span className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-3">
              <span className="pdp-dot" aria-hidden="true" />
              <span className="text-small font-semibold">One-time purchase</span>
            </span>
            <span className="font-mono text-small tabular-nums">{formatPrice(once)}</span>
          </span>
        </label>

        <div className="pdp-plan-sub" data-active={subscribed || undefined}>
          <label className="choice pdp-plan-card">
            <input
              type="radio"
              name={name}
              value="subscribe"
              checked={subscribed}
              onChange={() => update({ purchase: { mode: "subscribe", every } })}
            />
            <span className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <span className="pdp-dot" aria-hidden="true" />
                <span className="text-small font-semibold">
                  Subscribe &amp; save {Math.round(SUBSCRIPTION_DISCOUNT * 100)}%
                  <Icon name="repeat" className="ml-2 hidden size-4 align-[-3px] xs:inline" />
                </span>
              </span>
              <span className="pdp-plan-price font-mono text-small tabular-nums">
                <s className="text-micro">
                  <span className="sr-only">Regular price </span>
                  {formatPrice(once)}
                </s>
                <span>{formatPrice(sub)}</span>
              </span>
            </span>
            <span className="pl-[1.6rem] text-micro">Roasted to order and sent on your rhythm.</span>
          </label>

          {subscribed && (
            <div className="pdp-plan-every">
              <ChoiceGroup
                legend="Deliver every"
                className="pdp-every"
                value={String(every)}
                onChange={(v) => update({ purchase: { mode: "subscribe", every: Number(v) as 2 | 3 | 4 } })}
                choices={SUBSCRIPTION_INTERVALS.map((n) => ({ value: String(n), label: `${n} weeks` }))}
              />
              <p className="mt-3 flex items-center gap-2 text-micro font-semibold text-moss">
                <Icon name="check" className="size-4" strokeWidth={2} />
                Skip, pause or cancel any time.
              </p>
            </div>
          )}
        </div>
      </div>
    </fieldset>
  );
}

function GearOptions({ gear }: { gear: GearProduct }) {
  const { options, update, prime } = usePdp();
  const name = useId();
  const variants = gear.variants ?? [];
  if (variants.length < 2) return null;
  const current = variants.find((v) => v.id === options.variant) ?? variants[0];
  return (
    <fieldset className="pdp-swatches min-w-0" onPointerEnter={prime} onFocusCapture={prime}>
      <legend className="eyebrow float-left mb-3">Colour</legend>
      <div className="clear-both flex flex-wrap gap-3">
        {variants.map((v) => (
          <label key={v.id} className="pdp-swatch" style={{ "--swatch": v.swatch } as CSSProperties}>
            <input type="radio" name={name} value={v.id} checked={current?.id === v.id} onChange={() => update({ variant: v.id })} />
            <span className="pdp-swatch-chip" aria-hidden="true" />
            <span className="text-small font-semibold">{v.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Quantity, the line preview and the add-to-cart button. The preview's tiny
 * bag becomes the fly-to-cart source only when the big stage art is off
 * screen (phones), so the bag always flies from somewhere visible.
 */
function BuyBlock() {
  const { product, options, qty, setQty, summary } = usePdp();
  const ref = useRef<HTMLDivElement>(null);
  const line = toCartLine(product, options, qty);
  // Coffee: size and grind on one line, the purchase mode on its own line under it, so the plan the
  // visitor just chose is never the part that gets cut off on a phone.
  const coffee = isCoffee(product);
  const item = coffee
    ? [SIZES.find((x) => x.id === options.size)?.label, GRINDS.find((g) => g.id === options.grind)?.label].filter(Boolean).join(" · ")
    : optionsSummary(product, options) || product.name;
  const subscribing = options.purchase.mode === "subscribe";

  const pickFlySource = () => {
    const el = ref.current;
    const art = document.querySelector("[data-pdp-art]");
    if (!el) return;
    const r = art?.getBoundingClientRect();
    const visible = !!r && r.width > 0 && r.bottom > 40 && r.top < window.innerHeight - 40;
    if (visible) el.removeAttribute("data-fly-scope");
    else el.setAttribute("data-fly-scope", "");
  };

  return (
    <div ref={ref} className="pdp-buy" data-pdp-buy onClickCapture={pickFlySource}>
      <div className="pdp-buy-line">
        <span className="pdp-buy-thumb" data-fly-source aria-hidden="true">
          <ProductImage product={product} variant={options.variant} alt="" sizes="48px" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="eyebrow block text-bark">{coffee ? "Your bag" : "Your pick"}</span>
          <span className="mt-1 block text-small leading-snug">{item}</span>
          {coffee && (
            <span className={cn("mt-0.5 flex items-center gap-1.5 text-micro", subscribing ? "font-semibold text-moss" : "text-bark")}>
              {subscribing && <Icon name="repeat" className="size-3.5 shrink-0" />}
              {options.purchase.mode === "subscribe"
                ? `${purchaseLabel(options.purchase)} · ${Math.round(SUBSCRIPTION_DISCOUNT * 100)}% off`
                : "One-time purchase"}
            </span>
          )}
        </span>
        <QuantityStepper value={qty} onChange={setQty} min={1} max={MAX_QTY} label={`Quantity of ${product.name}`} />
      </div>
      <AddToCartButton line={line} size="lg" block magnetic className="pdp-add">
        Add to cart · {formatPrice(summary.total)}
      </AddToCartButton>
    </div>
  );
}

export function Configurator() {
  const { product, changes } = usePdp();
  return (
    <div className="pdp-config" data-touched={changes > 0 || undefined}>
      {isCoffee(product) ? <CoffeeOptions coffee={product} /> : <GearOptions gear={product} />}
      <BuyBlock />
    </div>
  );
}
