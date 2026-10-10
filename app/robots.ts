import type { MetadataRoute } from "next";
import { getSite, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { content } = await getSite();
  return {
    rules: content.seo.noindex
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/thank-you"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
