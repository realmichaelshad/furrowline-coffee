import { STEPS } from "@/content/wholesale";
import { Photo } from "@/components/photo/Photo";
import { SectionIntro } from "@/components/ui/Typography";
import { StepsScene } from "./StepsScene";
import "./wholesale.css";

/* ==========================================================================
   (02) How it works: Taste, Trial, Train, Deliver down a furrow line that
   fills as you scroll (StepsScene, transform only); each step's marker
   fills as the line reaches it. Static (reduced motion, no JS): the line
   is drawn and every marker is filled. The trade cupping photo sits beside
   the intro on a slow parallax.
   ========================================================================== */

export function Steps() {
  return (
    <section className="ws-how" aria-labelledby="how-title">
      <div className="shell py-section">
        <div className="grid-editorial gap-y-14">
          <div className="col-span-4 md:col-span-5">
            <div className="ws-how-intro">
              <SectionIntro
                index={2}
                eyebrow="How it works"
                id="how-title"
                title={["From first sip", <em key="em">to standing order.</em>]}
                titleClassName="text-h1"
                lead="Most cafés go from the first cupping to their first weekly delivery in about a month."
              />
              <figure className="ws-how-photo">
                <div className="ws-how-frame" data-reveal="clip">
                  <div data-parallax="0.05" className="scale-[1.1]">
                    <Photo
                      slot="cupping"
                      aspect="3:2"
                      zoom
                      position="74% 80%"
                      scale={1.5}
                      alt="Cupping bowls beside an open notebook and pencil, ready for scores."
                      sizes="(min-width: 90rem) 816px, (min-width: 48rem) 60vw, 138vw"
                    />
                  </div>
                </div>
                <figcaption className="ws-how-caption">
                  <span className="eyebrow block text-mist">Trade cupping</span>
                  <span className="display mt-0.5 block text-[1rem] text-parchment">Mondays at 10, at the roastery</span>
                </figcaption>
              </figure>
            </div>
          </div>

          <StepsScene className="ws-steps col-span-4 md:col-span-6 md:col-start-7">
            <div className="ws-steps-line" aria-hidden="true">
              <span className="ws-steps-track" />
              <span className="ws-steps-fill" data-steps-fill />
            </div>
            <ol className="ws-steps-list">
              {STEPS.map((step, i) => (
                <li key={step.title} className="ws-step" data-step>
                  <span className="ws-step-marker" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="eyebrow text-bark" data-reveal="rise">
                    {step.meta}
                  </p>
                  <h3 className="display ws-step-title" data-reveal="rise" data-reveal-delay="60">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-[44ch] text-body text-bark" data-reveal="rise" data-reveal-delay="120">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </StepsScene>
        </div>
      </div>
    </section>
  );
}
