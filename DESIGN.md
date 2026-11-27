# Furrowline design system

Furrowline Coffee Roasters is a fictional small-batch roaster (a concept project). This document is the design
system the site and the identity are built from. Every value here exists as a token or component in the code; the
source of truth is `src/app/globals.css` (tokens) and `src/components/**` (components).

## 1. Concept: follow the line

The identity starts from the land coffee grows on. A plow draws a furrow, a terrace follows the contour of a
hill, a farmer rakes parchment coffee into rows on a patio. Those lines become everything else:

- **The mark** is a coffee bean plowed with four S-shaped furrows (`src/components/brand/mark-data.ts`).
- **Patterns** are topographic contour rings and furrow rows (`src/lib/geometry.ts`), used as quiet backdrops.
- **The website** is built around one idea in motion: a line drawn from the farm to the cup (the hero headline,
  the scroll-drawn origin route, the underline sweeps, the progress lines).
- **Packaging** gives each coffee an arched "window" onto its landscape, the same arch that frames the origin
  photographs on the site.

Look and feel: warm, earthy, editorial. Oversized serif type, generous whitespace, photography with a film
look, crisp corners with a few soft arches. Modern studio polish in the motion, never in the ornament.

## 2. Logo

| Asset | File | Use |
|---|---|---|
| Horizontal lockup | `brand/logo.svg` | Default. Mark + wordmark + "COFFEE ROASTERS" rule line. |
| Reversed | `brand/logo-reversed.svg` | On espresso and photography. Parchment text, peach mark. |
| Stacked | `brand/logo-stacked.svg` | Packaging, signage, square formats. |
| Wordmark | `brand/wordmark.svg` | Oversized type moments (the footer). |
| Mark | `brand/icon.svg` | Favicon, stamps, small spaces, social avatar. |

- The wordmark is Fraunces (instanced at weight 610, optical size 144, SOFT 80) converted to outlines, so the logo
  never depends on a font. The descriptor is DM Mono 500, tracked +260.
- Clear space: the height of the mark's widest furrow gap times 4, roughly the cap height of the wordmark, on every
  side. Minimum size: mark 16 px; horizontal lockup 120 px wide; below that use the compact lockup (no descriptor).
- Don't: recolor the mark outside the palette, stretch it, add effects, or set the wordmark in live text.
- In code: `<Logo variant="horizontal|compact|stacked|wordmark" />` and `<Mark />` (`src/components/brand`).
  `npm run brand` re-exports every file in `brand/` plus the favicon set from the same components.
- Brand sheets (noindex, linked from the footer): `/brand-guide` is the whole identity composed on one 1280 × 769
  sheet (`[data-sheet="brand-guide"]`, 1:1 at viewports of 1312 px and wider, scaled with CSS below that) followed
  by notes per part; `/brand-board` shows the identity in use on a takeaway cup, two pouches, business cards and
  the roastery fascia. The cup, pouches and cards are SVG/CSS; the fascia letters the outlined lockup onto the
  storefront photograph, projected onto the sign's four measured corners with a `matrix3d` homography
  (`src/components/brand-board/homography.ts`, unit-tested).

## 3. Color

Brand-only palette (Tailwind's default colors are removed in `@theme static`). Utilities: `bg-parchment`,
`text-espresso`, `border-clay`, etc.

| Token | Hex | Role |
|---|---|---|
| `espresso` | `#241913` | Ink. Body text, dark surfaces, footer, primary dark buttons. |
| `loam` | `#3a2a20` | Deep surface. |
| `bark` | `#5c4a3c` | Secondary text on light surfaces. |
| `dune` | `#9b8670` | Decorative only (rules, icons). Never text. |
| `oat` | `#e9ddc8` | Alternate section background. |
| `parchment` | `#f4ecdf` | Page background. |
| `linen` | `#fbf7f0` | Raised surfaces: cards, drawer, inputs. |
| `clay` | `#a4472a` | Primary accent: calls to action, the mark, active states. |
| `clay-deep` | `#8e3a20` | Hover/pressed clay; clay text on oat. |
| `peach` | `#efa47a` | Accent on dark surfaces and photography. |
| `moss` | `#4b5a32` | Secondary accent, success, subscriptions. |
| `ochre` | `#c88a2e` | Highlights, "Limited" badges. |
| `sage` | `#a9b38c` | Decorative on dark. |
| `mist` | `#c9b9a3` | Secondary text on dark. |
| `error` | `#9a2b1f` | Form errors. |

Signature coffee colors (bags, showcase panels, cards): First Light `#f0b48f` (stage `#efc3a4`), Honey Ridge
`#b4412f` (stage `#9e3a2a`), Highland Almanac `#db8a35` (stage `#d9963f`), Deep Field `#3b1c22` (stage `#2b1418`).
Each coffee's `palette` in `src/content/products.ts` also carries its ink and illustration tones.

### Contrast-checked pairs (WCAG 2.1)

| Pair | Ratio | Use |
|---|---|---|
| espresso on parchment | 14.6:1 | Body text |
| bark on parchment / oat / linen | 7.2 / 6.3 / 7.9:1 | Secondary text |
| clay on parchment | 5.1:1 | Links, small accents (AA) |
| linen on clay | 5.6:1 | Primary button label |
| parchment on espresso | 14.6:1 | Text on dark |
| mist on espresso | 9.0:1 | Secondary text on dark |
| peach on espresso | 8.4:1 | Accent text on dark |
| moss on parchment | 6.4:1 | Success, subscription labels |
| error on linen | 7.2:1 | Form errors |
| espresso on ochre | 5.8:1 | Limited badge |
| espresso on First Light stage | 10.6:1 | Showcase panel text |
| cream `#fbf1e4` on Honey Ridge stage | 6.1:1 | Showcase panel text |
| espresso on Highland Almanac stage | 6.9:1 | Showcase panel text |
| parchment on Deep Field stage | 14.7:1 | Showcase panel text |
| dune on parchment | 3.0:1 | Decorative only: never text |

Rule: text never sits at reduced opacity on a colored stage. Use the stage's `ink` color at full strength.

## 4. Typography

Three Google Fonts families (OFL), self-hosted as Latin subsets in `src/fonts`, loaded with `next/font/local`
(`src/lib/fonts.ts`, `font-display: swap`, size-adjusted fallbacks):

- **Fraunces**: display serif. Headlines, product names, quotes, prices in big moments. Optical size fixed at 120
  (it is only used large), SOFT 50, weights 300-600; italic (WONK on) for emphasis: `<em>` in headlines.
- **Instrument Sans**: text and UI. Body, buttons, forms, navigation. Weights 400-700.
- **DM Mono 500**: labels. Eyebrows, numbering "(01)", meta lines, prices in tables, coordinates. Uppercase with
  +0.14em tracking (`eyebrow` utility).

Scale (fluid `clamp()` tokens, utilities `text-display-xl`, `text-h2`, ...):

| Token | Size | Line height | Use |
|---|---|---|---|
| `display-xl` | 56 to 184 px | 0.86 | One per page at most |
| `display-l` | 48 to 124 px | 0.90 | Page titles (`PageHeader`) |
| `display-m` | 40 to 84 px | 0.95 | Section titles (`SectionIntro`) |
| `h1` | 36 to 64 px | 1.0 | Sub-section titles |
| `h2` | 30 to 44 px | 1.05 | Card groups, quotes |
| `h3` | 22 to 28 px | 1.15 | Card titles, dialog titles |
| `lead` | 18 to 21 px | 1.55 | Intro paragraphs |
| `body` | 17 px | 1.65 | Running text |
| `small` | 15 px | 1.5 | UI, captions |
| `micro` | 13 px | 1.4 | Meta, hints |
| `eyebrow` | 12 px mono | 1.3 | Labels |

Headlines are set in lines: `<Lines lines={["Four coffees,", "four landscapes."]} />` so each line can rise from
its own mask. Use `<em>` for the italic emphasis word. `text-wrap: balance` on headings, `pretty` on paragraphs.

## 5. Space, grid and shape

- Base unit 4 px (Tailwind spacing). Fluid tokens: `gutter` (16 to 56 px page margins), `grid` (16 to 24 px column
  gap), `section` (88 to 168 px between sections), `section-sm` (64 to 104 px), `header` (72 px).
- `shell`: max 1440 px container with the gutter. `grid-editorial`: 4 columns on phones, 12 from 768 px.
  Layouts are asymmetric on purpose: copy on 5 columns against media on 7, offsets with `col-start-*`.
- Radius: `xs` 2, `sm` 6 (inputs, choices), `md` 12 (cards, photos), `lg` 20 (panels, the hero frame), `xl` 32,
  `pill` (buttons, badges). Arches (`50% 50% r r / 39% 39% r r`) frame origin photography.
- Shadows are warm and low: `shadow-soft` (cards), `shadow-lift` (popovers, the skip link), `shadow-drawer`.

## 6. Photography

Fifteen named slots (`src/content/photos.ts`), each with an image in `public/photos`: warm natural light, film
grain, earthy palette, no visible text or logos.

- Always render through `<Photo slot="..." sizes="..." />` (`src/components/photo/Photo.tsx`). It keeps the slot's
  aspect ratio (no layout shift), crops to the slot's `focus` point, uses `next/image`, and falls back to an
  illustrated SVG if a file is ever missing.
- Crops: landscape slots work at 3:2, 4:5 (insets) and in arches; portraits at 2:3 and 4:5; squares at 1:1 and in
  pills. Keep subjects on the `focus` point; override `position` only when a layout needs it.
- Treatments (static CSS): `tint` (multiply wash in a coffee color), `duotone` (desaturated + tint, for quiet
  backgrounds), `shade="bottom|left|full"` (scrim so overlaid text passes AA). A global film-grain tile sits over
  everything at low opacity, which binds photos and flat color together.
- Placement: photos sit in rounded frames, arches or pills, open with a clip reveal and drift on a parallax layer.
  Never a bare rectangle dropped into a column.
- `priority` only on the hero photo. Every other image is lazy with a correct `sizes`.

## 7. Illustration and packaging

- **Packaging** (`src/components/packaging`): a stand-up pouch with a crimped seal, valve, cylinder shading and a
  label with an arched landscape window. Each coffee has its own color and motif tied to origin and notes:
  First Light (sunrise over Guji terraces, jasmine), Honey Ridge (honey-lit Andean ridges in contour rows, a
  honey drop), Highland Almanac (citrus sun over a limestone plateau and a raked patio), Deep Field (a plowed
  night field, crescent moon, black cherries). Gear and merch share the same 320 × 460 canvas and are modeled
  to the same level (`src/components/packaging/gear`): glazed speckled stoneware with spiral ribs over a glass
  server, a matte black kettle with a tapered gooseneck, walnut handle and brass collars, a steel grinder with a
  knurled grip and walnut catch cup, an enamel mug with a rolled rim and tubular handle, and a woven canvas tote
  with sewn webbing straps and a screen print. Each product has its own stage color (`palette` in
  `src/content/products.ts`), so a grid of gear keeps the same color rhythm as the coffee row.
- **Pre-rendered art**: `npm run brand` renders every product to `public/packaging/<slug>[--variant].webp`.
  Use `<ProductImage>` anywhere products repeat (cards, rows, drawer, quiz). Use the inline SVG (`<Bag>`,
  `<ProductArt>`) only where a vector matters (brand guide, brand board, very large one-off visuals).
- **Contours and furrows**: `src/lib/geometry.ts` + `src/components/illustration/primitives.tsx`. Large backdrops
  are pre-generated textures (specified in `src/content/textures.ts`, written to `public/textures/*.svg`) drawn
  with `<Texture id>` as a CSS mask in any color; they load only near the viewport.
- Style rules: flat fills from the palette, 1-1.5 px strokes, no gradients except soft shading on objects, no
  outlines around photos, seeded geometry (deterministic, identical on server and client).

## 8. Components

All shared UI lives in `src/components/ui`, `src/components/product`, `src/components/layout`:

- **Buttons** (`Button`, `ArrowLink`, plus the round `.icon-btn` class for icon-only controls): variants `primary` (clay), `dark`, `outline`,
  `outline-light` (on photos/dark), `light`, `ghost`; sizes `sm/md/lg`. Every filled button has the fill sweep
  (a curved fill rises from below) and the label roll; `magnetic` for primary calls to action.
- **Links**: `link-sweep` underline draws in from the left; `arrow-link` nudges its arrow.
- **Form fields** (`TextField`, `TextAreaField`, `SelectField`, `CheckboxField`): label, hint, inline error with
  icon, `aria-invalid` + `aria-describedby`; validation with zod/mini via `src/lib/forms.ts`.
- **Choice groups** (`ChoiceGroup`): native radios styled as pills, grid or stack (sizes, grinds, purchase type).
- **Product card** (`ProductCard`): art on its color stage, badge, hover lift + tilt, Quick add, View cursor.
- **Badges** (`Badge`, `ProductBadge`), **meters** (`RoastMeter`, `TasteMeter`), **quantity stepper**.
- **Drawer/dialog** (`Drawer`): native `<dialog>` with focus trap, Esc, focus return; right, left or full-screen.
- **Empty state** (`EmptyState`): line art, a short heading and the next step (cart drawer, shop with no matches).
  Every action gives feedback where it happens (the cart count bumps, the drawer opens, forms answer inline), so
  there is no separate toast layer.
- **Layout**: `Header` (hides on scroll down, frosted once scrolled), `MobileMenu` (full-screen, staggered links),
  `Footer` (oversized wordmark), `PageHeader`, `SectionIntro`, `Eyebrow`, `Lines`.
- **Icons** (`Icon`): one set on a 24 px grid with a 1.5 px stroke, including the Visit and Wholesale glyphs
  (`parking`, `bike`, `step`, `dog`, `machine`). Add new glyphs there rather than drawing local ones.
- **Forms with an error summary** pass `announce={false}` to their fields so a screen reader hears the errors once,
  from the summary; single-field forms keep the default inline `role="alert"`.

**Page CSS.** Page-specific styles live in plain `.css` files next to their components (`src/components/<page>/`)
and use the tokens (`var(--color-*)`, `var(--ease-*)`) and `@media (width >= 48rem | 64rem)`. These files are
unlayered, while Tailwind utilities sit in `@layer utilities`, so a page class always beats a utility on the same
element: once `.shop-filter-btn` sets `display`, `lg:hidden` on that element does nothing. Put responsive
`display` toggles for a page class in its CSS file.

## 9. Motion

Motion is a feature of this brand, so it is rich, but it has strict rules.

**System**
- Smooth scroll: Lenis, synced to GSAP ScrollTrigger (`src/lib/motion`). Lenis, GSAP and ScrollTrigger are loaded
  only after the visitor's first interaction (scroll, pointer, key) and an idle moment, so they never touch page
  load or LCP.
- Scroll scenes: `useScene()` / `<Scene>` wrap a GSAP timeline in `gsap.context` (auto revert on unmount, and on a
  live switch to reduced motion). Server components keep the markup; a tiny client wrapper owns the timeline.
- Attribute-driven interactions (`InteractionLayer`, no per-component JS): `data-reveal="rise|fade|clip|clip-x|
  scale|lines"` (+ `data-reveal-delay`), `data-parallax="0.08"`, `data-magnetic`, `data-cursor="View"`.
  Clip reveals clip the element's children, never the observed element itself (Chromium's IntersectionObserver
  applies a target's own clip-path, so a fully clipped target would never fire): put `data-reveal="clip"` on an
  `overflow-hidden` wrapper around the media.
- Page transitions: React `<ViewTransition>` in `src/app/template.tsx` (old page lifts away, new one rises; the
  header is pinned). Browsers without the API get a CSS rise after the first navigation.
- In-page jumps (`src/lib/motion/anchors.ts`): same-page `#hash` links glide to their target, and pages opened on
  a hash (`/#find-your-coffee`) land on it. The jump is held while the layout settles (the pinned showcase adds its
  scroll length when its scene starts, deferred sections render at full size) until the visitor scrolls, taps or
  types, and focus then moves to the target so the next Tab continues from there.

**Signature moments (Home)**: hero mask reveal + line rise + scroll push-in; manifesto words brighten as you read;
pinned horizontal showcase of the four coffees (bags turn and drift, colors sweep, photos parallax; a snap
carousel on touch); a velocity-reactive marquee of tasting notes; the origin route drawing itself with counters
counting up; clip reveals and parallax on the story collage; fly-to-cart with a count bump.

**Timing**: `ease-out-expo` (0.16, 1, 0.3, 1) for entrances, `ease-in-out-quart` for wipes, `ease-spring` for small
pops. Durations: 180 ms (state), 320 ms (UI), 700 ms (panels), 1100 ms (reveals). Stagger 70-95 ms per line/item.

**Guardrails (non-negotiable)**
- Animate only `transform`, `opacity` and `clip-path` (the route line's `stroke-dashoffset` is the one sanctioned
  exception).
- `prefers-reduced-motion: reduce`: no smooth scroll, no pinning, no scenes, no parallax, no marquee drift; every
  element is visible in its final state. Switching it on mid-visit reverts live scenes.
- Nothing waits for JS to become visible: entrances are CSS from first paint, or start from a visible state; scroll
  reveals only hide elements that start below the fold, after hydration.
- Pinned sections never trap keyboard or screen-reader users: focus entering a panel scrolls to it; nav buttons
  jump between panels; the content is a normal list of articles in the DOM.
- Fine-pointer-only effects (magnetic, View cursor, the button fill sweep and label roll on hover, the card lift)
  never run on touch, so nothing is left half-swept under a finger; keyboard focus shows the same states through
  `:focus-visible`.
- `?showcase=linear` turns scenes and reveals off and stacks pinned sections, for full-page captures.

## 10. Performance rules

Lighthouse 90+ on mobile and desktop for every category is a requirement. What keeps it there:
- Static generation for every route. No client data fetching.
- One `priority` image per page (the hero). Correct `sizes` on every image: a photo cropped by `object-fit: cover`
  into a frame narrower than its own aspect renders wider than the frame, so size it for the rendered width (the
  showcase arches use `78vw` for a frame that is ~38vw wide). Photos are served as AVIF with a WebP fallback.
- Every byte requested before the hero paints counts against mobile LCP (fonts, JS, the hero, and lazy images
  within ~2500px of the top). Keep client JS small, load heavy client-only modules with `import()` on first use
  (the newsletter loads zod on focus), and keep images near the top of a page small.
- No big inline SVG on pages: repeated product art via `<ProductImage>`, large patterns via `<Texture>`. Inline SVG
  only for small icons, the logo, maps and one-off illustrations.
- Below the last scroll scene, wrap sections in `className="defer-render"` (`content-visibility: auto`). Never on or
  above a section with a GSAP scene.
- Keep client components small and leaf-level; pass server-rendered children/props into them. Never import
  `@/components/brand/Logo`, `packaging/*` or `illustration/primitives` from a client component.
- Links to `/` or `/#section` don't prefetch (handled by `Button`/`ArrowLink` via `prefetchFor`).

## 11. Voice and tone

Plain-spoken, specific, warm. We talk like the people at the roaster: about farms, weather, roast days and what's
in the cup. Short sentences. Real numbers. No hype words ("artisanal", "elevate", "curated"), no exclamation marks.

- Headline: "Follow the line from farm to cup."
- Product: "Jasmine, bergamot and white peach from the Guji highlands."
- Process: "Every batch is still roasted on it by hand, by ear and by smell, twice a week."
- Empty cart: "Nothing in the hopper yet. Start with a signature coffee, or let three quick questions pick one for
  you."
- Error: "That doesn't look like an email address. Check for a missing @ or dot."
- Checkout (concept): "Checkout is resting today. Furrowline is a concept store, so no payment is taken and nothing
  ships."
- Success: "You're on the list. The first letter goes out on the next roast day."

Sample people are invented (first name + last initial, generic role). Contact details are fake
(`hello@example.com`, `(555) 010-0000`, 418 Mill Race Road) and appear only on Visit and Wholesale, always on an
element with `data-contact`.
