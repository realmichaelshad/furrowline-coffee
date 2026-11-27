import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Texture } from "@/components/illustration/Texture";

/* Designed empty state (cart drawer, shop with no matches). */

/** Illustrated empty state: contour hill with a small object on top. */
export function EmptyState({
  title,
  children,
  actions,
  className,
  art,
  headingLevel: H = "h3",
}: {
  title: string;
  /** Heading level for the title; match the surrounding outline (default h3). */
  headingLevel?: "h2" | "h3" | "h4";
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
  /** Optional custom art; defaults to an empty contour hill. */
  art?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-10 text-center", className)}>
      <div className="mb-6 w-44 text-dune" aria-hidden="true">
        {art ?? (
          <span className="relative block aspect-[5/3]">
            <Texture id="square-a" fit="cover" position="50% 70%" />
          </span>
        )}
      </div>
      <H className="display text-h3">{title}</H>
      {children && <div className="mt-2 max-w-[34ch] text-small text-bark">{children}</div>}
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
