import type { MetadataRoute } from "next";
import { CONFIG } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: CONFIG.website, changeFrequency: "daily", priority: 1 }];
}
