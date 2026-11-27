import { MARK_D, MARK_VIEWBOX } from "./mark-data";

/* The furrowed bean on its own. Its own module so client components can use
   it without pulling the wordmark outlines into the client bundle. */
export function Mark({
  className,
  color = "var(--color-clay)",
  title,
}: {
  className?: string;
  color?: string;
  /** Accessible name; omit for a decorative mark. */
  title?: string;
}) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path d={MARK_D} fill={color} />
    </svg>
  );
}
