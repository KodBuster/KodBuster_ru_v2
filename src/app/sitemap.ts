import type { MetadataRoute } from "next";
import { pageUrl, siteRoot } from "@/lib/site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-09-23");
  return [
    { url: siteRoot(), lastModified: updated, changeFrequency: "monthly", priority: 1 },
    { url: pageUrl("privacy/"), lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: pageUrl("llms.txt"), lastModified: updated, changeFrequency: "monthly", priority: 0.2 },
  ];
}
