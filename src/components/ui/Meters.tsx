import { ROAST_LEVELS, type RoastLevel, type TasteProfile } from "@/content/products";
import { cn } from "@/lib/cn";

/** Roast level as four furrow bars. */
export function RoastMeter({ roast, className, showLabel = true }: { roast: RoastLevel; className?: string; showLabel?: boolean }) {
  const level = ROAST_LEVELS.find((r) => r.id === roast);
  const step = level?.step ?? 2;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex items-end gap-[3px]" role="img" aria-label={`Roast: ${level?.label ?? roast}, ${step} of 4`}>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("block h-3 w-[3px] rounded-full bg-current", i > step && "opacity-25")} />
        ))}
      </span>
      {showLabel && <span className="eyebrow">{level?.label} roast</span>}
    </span>
  );
}

/** Acidity / sweetness / body as five-dot rows. */
export function TasteMeter({ profile, className }: { profile: TasteProfile; className?: string }) {
  const rows: Array<[string, number]> = [
    ["Acidity", profile.acidity],
    ["Sweetness", profile.sweetness],
    ["Body", profile.body],
  ];
  return (
    <dl className={cn("grid gap-2.5", className)}>
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[6.5rem_1fr] items-center gap-4">
          <dt className="eyebrow">{label}</dt>
          <dd className="flex gap-1.5">
            <span className="sr-only">{value} out of 5</span>
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                data-dot
                aria-hidden="true"
                className={cn("h-1.5 flex-1 rounded-full bg-current", i > value && "opacity-20")}
              />
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
