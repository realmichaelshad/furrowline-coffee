import { WONT_DO } from "@/content/story";
import { Texture } from "@/components/illustration/Texture";
import { Eyebrow, Lines } from "@/components/ui/Typography";
import "./story.css";

/* ==========================================================================
   (04) What we won't do. Espresso ground, the intro holds its place while
   four refusals scroll past in large type, each with the reason under it
   and a furrow rule that draws in as it arrives.
   ========================================================================== */

export function Values() {
  return (
    <section className="story-values on-dark" aria-labelledby="values-title">
      <Texture id="wide-a" className="text-parchment/[0.05]" position="80% 30%" />
      <div className="shell relative py-section">
        <div className="grid-editorial gap-y-12">
          <div className="col-span-4 md:col-span-4">
            <div className="story-values-intro">
              <Eyebrow index={4} className="mb-6 text-mist">
                What we won&apos;t do
              </Eyebrow>
              <Lines id="values-title" className="display text-display-m" lines={["Four things", <em key="em">we won&apos;t do.</em>]} />
              <p className="mt-6 max-w-[34ch] text-body text-mist" data-reveal="rise" data-reveal-delay="160">
                Most of what makes a coffee good happens before it reaches us. These are the shortcuts we ruled out on day
                one.
              </p>
            </div>
          </div>

          <ol className="col-span-4 md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-6">
            {WONT_DO.map((item, i) => (
              <li key={item.line} className="story-value">
                <div className="story-value-rule" data-reveal="clip-x" aria-hidden="true">
                  <span />
                </div>
                <span className="story-value-index font-mono" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="display story-value-line" data-reveal="rise">
                    {item.line}
                  </p>
                  <p className="mt-4 max-w-[46ch] text-body text-mist" data-reveal="rise" data-reveal-delay="100">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
