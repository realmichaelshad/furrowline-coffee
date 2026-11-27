"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NAV } from "@/content/site";
import { CartButton } from "@/components/cart/CartButton";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";

/* ==========================================================================
   Site header: fixed, transparent at the top of the page, a frosted
   parchment bar once scrolled. Slides away while scrolling down and
   returns on any scroll up, focus inside it, or when a drawer is open.
   Desktop: logo · primary nav · cart. Mobile: logo · cart · menu.
   ========================================================================== */

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * `logo` and `menuLogo` are rendered by the (server) layout and passed in, so
 * the outlined wordmark never ships in the client bundle.
 */
export function Header({ logo, menuLogo }: { logo: ReactNode; menuLogo: ReactNode }) {
  const pathname = usePathname();
  const { isOpen: cartOpen, revealCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 24);
      if (y < 160) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      lastY.current = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  // An add to cart brings the header back (the bag flies to its cart button) and it stays until the
  // visitor scrolls down again.
  useEffect(() => {
    if (revealCart) setHidden(false);
  }, [revealCart]);

  const visible = !hidden || menuOpen || cartOpen || revealCart;

  // Other UI that shares the top edge (the pinned showcase's nav) moves out of the header's way.
  useEffect(() => {
    document.documentElement.dataset.header = visible ? "shown" : "hidden";
  }, [visible]);

  return (
    <>
      <header
        className="site-header"
        data-scrolled={scrolled || undefined}
        data-hidden={visible ? undefined : ""}
        onFocusCapture={() => setHidden(false)}
        style={{ viewTransitionName: "site-header" }}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" prefetch={false} className="relative z-10 -my-2 flex items-center py-2" aria-label="Furrowline Coffee Roasters, home">
            {logo}
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1 lg:gap-2">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn("nav-link", active && "is-active")}
                    >
                      <span className="link-sweep">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <CartButton />
            <button
              type="button"
              className="icon-btn md:hidden"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Icon name="menu" className="size-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} logo={menuLogo} />
    </>
  );
}
