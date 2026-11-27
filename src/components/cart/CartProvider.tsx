"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getProduct } from "@/content/products";
import {
  CART_STORAGE_KEY,
  cartReducer,
  cartTotals,
  EMPTY_CART,
  parseStoredCart,
  type CartState,
  type CartTotals,
  type NewCartLine,
} from "@/lib/cart";
import { motionAllowed } from "@/lib/motion/env";
import { findCartTarget, flyToCart } from "./fly";

/* ==========================================================================
   Cart state: React context + reducer, persisted to localStorage and kept in
   sync across tabs. add() plays the fly-to-cart animation from `source`,
   then updates the count (which bumps) and opens the drawer.
   ========================================================================== */

export interface AddOptions {
  /** Element to fly into the cart icon (usually the product art). */
  source?: Element | null;
  /** Open the drawer after adding (default true). */
  openDrawer?: boolean;
}

interface CartContextValue {
  /** False until localStorage has been read (avoid flashing "0 items"). */
  ready: boolean;
  state: CartState;
  totals: CartTotals;
  isOpen: boolean;
  /**
   * True from the moment an add starts until just after it lands. The header shows itself for it,
   * even when the visitor had scrolled it away, so the bag always flies to a cart they can see.
   */
  revealCart: boolean;
  /** Increments after every add, to replay the count bump. */
  bump: number;
  add: (line: NewCartLine, opts?: AddOptions) => Promise<void>;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  /** Latest polite announcement for screen readers. */
  announcement: string;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART);
  const [ready, setReady] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [revealCart, setRevealCart] = useState(false);
  const revealTimer = useRef(0);
  const [announcement, setAnnouncement] = useState("");
  const skipWrite = useRef(true);

  // Hydrate from storage once, then follow other tabs.
  useEffect(() => {
    try {
      dispatch({ type: "hydrate", state: parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY)) });
    } catch {
      // Storage blocked (private mode): the cart still works for this page view.
    }
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CART_STORAGE_KEY) return;
      skipWrite.current = true;
      dispatch({ type: "hydrate", state: parseStoredCart(e.newValue) });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (skipWrite.current) {
      skipWrite.current = false;
      return;
    }
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota/privacy errors.
    }
  }, [state, ready]);

  const totals = useMemo(() => cartTotals(state), [state]);

  const add = useCallback(async (line: NewCartLine, opts: AddOptions = {}) => {
    const product = getProduct(line.slug);
    const target = findCartTarget();
    // Bring the header (and its cart button) back first; the flight aims at where it comes to rest.
    window.clearTimeout(revealTimer.current);
    setRevealCart(true);
    if (opts.source && target && motionAllowed()) {
      await flyToCart(opts.source, target);
    }
    dispatch({ type: "add", line });
    setBump((b) => b + 1);
    setAnnouncement(`${product?.name ?? "Item"} added to your cart.`);
    const openDrawer = opts.openDrawer !== false;
    if (openDrawer) {
      window.setTimeout(() => setOpen(true), motionAllowed() ? 260 : 0);
    }
    // Long enough to see the count bump (or for the drawer to take over keeping the header up).
    revealTimer.current = window.setTimeout(() => setRevealCart(false), openDrawer ? 700 : 1600);
  }, []);
  useEffect(() => () => window.clearTimeout(revealTimer.current), []);

  const setQty = useCallback((key: string, qty: number) => dispatch({ type: "setQty", key, qty }), []);
  const remove = useCallback((key: string) => {
    dispatch({ type: "remove", key });
    setAnnouncement("Item removed from your cart.");
  }, []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({ ready, state, totals, isOpen, revealCart, bump, add, setQty, remove, clear, open, close, announcement }),
    [ready, state, totals, isOpen, revealCart, bump, add, setQty, remove, clear, open, close, announcement],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </CartContext.Provider>
  );
}
