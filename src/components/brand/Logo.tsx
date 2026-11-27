import { DESCRIPTOR, WORDMARK } from "./logo-data";
import { MARK_BOX, MARK_D } from "./mark-data";

/* ==========================================================================
   Logo system
   - <Mark>: the furrowed bean on its own (favicon, stamps, small spaces).
   - <Logo variant="horizontal">: mark + wordmark + "COFFEE ROASTERS" rule line.
   - <Logo variant="compact">: mark + wordmark (header, tight spaces).
   - <Logo variant="stacked">: centred lockup (packaging, signage).
   - <Logo variant="wordmark">: lettering only (footer, oversized type moments).
   All geometry is outlined paths: no font is needed to render the logo.
   Colours default to currentColor for text and clay for the mark.
   shared="define" | "use": the header defines the wordmark and mark paths
   once (ids fl-wordmark / fl-mark) and the mobile menu and footer <use>
   them, so the ~8 KB of path data isn't repeated on every page. Anything
   else (brand pages, exports) renders the full paths (the default).
   ========================================================================== */

type LogoVariant = "horizontal" | "compact" | "stacked" | "wordmark";

interface ColorProps {
  /** Colour of the bean mark. */
  markColor?: string;
  /** Colour of the lettering. */
  textColor?: string;
}

interface LogoProps extends ColorProps {
  variant?: LogoVariant;
  /** Share path data across logos on the page (see above). Header: "define"; menu/footer: "use". */
  shared?: Shared;
  className?: string;
  /** Accessible name. Pass `decorative` when a visible label already names the brand. */
  title?: string;
  decorative?: boolean;
}

/* Lockup geometry, in wordmark font units (cap height 1400, ascender 1520). */
const ASC = WORDMARK.ascender;
const DESC_CAP = 260;
const DESC_SCALE = DESC_CAP / DESCRIPTOR.capHeight;
const DESC_W = DESCRIPTOR.width * DESC_SCALE;
const DESC_BASELINE = 690;
const RULE_Y = DESC_BASELINE - DESC_CAP / 2;
const RULE_W = 34;

function markTransform(x: number, y: number, height: number): string {
  const s = height / MARK_BOX.height;
  return `translate(${x} ${y}) scale(${s}) translate(${-MARK_BOX.x} ${-MARK_BOX.y})`;
}

function markWidth(height: number): number {
  return (MARK_BOX.width * height) / MARK_BOX.height;
}

type Shared = "define" | "use" | undefined;

function Wordmark({ x = 0, y = 0, scale = 1, fill, shared }: { x?: number; y?: number; scale?: number; fill: string; shared?: Shared }) {
  const transform = `translate(${x} ${y}) scale(${scale})`;
  if (!shared) return <path d={WORDMARK.d} fill={fill} transform={transform} />;
  return (
    <>
      {shared === "define" && (
        <defs>
          <path id="fl-wordmark" d={WORDMARK.d} />
        </defs>
      )}
      <use href="#fl-wordmark" fill={fill} transform={transform} />
    </>
  );
}

function MarkPath({ fill, transform, shared }: { fill: string; transform: string; shared?: Shared }) {
  if (!shared) return <path d={MARK_D} fill={fill} transform={transform} />;
  return (
    <>
      {shared === "define" && (
        <defs>
          <path id="fl-mark" d={MARK_D} />
        </defs>
      )}
      <use href="#fl-mark" fill={fill} transform={transform} />
    </>
  );
}

function Descriptor({ x, y, fill }: { x: number; y: number; fill: string }) {
  return <path d={DESCRIPTOR.d} fill={fill} transform={`translate(${x} ${y}) scale(${DESC_SCALE})`} />;
}

interface Layout {
  viewBox: string;
  aspect: number;
  body: (c: Required<ColorProps> & { shared?: Shared }) => React.ReactNode;
}

function horizontal(): Layout {
  const markH = ASC + DESC_BASELINE;
  const mw = markWidth(markH);
  const tx = mw + 520;
  const width = tx + WORDMARK.width;
  const height = markH + 20;
  return {
    viewBox: `0 ${-ASC} ${width} ${height}`,
    aspect: width / height,
    body: ({ markColor, textColor }) => (
      <>
        <path d={MARK_D} fill={markColor} transform={markTransform(0, -ASC, markH)} />
        <Wordmark x={tx} fill={textColor} />
        <Descriptor x={tx + 8} y={DESC_BASELINE} fill={textColor} />
        <rect x={tx + DESC_W + 240} y={RULE_Y - RULE_W / 2} width={WORDMARK.width - DESC_W - 240} height={RULE_W} fill={textColor} />
      </>
    ),
  };
}

function compact(): Layout {
  const markH = ASC + 120;
  const mw = markWidth(markH);
  const tx = mw + 360;
  const width = tx + WORDMARK.width;
  return {
    viewBox: `0 ${-ASC - 60} ${width} ${markH}`,
    aspect: width / markH,
    body: ({ markColor, textColor, shared }) => (
      <>
        <MarkPath fill={markColor} transform={markTransform(0, -ASC - 60, markH)} shared={shared} />
        <Wordmark x={tx} fill={textColor} shared={shared} />
      </>
    ),
  };
}

function stacked(): Layout {
  const markH = 2600;
  const mw = markWidth(markH);
  const width = WORDMARK.width;
  const markTop = 0;
  const baseline = markH + 700 + ASC;
  const descBaseline = baseline + DESC_BASELINE;
  const ruleW = (width - DESC_W - 2 * 300) / 2;
  const height = descBaseline + 40;
  return {
    viewBox: `0 0 ${width} ${height}`,
    aspect: width / height,
    body: ({ markColor, textColor }) => (
      <>
        <path d={MARK_D} fill={markColor} transform={markTransform((width - mw) / 2, markTop, markH)} />
        <Wordmark y={baseline} fill={textColor} />
        <rect x={0} y={descBaseline - DESC_CAP / 2 - RULE_W / 2} width={ruleW} height={RULE_W} fill={textColor} />
        <Descriptor x={ruleW + 300} y={descBaseline} fill={textColor} />
        <rect x={width - ruleW} y={descBaseline - DESC_CAP / 2 - RULE_W / 2} width={ruleW} height={RULE_W} fill={textColor} />
      </>
    ),
  };
}

function wordmarkOnly(): Layout {
  const height = ASC + 40;
  return {
    viewBox: `0 ${-ASC} ${WORDMARK.width} ${height}`,
    aspect: WORDMARK.width / height,
    body: ({ textColor, shared }) => <Wordmark fill={textColor} shared={shared} />,
  };
}

const LAYOUTS: Record<LogoVariant, Layout> = {
  horizontal: horizontal(),
  compact: compact(),
  stacked: stacked(),
  wordmark: wordmarkOnly(),
};

/** Width / height of each lockup, for sizing containers without layout shift. */
export const LOGO_ASPECT: Record<LogoVariant, number> = {
  horizontal: LAYOUTS.horizontal.aspect,
  compact: LAYOUTS.compact.aspect,
  stacked: LAYOUTS.stacked.aspect,
  wordmark: LAYOUTS.wordmark.aspect,
};

export function Logo({
  variant = "horizontal",
  className,
  title = "Furrowline Coffee Roasters",
  decorative = false,
  markColor = "var(--color-clay)",
  textColor = "currentColor",
  shared,
}: LogoProps) {
  const layout = LAYOUTS[variant];
  return (
    <svg
      viewBox={layout.viewBox}
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
      style={{ aspectRatio: String(layout.aspect) }}
    >
      {layout.body({ markColor, textColor, shared })}
    </svg>
  );
}

export { Mark } from "./Mark";
