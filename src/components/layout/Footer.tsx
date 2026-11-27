import Link from "next/link";
import { FOOTER_NAV, SITE } from "@/content/site";
import { Logo, Mark } from "@/components/brand/Logo";
import { Texture } from "@/components/illustration/Texture";
import { prefetchFor } from "@/components/ui/Button";
import { BackToTop } from "./BackToTop";

/* ==========================================================================
   Footer: espresso ground, a roast-day note, link columns, the oversized
   wordmark set edge to edge, and the honest concept line. No contact
   details here by design (they live on /visit and /wholesale only).
   ========================================================================== */

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="defer-render on-dark relative overflow-hidden bg-espresso text-parchment" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <Texture id="footer" className="text-parchment/[0.07]" />

      <div className="shell relative pt-section-sm">
        <div className="grid-editorial gap-y-12">
          <div className="col-span-4 md:col-span-5">
            <Mark className="h-12 w-auto" color="var(--color-peach)" />
            <p className="display mt-6 max-w-[18ch] text-h2 text-parchment">
              Roasted on Tuesdays and Fridays. At your door two days later.
            </p>
            <p className="mt-5 max-w-[40ch] text-small text-mist">
              Seasonal coffee from twelve partner farms, roasted in small batches in Alder Bend.
            </p>
          </div>
          <div className="col-span-4 grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-6 md:col-start-7">
            {FOOTER_NAV.map((group) => (
              <div key={group.title}>
                <h3 className="eyebrow mb-5 text-mist">{group.title}</h3>
                <ul className="grid gap-3 text-small">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} prefetch={prefetchFor(link.href)} className="link-sweep text-parchment/90 hover:text-parchment">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-section-sm" aria-hidden="true">
          <Logo variant="wordmark" shared="use" decorative textColor="var(--color-parchment)" className="w-full opacity-95" />
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-[var(--rule-inverse)] py-7 text-micro text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. <span className="whitespace-nowrap text-parchment/80">{SITE.conceptLine}.</span>
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
