import { EnquireButton } from "@/components/site/EnquireButton";
import type { SiteContent } from "@/lib/content/types";

// Lodha Bellevue: "Luxury residences" text on the left, image on the right.
export function Highlights({ content }: { content: SiteContent }) {
  const { highlights } = content;
  return (
    <section id="highlights" className="section">
      <div className="container-x grid max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="order-2 md:order-1">
          {highlights.subtitle && <p className="eyebrow">{highlights.subtitle}</p>}
          <h2 className="whitespace-pre-line font-heading text-2xl text-heading md:text-3xl">{highlights.title}</h2>
          {highlights.description && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">{highlights.description}</p>}
          {highlights.items.length > 0 && (
            <ul className="mt-5 space-y-3">
              {highlights.items.map((h, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" aria-hidden="true" />
                  <span>
                    <span className="font-medium">{h.title}</span>
                    {h.description && <span className="text-muted"> – {h.description}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {highlights.ctaLabel && (
            <EnquireButton intent="brochure" title={highlights.ctaLabel} className="btn-primary mt-6">
              {highlights.ctaLabel}
            </EnquireButton>
          )}
        </div>
        {highlights.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={highlights.image} alt={highlights.title} loading="lazy" className="order-1 block h-auto w-full md:order-2" />
        )}
      </div>
    </section>
  );
}
