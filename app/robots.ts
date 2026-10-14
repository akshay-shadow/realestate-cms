import type { MetadataRoute } from "next";
import { getSite } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { content, url } = await getSite();
  return {
    rules: content.seo.noindex || !content.visibility.isPublic
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/thank-you"] },
    sitemap: `${url}/sitemap.xml`,
  };
}
