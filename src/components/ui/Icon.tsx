/* ==========================================================================
   Icon set: 24px grid, 1.5px stroke, round caps. Decorative by default
   (aria-hidden); pass `label` when an icon stands alone.
   ========================================================================== */

const PATHS = {
  bag: "M6 8h12l-1 12H7L6 8Zm3 0V6.5a3 3 0 0 1 6 0V8",
  close: "M6 6l12 12M18 6 6 18",
  arrow: "M4 12h15m-6-6 6 6-6 6",
  "arrow-left": "M20 12H5m6-6-6 6 6 6",
  "arrow-up-right": "M7 17 17 7M8 7h9v9",
  "arrow-down": "M12 4v15m-6-6 6 6 6-6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  menu: "M4 8h16M4 16h16",
  check: "m5 12.5 4.5 4.5L19 7.5",
  "chevron-down": "m6 9 6 6 6-6",
  "chevron-right": "m9 6 6 6-6 6",
  "chevron-left": "m15 6-6 6 6 6",
  trash: "M5 7h14M10 7V5h4v2m-7 0 1 12h8l1-12",
  repeat: "M17 2.5 20.5 6 17 9.5M4 12V10a4 4 0 0 1 4-4h12.5M7 21.5 3.5 18 7 14.5M20 12v2a4 4 0 0 1-4 4H3.5",
  truck: "M3 6h11v10H3zM14 9h4l3 3v4h-7M6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  leaf: "M5 19c0-8 5-13 14-14 0 9-5 14-13 14H5Zm0 0 7-7",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2",
  pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  mail: "M3.5 6h17v12h-17zM4 6.5l8 6.5 8-6.5",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z",
  flame: "M12 21c4 0 6.5-2.6 6.5-6.2 0-4.3-3.5-6.3-4.3-10.3-2.4 1.6-3.6 3.9-3.4 6.3-1.2-.8-1.9-2-2-3.3C6.9 9.6 5.5 12 5.5 14.8 5.5 18.4 8 21 12 21Z",
  drop: "M12 21a6 6 0 0 0 6-6c0-4-6-11-6-11S6 11 6 15a6 6 0 0 0 6 6Z",
  scale: "M4 20h16M12 4v16M6 8h12M6 8l-3 6h6L6 8Zm12 0-3 6h6l-3-6Z",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5v-5m0-3v.5",
  alert: "M12 3 2.5 20h19L12 3Zm0 6v5m0 3v.5",
  sparkle: "M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M6 18l2.5-2.5m7-7L18 6",
  gift: "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4 4",
  filter: "M4 6h16M7 12h10M10 18h4",
  sort: "M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  coffee: "M5 9h11v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V9Zm11 1h1.5a2.5 2.5 0 0 1 0 5H16M8 3c0 1.5 1 1.5 1 3M12 3c0 1.5 1 1.5 1 3",
  machine: "M4 4.5h16v4H4zM5.5 8.5v11M18.5 8.5v11M3.5 19.5h17M9 8.5v2.5h6V8.5M10 13.5h4l-.5 3h-3l-.5-3Z",
  parking: "M5 3.5h14a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V5A1.5 1.5 0 0 1 5 3.5ZM9.5 17V7.5h3.25a2.75 2.75 0 0 1 0 5.5H9.5",
  bike: "M6 18.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm12 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM6 15l4-7h6l2 7M10 8 8.5 5.5H6.5M16 8l1-2.5h2",
  step: "M3.5 19.5h5v-4h4v-4h4v-4h4M17 4.5l3.5 3-3.5 3",
  dog: "M8 9.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm8 0A1.75 1.75 0 1 0 16 6a1.75 1.75 0 0 0 0 3.5ZM4.75 13.5a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Zm14.5 0a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2ZM12 12c-2.6 0-5 3.3-5 5.6 0 1.6 1.2 2.4 2.6 2.4.9 0 1.6-.5 2.4-.5s1.5.5 2.4.5c1.4 0 2.6-.8 2.6-2.4 0-2.3-2.4-5.6-5-5.6Z",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  className = "size-5",
  label,
  strokeWidth = 1.5,
}: {
  name: IconName;
  className?: string;
  label?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
