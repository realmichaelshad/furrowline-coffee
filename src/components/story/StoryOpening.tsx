import { SITE, STATS } from "@/content/site";
import { ROASTERY_CAPTION, STAMP_TEXT, STORY_LEAD } from "@/content/story";
import { Photo } from "@/components/photo/Photo";
import { Stamp } from "@/components/brand/Stamp";
import { PageHeader } from "@/components/layout/PageHeader";
import "./story.css";

/* ==========================================================================
   Our Story opening. The page title with Nadia's own lead beside it, then
   the roastery in a wide rounded frame: on wide screens the frame's mask
   opens from a smaller rounded rect on first paint (CSS, visible from frame
   one) while the photo settles; below the fold (phones) it opens with a
   clip reveal instead. The photo drifts on a slow parallax layer and the
   roast stamp turns on the corner. A thin strip of numbers closes it.
   ========================================================================== */

const STRIP = [
  { label: "Roasting since", value: String(SITE.founded) },
  { label: "Partner farms", value: String(STATS.partnerFarms) },
  { label: "In the drum per batch", value: String(STATS.batchKg), unit: "kg" },
  { label: "Roasted every week", value: String(STATS.kgPerWeek), unit: "kg" },
];

function FounderNote() {
  return (
    <figure className="story-note">
      <blockquote>
        <p className="text-lead text-bark">“{STORY_LEAD}”</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="relative block size-12 shrink-0 overflow-hidden rounded-full">
          <Photo slot="founder" fill alt="" sizes="48px" position="46% 18%" />
        </span>
        <span className="leading-tight">
          <span className="block text-small font-semibold">{SITE.founder.name}</span>
          <span className="block text-micro text-bark">{SITE.founder.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function StoryOpening() {
  return (
    <PageHeader
      eyebrow={`Our story · Est. ${SITE.founded}`}
      title={["A seed warehouse,", "a drum roaster", <em key="em">and twelve farms.</em>]}
      titleClassName="story-title"
      aside={<FounderNote />}
    >
      <div className="story-hero">
        <figure className="story-hero-frame">
          <div className="story-hero-clip" data-reveal="clip">
            <div className="story-hero-media" data-parallax="0.06">
              {/* The page's LCP visual. 4:5 on phones (the 3:2 photo renders ~1.9× the frame width), 3:2 then 2:1 wider up. */}
              <Photo
                slot="roastery"
                fill
                zoom
                priority
                sizes="(min-width: 90rem) 1328px, (min-width: 40rem) 94vw, 125vw"
                mediaClassName="story-hero-zoom"
              />
            </div>
          </div>
          <figcaption className="story-hero-caption">
            <span className="eyebrow block text-mist">{ROASTERY_CAPTION.label}</span>
            <span className="display mt-0.5 block text-[1.0625rem] text-parchment">{ROASTERY_CAPTION.text}</span>
          </figcaption>
        </figure>
        <Stamp
          spin
          text={STAMP_TEXT}
          className="story-hero-stamp"
          color="var(--color-parchment)"
          disc="var(--color-clay)"
        />
      </div>

      <dl className="story-strip">
        {STRIP.map((item, i) => (
          <div key={item.label} className="story-strip-item" data-reveal="rise" data-reveal-delay={i * 80}>
            <dt className="eyebrow text-bark">{item.label}</dt>
            <dd className="display story-strip-value">
              {item.value}
              {item.unit && <span className="story-strip-unit"> {item.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </PageHeader>
  );
}
