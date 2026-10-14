import Link from "next/link";
import type { SiteContent } from "@/lib/content/types";

export function Footer({ content }: { content: SiteContent }) {
  const { brand, footer } = content;
  const social = footer.social.filter((s) => s.url);

  return (
    <footer className="border-t border-ink/10 bg-secondary pb-28 pt-12 text-sm text-muted md:pb-10">
      <div className="container-x max-w-5xl space-y-6 text-center">
        {brand.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brand.logo} alt={brand.name} className="mx-auto h-12 w-auto" />
        ) : (
          <p className="font-heading text-2xl font-semibold text-ink">{brand.name}</p>
        )}
        {footer.about && <p className="mx-auto max-w-2xl">{footer.about}</p>}

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          {brand.reraQr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.reraQr} alt="RERA QR code" loading="lazy" className="h-24 w-24 rounded bg-white p-1" />
          )}
          <div className="space-y-1.5 text-xs sm:text-left">
            {footer.reraNote && <p>{footer.reraNote}</p>}
            {brand.reraUrl && (
              <p>
                <a href={brand.reraUrl} target="_blank" rel="noopener" className="text-primary hover:underline">
                  {brand.reraUrl.replace(/^https?:\/\//, "")}
                </a>
              </p>
            )}
            {brand.rera && (
              <p>
                Project Registration {/[|,]/.test(brand.rera) ? "Nos." : "No."}: <span className="font-semibold">{brand.rera}</span>
              </p>
            )}
            {footer.advertiser && <p>{footer.advertiser}</p>}
          </div>
        </div>

        {footer.disclaimer && <p className="text-xs leading-relaxed opacity-80">{footer.disclaimer}</p>}

        {social.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {social.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener"
                className="rounded-full border border-ink/20 px-3 py-1 text-xs hover:border-primary hover:text-primary"
              >
                {s.platform}
              </a>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-2 border-t border-ink/10 pt-6 text-xs sm:flex-row sm:gap-4">
          <span>{footer.copyright}</span>
          <Link href="/privacy-policy" className="hover:text-primary">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
