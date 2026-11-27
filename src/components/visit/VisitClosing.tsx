import { Texture } from "@/components/illustration/Texture";
import { ArrowLink, Button } from "@/components/ui/Button";

/* The page's last word: for everyone who can't make it to Alder Bend. */
export function VisitClosing() {
  return (
    <section className="defer-render shell pb-section" aria-labelledby="visit-closing-title">
      <div className="visit-closing">
        <Texture id="wide-a" className="text-espresso/[0.07]" />
        <div className="relative max-w-[40rem]">
          <p className="eyebrow mb-5 text-bark">Too far for a cortado?</p>
          <h2 id="visit-closing-title" className="display text-h1">
            The same coffee ships <em>twice a week.</em>
          </h2>
          <p className="mt-5 max-w-[46ch] text-body text-bark">
            Whatever is in the grinders on the bar is in the post on Tuesday and Friday, two days from roaster to door.
          </p>
        </div>
        <div className="relative flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button href="/shop" size="lg" icon="arrow" magnetic>
            Shop the coffee
          </Button>
          <ArrowLink href="/wholesale" className="text-body">
            Pouring it in your café
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
