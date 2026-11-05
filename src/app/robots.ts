import type { MetadataRoute } from "next";
import { CONFIG } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${CONFIG.website}/sitemap.xml`,
    host: CONFIG.website,
  };
}
