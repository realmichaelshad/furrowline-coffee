import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ==========================================================================
   Editorial type helpers
   - <Lines>: a heading split into masked lines that rise in with a stagger
     when scrolled into view (data-reveal="lines"), or on first paint when
     `hero` is set (pure CSS, never waits for JS).
   - <Eyebrow>: mono label, optionally numbered "(02)".
   - <SectionIntro>: eyebrow + heading + lead, the standard section opener.
   ========================================================================== */

export function Lines({
  lines,
  as: Tag = "h2",
  className,
  hero = false,
  delay,
  id,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  /** Animate on first paint (CSS) instead of on scroll. */
  hero?: boolean;
  /** Reveal delay in ms (scroll mode only). */
  delay?: number;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={className}
      data-reveal={hero ? undefined : "lines"}
      data-reveal-delay={delay}
    >
      {lines.map((line, i) => (
        <span key={i} className={cn("line-mask", hero && "hero-line")}>
          <span className="line-inner" style={{ "--line-index": i } as CSSProperties}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function Eyebrow({
  children,
  index,
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  index?: number | string;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={cn("eyebrow flex items-center gap-3", className)}>
      {index !== undefined && <span className="font-normal">({String(index).padStart(2, "0")})</span>}
      <span>{children}</span>
    </Tag>
  );
}

export function SectionIntro({
  eyebrow,
  index,
  title,
  lead,
  className,
  titleClassName,
  align = "left",
  id,
}: {
  eyebrow: ReactNode;
  index?: number;
  /** Pass an array to control line breaks (each item is one masked line). */
  title: ReactNode[];
  lead?: ReactNode;
  className?: string;
  titleClassName?: string;
  align?: "left" | "center";
  id?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", className)}>
      <Eyebrow index={index} className={cn("mb-6", align === "center" && "justify-center")}>
        {eyebrow}
      </Eyebrow>
      <Lines id={id} lines={title} className={cn("display text-display-m", titleClassName)} />
      {lead && (
        <p data-reveal="rise" data-reveal-delay={160} className={cn("mt-6 max-w-[46ch] text-lead text-bark", align === "center" && "mx-auto")}>
          {lead}
        </p>
      )}
    </div>
  );
}
