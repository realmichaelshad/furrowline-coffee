import { VOICES, WHOLESALE_STATS } from "@/content/wholesale";
import { Texture } from "@/components/illustration/Texture";
import { Eyebrow } from "@/components/ui/Typography";
import "./wholesale.css";

/* ==========================================================================
   (04) From the bar: two sample quotes in display italic on espresso, with
   initials in place of photos, and three numbers along the foot.
   The people are invented for this concept.
   ========================================================================== */

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

export function Voices() {
  return (
    <section className="ws-voices on-dark" aria-labelledby="voices-title">
      <Texture id="wide-b" className="text-parchment/[0.05]" position="20% 40%" />
      <div className="shell relative py-section">
        <Eyebrow index={4} className="mb-6 text-mist">
          From the bar
        </Eyebrow>
        <h2 id="voices-title" className="sr-only">
          What cafés say about pouring Furrowline
        </h2>
        <div className="grid-editorial gap-y-14">
          {VOICES.map((voice, i) => (
            <figure
              key={voice.name}
              className={i === 0 ? "ws-voice col-span-4 md:col-span-6" : "ws-voice col-span-4 md:col-span-5 md:col-start-8"}
              data-reveal="rise"
              data-reveal-delay={i * 120}
            >
              <span className="ws-voice-mark" aria-hidden="true">
                “
              </span>
              <blockquote>
                <p className="display ws-voice-quote">{voice.quote}</p>
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <span className="ws-voice-initials" aria-hidden="true">
                  {initials(voice.name)}
                </span>
                <span className="leading-tight">
                  <span className="block text-small font-semibold text-parchment">{voice.name}</span>
                  <span className="block text-micro text-mist">{voice.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <dl className="ws-stats">
          {WHOLESALE_STATS.map((stat, i) => (
            <div key={stat.label} data-reveal="rise" data-reveal-delay={i * 80}>
              <dt className="text-small text-mist">{stat.label}</dt>
              <dd className="display ws-stat-value">
                {stat.value}
                {stat.unit && <span className="ws-stat-unit"> {stat.unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
