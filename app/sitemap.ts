import type { MetadataRoute } from "next";
import { getSite } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { url, content } = await getSite();
  if (!content.visibility.isPublic) return [];
  return [
    { url, changeFrequency: "weekly", priority: 1 },
    { url: `${url}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
