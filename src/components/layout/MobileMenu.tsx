"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { NAV, SITE } from "@/content/site";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Texture } from "@/components/illustration/Texture";
import { cn } from "@/lib/cn";
import { isActive } from "./Header";

/* ==========================================================================
   Full-screen mobile menu: the panel wipes down (clip-path), then the
   oversized serif links rise in one after another from their line masks.
   A real <dialog>: focus is trapped, Esc closes, focus returns to the
   menu button. Reduced motion: it simply appears.
   ========================================================================== */

const LINKS = [{ href: "/", label: "Home" }, ...NAV];

export function MobileMenu({
  open,
  onClose,
  pathname,
  logo,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  logo: ReactNode;
}) {
  return (
    <Drawer open={open} onClose={onClose} side="full" label="Menu" className="mobile-menu on-dark">
      <div className="relative flex h-full flex-col overflow-hidden">
        <Texture
          id="menu"
          fit="contain"
          className="inset-auto -right-24 -bottom-16 size-[34rem] text-parchment/10"
        />

        <div className="shell flex h-[var(--header-h)] shrink-0 items-center justify-between">
          <Link href="/" prefetch={false} onClick={onClose} aria-label="Furrowline Coffee Roasters, home" className="menu-fade">
            {logo}
          </Link>
          <button type="button" onClick={onClose} className="icon-btn border-parchment/25 text-parchment" aria-label="Close menu">
            <Icon name="close" className="size-5" />
          </button>
        </div>

        <nav aria-label="Mobile" className="shell relative flex flex-1 flex-col justify-center py-8">
          <ul className="grid gap-1">
            {LINKS.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="menu-item" style={{ "--i": i } as CSSProperties}>
                  <Link
                    href={item.href}
                    prefetch={item.href === "/" ? false : undefined}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="group flex items-baseline gap-4 py-1"
                  >
                    <span className="line-mask">
                      {/* .line-inner is display: block (the rise animation); the row layout lives one level in. */}
                      <span className="line-inner">
                        <span className="flex items-start gap-3">
                          <span className="mt-[clamp(0.7rem,3vw,1.15rem)] inline-block w-9 shrink-0 font-mono text-micro tracking-[0.12em] text-mist tabular-nums">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={cn(
                              "display text-[clamp(2.75rem,12vw,4.5rem)] leading-[1.02] transition-colors duration-300 group-hover:text-peach",
                              active && "text-peach italic",
                            )}
                          >
                            {item.label}
                          </span>
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shell menu-fade relative shrink-0 pb-8">
          <div className="rule-t border-parchment/15 pt-6">
            <Button href="/#find-your-coffee" variant="light" size="md" icon="arrow" onClick={onClose} block>
              Find your coffee
            </Button>
            <p className="mt-5 flex items-center justify-between gap-4 text-micro text-mist">
              <span>Roast days: Tuesday &amp; Friday</span>
              <span>{SITE.conceptLine}</span>
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
