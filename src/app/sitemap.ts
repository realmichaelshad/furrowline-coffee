import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/content/products";
import { SITE } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/our-story", "/wholesale", "/visit"];
  return [
    ...pages.map((path) => ({ url: `${SITE.url}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.8 })),
    ...PRODUCTS.map((p) => ({ url: `${SITE.url}/shop/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
