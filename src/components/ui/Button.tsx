import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

/* ==========================================================================
   Buttons
   - variant: primary (clay), dark (espresso), outline, outline-light (on dark
     photos and surfaces), light (on dark), ghost
   - Every filled button has the fill sweep (a curved fill rises on hover)
     and the label roll (label slides up, copy slides in). Both transform-only.
   - magnetic: drifts toward the pointer (fine pointers, motion allowed).
   Render as a link by passing `href`, otherwise a <button>.
   ========================================================================== */

export type ButtonVariant = "primary" | "dark" | "outline" | "outline-light" | "light" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface Common {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: "start" | "end";
  magnetic?: boolean;
  /** Stretch to the container width. */
  block?: boolean;
  className?: string;
  children: ReactNode;
}

type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export type ButtonProps = AsLink | AsButton;

export function buttonClasses({
  variant = "primary",
  size = "md",
  block,
  className,
}: Pick<Common, "variant" | "size" | "block" | "className">): string {
  return cn("btn", `btn-${variant}`, `btn-${size}`, block && "w-full", className);
}

function Label({ children, icon, iconPosition = "end" }: Pick<Common, "children" | "icon" | "iconPosition">) {
  const iconEl = icon ? <Icon name={icon} className="btn-icon size-[1.1em] shrink-0" /> : null;
  return (
    <span className="btn-inner" data-magnetic-inner>
      {iconPosition === "start" && iconEl}
      <span className="btn-roll">
        <span className="btn-roll-a">{children}</span>
        <span className="btn-roll-b" aria-hidden="true">
          {children}
        </span>
      </span>
      {iconPosition === "end" && iconEl}
    </span>
  );
}

/** Links to "/" or "/#section" would prefetch the (heavy) home route from every page: skip it. */
export function prefetchFor(href: string, explicit?: boolean | "auto" | null): boolean | "auto" | null | undefined {
  if (explicit !== undefined) return explicit;
  return href === "/" || href.startsWith("/#") || href.startsWith("#") ? false : undefined;
}

export function Button(props: ButtonProps) {
  const { variant, size, icon, iconPosition, magnetic, block, className, children, ...rest } = props;
  const classes = buttonClasses({ variant, size, block, className });
  const magneticProps = magnetic ? { "data-magnetic": "" } : {};
  if (typeof props.href === "string") {
    const { href, prefetch, ...linkRest } = rest as Omit<AsLink, keyof Common>;
    return (
      <Link href={href} prefetch={prefetchFor(href, prefetch)} className={classes} {...magneticProps} {...linkRest}>
        <Label icon={icon} iconPosition={iconPosition}>
          {children}
        </Label>
      </Link>
    );
  }
  const buttonRest = rest as Omit<AsButton, keyof Common>;
  return (
    <button type="button" className={classes} {...magneticProps} {...buttonRest}>
      <Label icon={icon} iconPosition={iconPosition}>
        {children}
      </Label>
    </button>
  );
}

/** Inline text link with an arrow that nudges forward and an underline sweep. */
export function ArrowLink({
  href,
  children,
  className,
  icon = "arrow",
  prefetch,
  ...rest
}: { href: string; children: ReactNode; className?: string; icon?: IconName } & Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href" | "className" | "children"
>) {
  return (
    <Link href={href} prefetch={prefetchFor(href, prefetch)} className={cn("arrow-link group", className)} {...rest}>
      <span className="link-sweep">{children}</span>
      <Icon name={icon} className="arrow-link-icon size-[1.05em]" />
    </Link>
  );
}
