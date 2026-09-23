import type { MetadataRoute } from "next";
import { pageUrl, siteRoot } from "@/lib/site-url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended", "Yandex", "YandexBot"],
        allow: "/",
      },
    ],
    sitemap: pageUrl("sitemap.xml"),
    host: siteRoot(),
  };
}
