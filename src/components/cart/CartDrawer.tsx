"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { EmptyState } from "@/components/ui/States";
import { ProductImage } from "@/components/product/ProductImage";
import { Mark } from "@/components/brand/Mark";
import { formatPrice } from "@/lib/pricing";
import { MAX_QTY, lineKey, type PricedLine } from "@/lib/cart";
import { defaultPick } from "@/lib/product-options";
import { PRODUCTS, SIGNATURE_COFFEES, type Product } from "@/content/products";
import { cn } from "@/lib/cn";
import { useCart } from "./CartProvider";

/* ==========================================================================
   Cart drawer: lines with quantity and remove, free-shipping progress,
   subscription savings, totals, a designed empty state, and a checkout
   button that explains checkout is switched off in this concept.
   Focus never falls back to the page behind the dialog: removing a line
   moves it to the next line (or the empty state), Checkout moves it to the
   note and "Back to cart" back to the button, and a "Pairs well with" add
   moves it to the new line.
   ========================================================================== */

/** Where focus goes once the change that caused it has rendered. */
type FocusIntent = { to: "line"; index: number } | { to: "key"; key: string } | { to: "empty" } | { to: "note" } | { to: "checkout" };

function applyFocusIntent(root: HTMLElement | null, intent: FocusIntent | null): void {
  if (!root || !intent) return;
  let target: HTMLElement | null = null;
  if (intent.to === "line") {
    const removes = root.querySelectorAll<HTMLElement>("[data-line-remove]");
    target = removes[Math.min(intent.index, removes.length - 1)] ?? null;
  } else if (intent.to === "key") {
    target = root.querySelector<HTMLElement>(`[data-line-key="${CSS.escape(intent.key)}"] [data-line-name]`);
  } else {
    target = root.querySelector<HTMLElement>(`[data-focus="${intent.to}"]`);
  }
  // Nothing better to land on: the empty state's first action, then the dialog title.
  (target ?? root.querySelector<HTMLElement>('[data-focus="empty"]') ?? root.querySelector<HTMLElement>("#cart-title"))?.focus();
}

function ShippingProgress() {
  const { totals } = useCart();
  return (
    <div className="px-6 pb-5">
      <p className="mb-2.5 flex items-center gap-2 text-small" aria-live="polite">
        <Icon name="truck" className="size-4 shrink-0 text-clay" />
        {totals.qualifies ? (
          <span>
            <strong className="font-semibold">Free shipping</strong> is on us.
          </span>
        ) : (
          <span>
            Add <strong className="font-semibold">{formatPrice(totals.remaining)}</strong> more for free shipping.
          </span>
        )}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-espresso/10" role="presentation">
        <div
          className="h-full origin-left rounded-full bg-clay transition-transform duration-700 ease-[var(--ease-out-expo)]"
          style={{ transform: `scaleX(${totals.progress})` }}
        />
      </div>
    </div>
  );
}

function LineItem({ priced, onRemove }: { priced: PricedLine; onRemove: () => void }) {
  const { setQty, close } = useCart();
  const { line, product } = priced;
  const isSub = line.purchase.mode === "subscribe";
  return (
    <li className="grid animate-[fade-up_500ms_var(--ease-out-expo)_both] grid-cols-[5.5rem_1fr] gap-4 py-5" data-line-key={line.key}>
      <Link
        href={`/shop/${product.slug}`}
        onClick={close}
        className="relative block aspect-[320/460] overflow-hidden rounded-[var(--radius-sm)] p-1.5"
        style={{ background: product.palette.stage }}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage product={product} variant={line.variant} alt="" sizes="88px" className="!h-full object-contain" />
      </Link>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/shop/${product.slug}`} onClick={close} className="display link-sweep text-[1.25rem] leading-tight" data-line-name>
              {product.name}
            </Link>
            {priced.optionsLabel && <p className="mt-1 text-micro text-bark">{priced.optionsLabel}</p>}
          </div>
          <div className="shrink-0 text-right font-mono text-small tabular-nums">
            {isSub && (
              <s className="block text-micro text-bark">
                <span className="sr-only">Regular price </span>
                {formatPrice(priced.regularUnit * line.qty)}
              </s>
            )}
            <span>{formatPrice(priced.total)}</span>
          </div>
        </div>
        {/* Purchase mode only means something for coffee (gear is always a one-off). Both modes use the
            same chip, so one-time and subscription lines keep the same rhythm. */}
        {product.type === "coffee" && (
          <p className="mt-2">
            {line.purchase.mode === "subscribe" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-moss/12 px-2.5 py-1 text-micro font-semibold text-moss">
                <Icon name="repeat" className="size-3.5" />
                Every {line.purchase.every} weeks · save 10%
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-espresso/6 px-2.5 py-1 text-micro font-semibold text-bark">
                One-time
              </span>
            )}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            value={line.qty}
            max={MAX_QTY}
            min={1}
            onChange={(qty) => setQty(line.key, qty)}
            label={`Quantity of ${product.name}`}
          />
          <button
            type="button"
            onClick={onRemove}
            data-line-remove
            className="link-sweep text-micro font-semibold text-bark hover:text-espresso"
            aria-label={`Remove ${product.name} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

/** Two quiet suggestions under the lines: gear if there is none yet, otherwise another signature coffee. */
function PairsWell({ onAdd }: { onAdd: (key: string) => void }) {
  const { totals, add } = useCart();
  const inCart = new Set(totals.lines.map((l) => l.product.slug));
  const hasGear = totals.lines.some((l) => l.product.type !== "coffee");
  const pool: Product[] = hasGear
    ? SIGNATURE_COFFEES.filter((c) => !inCart.has(c.slug))
    : PRODUCTS.filter((p) => p.type === "gear" && !inCart.has(p.slug));
  const picks = pool.slice(0, 2);
  if (totals.lines.length > 2 || picks.length === 0) return null;
  return (
    <section className="mt-2 rounded-[var(--radius-md)] bg-parchment/70 p-4" aria-labelledby="pairs-title">
      <h3 id="pairs-title" className="eyebrow mb-3 text-bark">
        Pairs well with
      </h3>
      <ul className="grid gap-3">
        {picks.map((product) => {
          const pick = defaultPick(product);
          return (
            <li key={product.slug} className="flex items-center gap-3">
              <span className="block w-11 shrink-0">
                <ProductImage product={product} alt="" sizes="44px" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="display block truncate text-[1.0625rem] leading-tight">{product.name}</span>
                <span className="font-mono text-micro text-bark">{formatPrice(pick.unit)}</span>
              </span>
              <button
                type="button"
                className="icon-btn size-9 shrink-0"
                aria-label={`Add ${product.name} to cart, ${formatPrice(pick.unit)}`}
                onClick={() => {
                  onAdd(lineKey(pick.line));
                  void add(pick.line, { openDrawer: false });
                }}
              >
                <Icon name="plus" className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * The scrolling list of lines. While more content sits below the fold, its bottom edge fades out
 * (data-more), so a half-visible row reads as "scroll for more", not as cut off.
 */
function ScrollArea({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const more = el.scrollTop + el.clientHeight < el.scrollHeight - 4;
      if (more) el.dataset.more = "";
      else delete el.dataset.more;
    };
    update();
    const resize = new ResizeObserver(update);
    resize.observe(el);
    Array.from(el.children).forEach((child) => resize.observe(child));
    const mutations = new MutationObserver(update);
    mutations.observe(el, { childList: true, subtree: true });
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      resize.disconnect();
      mutations.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, []);
  return (
    <div ref={ref} className="cart-scroll flex-1 overflow-y-auto overscroll-contain px-6 pb-5 rule-t" data-lenis-prevent>
      {children}
    </div>
  );
}

function CheckoutNote({ onBack }: { onBack: () => void }) {
  const { close } = useCart();
  return (
    <div className="animate-[fade-up_500ms_var(--ease-out-expo)_both] rounded-[var(--radius-md)] bg-espresso p-6 text-parchment" role="status">
      <Mark className="mb-4 h-9 w-auto" color="var(--color-peach)" />
      <h3 className="display text-h3 outline-none" tabIndex={-1} data-focus="note">
        Checkout is resting today
      </h3>
      <p className="mt-2 text-small text-mist">
        Furrowline is a concept store, so no payment is taken and nothing ships. Everything up to this point works
        exactly as it would in a live shop.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="light" size="sm" onClick={close}>
          Keep browsing
        </Button>
        <button type="button" onClick={onBack} className="link-sweep text-small font-semibold text-parchment">
          Back to cart
        </button>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { isOpen, close, remove, totals, ready } = useCart();
  const [checkout, setCheckout] = useState(false);
  // Every open starts on the cart, however the drawer was closed last time (Esc, backdrop, X, Keep browsing).
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setCheckout(false);
  }
  const empty = ready && totals.lines.length === 0;
  const body = useRef<HTMLDivElement>(null);
  const intent = useRef<FocusIntent | null>(null);
  const focusNext = (next: FocusIntent) => {
    intent.current = next;
  };
  // Runs after the lines or the footer change, when the element focus should move to exists.
  useEffect(() => {
    applyFocusIntent(body.current, intent.current);
    intent.current = null;
  }, [totals.lines, checkout]);

  return (
    <Drawer open={isOpen} onClose={close} labelledBy="cart-title">
      <div ref={body} className="contents">
        <header className="flex items-center justify-between px-6 pt-6 pb-5">
          <h2 id="cart-title" tabIndex={-1} className="display flex items-baseline gap-2 text-h2 outline-none">
            Your cart
            <span className="font-mono text-small text-bark tabular-nums">({totals.itemCount})</span>
          </h2>
          <button type="button" onClick={close} className="icon-btn" aria-label="Close cart">
            <Icon name="close" className="size-5" />
          </button>
        </header>

        {empty ? (
          <div className="flex flex-1 items-center justify-center rule-t">
            <EmptyState
              title="Your cart is empty"
              art={<EmptyBagArt />}
              actions={
                <>
                  <Button href="/shop" size="sm" onClick={close} icon="arrow" data-focus="empty">
                    Shop coffee
                  </Button>
                  <Button href="/#find-your-coffee" size="sm" variant="outline" onClick={close}>
                    Find your coffee
                  </Button>
                </>
              }
            >
              Nothing in the hopper yet. Start with a signature coffee, or let three quick questions pick one for you.
            </EmptyState>
          </div>
        ) : (
          <>
            <ShippingProgress />
            <ScrollArea>
              <ul className="divide-y divide-[var(--rule)]">
                {totals.lines.map((priced, index) => (
                  <LineItem
                    key={priced.line.key}
                    priced={priced}
                    onRemove={() => {
                      focusNext(totals.lines.length > 1 ? { to: "line", index } : { to: "empty" });
                      remove(priced.line.key);
                    }}
                  />
                ))}
              </ul>
              <PairsWell onAdd={(key) => focusNext({ to: "key", key })} />
            </ScrollArea>
            <footer className="rule-t bg-parchment/60 px-6 pt-5 pb-6">
              {checkout ? (
                <CheckoutNote
                  onBack={() => {
                    focusNext({ to: "checkout" });
                    setCheckout(false);
                  }}
                />
              ) : (
                <>
                  <dl className="grid gap-1.5 text-small">
                    <div className="flex justify-between">
                      <dt className="text-bark">Subtotal</dt>
                      <dd className="font-mono tabular-nums">{formatPrice(totals.regularSubtotal)}</dd>
                    </div>
                    {totals.savings > 0 && (
                      <div className="flex justify-between text-moss">
                        <dt className="flex items-center gap-1.5 font-semibold">
                          <Icon name="repeat" className="size-3.5" /> Subscription savings
                        </dt>
                        <dd className="font-mono tabular-nums">
                          <span className="sr-only">minus </span>−{formatPrice(totals.savings)}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-bark">Shipping</dt>
                      <dd className={cn("font-mono tabular-nums", totals.shipping === 0 && "text-moss")}>
                        {totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
                      </dd>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between border-t border-[var(--rule)] pt-3">
                      <dt className="font-semibold">Total</dt>
                      <dd className="display text-h3 tabular-nums">{formatPrice(totals.total)}</dd>
                    </div>
                  </dl>
                  <Button
                    variant="dark"
                    size="lg"
                    block
                    className="mt-5"
                    icon="arrow"
                    data-focus="checkout"
                    onClick={() => {
                      focusNext({ to: "note" });
                      setCheckout(true);
                    }}
                  >
                    Checkout
                  </Button>
                  {totals.hasSubscription && (
                    <p className="mt-3 text-center text-micro text-bark">
                      Subscriptions renew on schedule. Skip, pause or cancel any time.
                    </p>
                  )}
                </>
              )}
            </footer>
          </>
        )}
      </div>
    </Drawer>
  );
}

function EmptyBagArt() {
  return (
    <svg viewBox="0 0 200 150" className="w-full">
      <ellipse cx="100" cy="140" rx="70" ry="6" fill="#241913" opacity="0.1" />
      <path
        d="M66 30H134L136 46C139 80 141 110 142 128C142 134 138 138 132 138H68C62 138 58 134 58 128C59 110 61 80 64 46Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="4 4"
      />
      <path d="M66 42H134" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${80 + i * 12} 66C${92 + i * 12} 82 ${78 + i * 12} 104 ${88 + i * 12} 122`} fill="none" stroke="#a4472a" strokeWidth="1.6" opacity={0.7 - i * 0.12} />
      ))}
    </svg>
  );
}
