import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // The brand sheets stay crawlable so crawlers can read their noindex (see their metadata); they are
    // also left out of the sitemap.
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
