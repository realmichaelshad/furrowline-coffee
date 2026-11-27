import { PHOTOS, aspectRatio } from "@/content/photos";
import { CHAPTERS, type ChapterPhoto } from "@/content/story";
import { Photo } from "@/components/photo/Photo";
import { SectionIntro } from "@/components/ui/Typography";
import { FarmToCupScene } from "./FarmToCupScene";
import "./story.css";

/* ==========================================================================
   (02) From farm to cup: three chapters, told twice from one source.
   - The chapters are a plain ordered list (DOM order = reading order). Each
     carries its own photos inline above the text: that is the layout on
     phones, tablets, touch, reduced motion, before JS and in ?showcase=linear
     captures. Nothing is sticky and nothing is hidden there.
   - Desktop with a fine pointer and motion (FarmToCupScene sets data-sticky):
     the inline photos step aside and a sticky stage on the left holds every
     chapter's photos stacked. As each chapter's text crosses the middle of
     the screen, its photos wipe in (clip-path) and settle from a push-in,
     the chapter number rolls, and a furrow line on the rail fills.
     The stage is decorative (aria-hidden, nothing focusable); keyboard and
     screen-reader users simply read the list.
   ========================================================================== */

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * `sizes` for a photo cover-cropped into a frame `frameVw` wide with aspect `frameAspect` (w/h):
 * a photo wider than the frame renders wider than the frame, and a tighter crop (`scale`) wider still.
 */
function coverVw(p: ChapterPhoto, frameVw: number, frameAspect: number): number {
  const ratio = aspectRatio(PHOTOS[p.slot].aspect);
  return Math.ceil(frameVw * Math.max(1, ratio / frameAspect) * (p.scale ?? 1));
}

/* Stage frame ≈ 6 of 12 columns (46vw) at ~0.84 aspect; inset ≈ 34% of that at 3:4. */
const stageSizes = (p: ChapterPhoto) => `(min-width: 64rem) ${coverVw(p, 46, 0.84)}vw, 1px`;
const stageInsetSizes = (p: ChapterPhoto) => `(min-width: 64rem) ${coverVw(p, 16, 0.75)}vw, 1px`;
/* Inline: 4:5 main frame, 92vw on phones and ~47vw (6 columns) from md; inset 42% of it at 3:4. */
const inlineSizes = (p: ChapterPhoto) => `(min-width: 48rem) ${coverVw(p, 47, 0.8)}vw, ${coverVw(p, 92, 0.8)}vw`;
const inlineInsetSizes = (p: ChapterPhoto) => `(min-width: 48rem) ${coverVw(p, 20, 0.75)}vw, ${coverVw(p, 39, 0.75)}vw`;

/** A gently waving vertical furrow, one full wave per chapter (zero crossings at each chapter start). */
function furrowPath(waves: number): string {
  const steps = waves * 16;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = 10 + Math.sin(t * waves * Math.PI * 2) * 4.5;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${(t * 600).toFixed(1)}`;
  }
  return d;
}

function Stage() {
  const total = CHAPTERS.length;
  const wave = furrowPath(total);
  return (
    <div className="ftc-stage" aria-hidden="true">
      <div className="ftc-frame">
        {CHAPTERS.map((c) => (
          <div key={c.id} className="ftc-shot" data-shot>
            <div className="ftc-shot-media" data-shot-media>
              <Photo slot={c.main.slot} fill alt="" position={c.main.position} scale={c.main.scale} sizes={stageSizes(c.main)} />
            </div>
          </div>
        ))}
        <div className="ftc-chip">
          <span className="ftc-roll ftc-chip-num display">
            <span className="ftc-roll-track" data-roll>
              {CHAPTERS.map((c) => (
                <span key={c.id}>{pad(c.index)}</span>
              ))}
            </span>
          </span>
          <span className="ftc-chip-meta">
            <span className="eyebrow block text-parchment/80">Chapter · of {pad(total)}</span>
            <span className="ftc-roll ftc-chip-label display">
              <span className="ftc-roll-track" data-roll>
                {CHAPTERS.map((c) => (
                  <span key={c.id}>{c.label}</span>
                ))}
              </span>
            </span>
          </span>
        </div>
      </div>

      <div className="ftc-insets">
        {CHAPTERS.map((c) => (
          <div key={c.id} className="ftc-inset" data-inset>
            <div className="ftc-inset-media" data-inset-media>
              <Photo slot={c.inset.slot} fill alt="" position={c.inset.position} scale={c.inset.scale} sizes={stageInsetSizes(c.inset)} />
            </div>
          </div>
        ))}
      </div>

      <div className="ftc-rail">
        <svg className="ftc-rail-svg" viewBox="0 0 20 600" preserveAspectRatio="none" focusable="false">
          <path d={wave} className="ftc-rail-track" vectorEffect="non-scaling-stroke" />
        </svg>
        <svg className="ftc-rail-svg ftc-rail-fill" data-rail-fill viewBox="0 0 20 600" preserveAspectRatio="none" focusable="false">
          <path d={wave} vectorEffect="non-scaling-stroke" />
        </svg>
        {CHAPTERS.map((c, i) => (
          <span key={c.id} className="ftc-rail-dot" data-rail-dot style={{ top: `${(i / total) * 100}%` }}>
            <span className="ftc-rail-label">{pad(c.index)}</span>
          </span>
        ))}
        <span className="ftc-rail-end" />
      </div>
    </div>
  );
}

export function FarmToCup() {
  return (
    <section id="farm-to-cup" className="ftc-section pt-section pb-section-sm" aria-labelledby="ftc-title">
      <div className="shell">
        <div className="grid-editorial items-end gap-y-8">
          <SectionIntro
            className="col-span-4 md:col-span-7"
            index={2}
            eyebrow="From farm to cup"
            id="ftc-title"
            title={["Three stops", <em key="em">on one line.</em>]}
          />
          <p className="col-span-4 text-lead text-bark md:col-span-4 md:col-start-9" data-reveal="rise" data-reveal-delay="160">
            Every bag passes through the same three pairs of hands. This is what happens at each stop, and why it takes about
            three months.
          </p>
        </div>

        <FarmToCupScene className="ftc">
          <Stage />
          <ol className="ftc-chapters" data-chapters>
            {CHAPTERS.map((c) => (
              <li key={c.id} className="ftc-chapter" data-chapter>
                <div className="ftc-inline">
                  <div className="ftc-inline-main" data-reveal="clip">
                    <div data-parallax="0.05" className="ftc-inline-parallax">
                      <Photo
                        slot={c.main.slot}
                        aspect={4 / 5}
                        zoom
                        position={c.main.position}
                        scale={c.main.scale}
                        alt={c.main.alt}
                        sizes={inlineSizes(c.main)}
                      />
                    </div>
                  </div>
                  <div className="ftc-inline-inset" data-reveal="clip" data-reveal-delay="180">
                    <div>
                      <Photo
                        slot={c.inset.slot}
                        aspect={3 / 4}
                        zoom
                        position={c.inset.position}
                        scale={c.inset.scale}
                        alt={c.inset.alt}
                        sizes={inlineInsetSizes(c.inset)}
                      />
                    </div>
                  </div>
                </div>

                <article className="ftc-text" aria-labelledby={`ftc-${c.id}`}>
                  <p className="ftc-number" data-reveal="rise">
                    <span className="display ftc-number-digits">{pad(c.index)}</span>
                    <span className="eyebrow text-bark">{c.label}</span>
                  </p>
                  <h3 id={`ftc-${c.id}`} className="display ftc-title" data-reveal="rise" data-reveal-delay="60">
                    {c.title[0]} <em>{c.title[1]}</em>
                  </h3>
                  <p className="mt-6 max-w-[46ch] text-body text-bark" data-reveal="rise" data-reveal-delay="120">
                    {c.body}
                  </p>
                  <dl className="ftc-facts">
                    {c.facts.map((f, i) => (
                      <div key={f.label} data-reveal="rise" data-reveal-delay={180 + i * 70}>
                        <dt className="text-micro text-bark">{f.label}</dt>
                        <dd className="display ftc-facts-value">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </li>
            ))}
          </ol>
        </FarmToCupScene>
      </div>
    </section>
  );
}
