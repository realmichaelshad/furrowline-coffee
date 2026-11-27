import { PRICE_TIERS, PRICING_NOTES, UNDER_FIVE_NOTE } from "@/content/wholesale";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { SectionIntro } from "@/components/ui/Typography";
import { formatPrice } from "@/lib/pricing";
import "./wholesale.css";

/* ==========================================================================
   (03) Indicative volume pricing. A real table from md up (caption, column
   and row headers); on phones the same three tiers as stacked cards, so
   nothing scrolls sideways. Prices in Fraunces, per kilo in mono.
   ========================================================================== */

function Price({ cents }: { cents: number }) {
  return (
    <span className="ws-price">
      <span className="display ws-price-value">{formatPrice(cents)}</span>
      <span className="ws-price-unit"> / kg</span>
    </span>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="shell py-section" aria-labelledby="pricing-title">
      <div className="grid-editorial items-end gap-y-8">
        <SectionIntro
          className="col-span-4 md:col-span-7"
          index={3}
          eyebrow="Indicative pricing"
          id="pricing-title"
          title={["Priced by the kilo,", <em key="em">by the week.</em>]}
        />
        <p className="col-span-4 text-lead text-bark md:col-span-4 md:col-start-9" data-reveal="rise" data-reveal-delay="160">
          The more you pour, the less each kilo costs and the more often we visit. Your quote is written down and held for a
          year.
        </p>
      </div>

      <div className="ws-pricing" data-reveal="rise">
        <table className="ws-table">
          <caption className="ws-table-caption">
            <span className="display text-h3">Per kilo, by weekly volume</span>
            <Badge tone="ochre">Indicative</Badge>
          </caption>
          <thead>
            <tr>
              <th scope="col">Weekly volume</th>
              <th scope="col">Deep Field espresso</th>
              <th scope="col">Single origin</th>
              <th scope="col">Dial-in visits</th>
            </tr>
          </thead>
          <tbody>
            {PRICE_TIERS.map((tier) => (
              <tr key={tier.id} data-featured={tier.note ? "" : undefined}>
                <th scope="row">
                  <span className="display ws-tier-label">{tier.label}</span>
                  {tier.note && <span className="ws-tier-note eyebrow">{tier.note}</span>}
                </th>
                <td>
                  <Price cents={tier.espresso} />
                </td>
                <td>
                  <Price cents={tier.single} />
                </td>
                <td className="ws-visits">{tier.visits}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="ws-tiers" aria-label="Indicative prices per kilo, by weekly volume">
          {PRICE_TIERS.map((tier) => (
            <li key={tier.id} className="ws-tier" data-featured={tier.note ? "" : undefined}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="display text-h3">{tier.label}</h3>
                {tier.note ? <Badge tone="moss">{tier.note}</Badge> : <Badge tone="ochre">Indicative</Badge>}
              </div>
              <dl className="ws-tier-rows">
                <div>
                  <dt>Deep Field espresso</dt>
                  <dd>
                    <Price cents={tier.espresso} />
                  </dd>
                </div>
                <div>
                  <dt>Single origin</dt>
                  <dd>
                    <Price cents={tier.single} />
                  </dd>
                </div>
                <div>
                  <dt>Dial-in visits</dt>
                  <dd className="font-semibold">{tier.visits}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>

      <div className="ws-pricing-notes">
        <p className="flex items-start gap-3 text-small">
          <Icon name="info" className="mt-0.5 size-5 shrink-0 text-clay" />
          <span>{UNDER_FIVE_NOTE}</span>
        </p>
        {PRICING_NOTES.map((note) => (
          <p key={note} className="text-small text-bark">
            {note}
          </p>
        ))}
      </div>
    </section>
  );
}
