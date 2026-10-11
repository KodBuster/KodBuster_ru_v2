import type { MetadataRoute } from "next";
import { packages, packageHref, sistemaDirections, sistemaServiceHref } from "@/data/site";
import { pageUrl, siteRoot } from "@/lib/site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-10-10");
  return [
    { url: siteRoot(), lastModified: updated, changeFrequency: "monthly", priority: 1 },
    ...packages.map((item) => ({
      url: pageUrl(packageHref(item.slug).replace(/^\//, "")),
      lastModified: updated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...sistemaDirections.map((direction) => ({
      url: pageUrl(sistemaServiceHref(direction.slug).replace(/^\//, "")),
      lastModified: updated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: pageUrl("privacy/"), lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: pageUrl("llms.txt"), lastModified: updated, changeFrequency: "monthly", priority: 0.2 },
  ];
}
