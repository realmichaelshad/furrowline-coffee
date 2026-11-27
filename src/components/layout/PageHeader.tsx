import type { ReactNode } from "react";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Standard top of an inner page: clears the fixed header, eyebrow, an
   oversized masked headline that rises on first paint (CSS only), a lead,
   and an optional aside (meta, buttons, art) on the right from md up.
   ========================================================================== */

export function PageHeader({
  eyebrow,
  index,
  title,
  lead,
  aside,
  className,
  titleClassName,
  children,
}: {
  eyebrow: ReactNode;
  index?: number;
  /** One item per line. */
  title: ReactNode[];
  lead?: ReactNode;
  aside?: ReactNode;
  className?: string;
  titleClassName?: string;
  children?: ReactNode;
}) {
  return (
    <header className={cn("shell pt-[calc(var(--header-h)+clamp(3rem,8vw,7rem))] pb-section-sm", className)}>
      <div className="grid-editorial items-end gap-y-10">
        <div className={cn("col-span-4", aside ? "md:col-span-8" : "md:col-span-11")}>
          <Eyebrow index={index} className="hero-fade mb-6 text-bark" >
            {eyebrow}
          </Eyebrow>
          <Lines as="h1" hero lines={title} className={cn("display text-display-l", titleClassName)} />
          {lead && (
            <p className="hero-fade mt-8 max-w-[44ch] text-lead text-bark" style={{ ["--delay" as string]: "420ms" }}>
              {lead}
            </p>
          )}
        </div>
        {aside && (
          <div className="hero-fade col-span-4 md:col-span-4" style={{ ["--delay" as string]: "560ms" }}>
            {aside}
          </div>
        )}
      </div>
      {children}
    </header>
  );
}
