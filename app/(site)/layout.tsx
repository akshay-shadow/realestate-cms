import type { Metadata } from "next";
import { EnquiryProvider } from "@/components/site/EnquiryProvider";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Tracking } from "@/components/site/Tracking";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { getSite } from "@/lib/site";
import { googleFontsHref, hexToRgb, RADIUS } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { content, url } = await getSite();
  const { seo, brand } = content;
  return {
    metadataBase: new URL(url),
    title: { default: seo.title, template: `%s | ${brand.name}` },
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: "/" },
    robots: seo.noindex ? { index: false, follow: false } : undefined,
    icons: brand.favicon ? { icon: brand.favicon } : undefined,
    openGraph: {
      type: "website",
      title: seo.title,
      description: seo.description,
      siteName: brand.name,
      images: seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { content, url } = await getSite();
  const t = content.theme;
  const font = (f: string) => f.replace(/[^\w\s-]/g, "");

  const css = `:root{
--c-primary:${hexToRgb(t.primary)};
--c-primary-fg:${hexToRgb(t.primaryForeground, "255 255 255")};
--c-secondary:${hexToRgb(t.secondary)};
--c-accent:${hexToRgb(t.accent)};
--c-surface:${hexToRgb(t.surface, "255 255 255")};
--c-surface-alt:${hexToRgb(t.surfaceAlt, "245 245 245")};
--c-ink:${hexToRgb(t.ink)};
--c-muted:${hexToRgb(t.muted, "107 114 128")};
--c-heading:${hexToRgb(t.heading || t.ink)};
--font-heading:"${font(t.headingFont)}",Georgia,serif;
--font-body:"${font(t.bodyFont)}",system-ui,sans-serif;
--radius:${RADIUS[t.radius] ?? "10px"};
}`;
  const fontsHref = googleFontsHref([font(t.headingFont), font(t.bodyFont)]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: content.brand.name,
    description: content.seo.description,
    url,
    image: content.seo.ogImage || undefined,
    address: content.brand.address,
    telephone: content.brand.phone,
  };

  return (
    <>
      {fontsHref && (
        <>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link rel="stylesheet" href={fontsHref} precedence="default" />
        </>
      )}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Tracking tracking={content.tracking} />
      <div className="site min-h-screen">
        <EnquiryProvider content={content}>
          <Header content={content} />
          <main className="pt-16">{children}</main>
          <Footer content={content} />
          <WhatsAppFloat content={content} />
        </EnquiryProvider>
      </div>
    </>
  );
}
