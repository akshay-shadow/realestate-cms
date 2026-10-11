import type { MetadataRoute } from "next";
import { getSite } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { url } = await getSite();
  return [
    { url, changeFrequency: "weekly", priority: 1 },
    { url: `${url}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
