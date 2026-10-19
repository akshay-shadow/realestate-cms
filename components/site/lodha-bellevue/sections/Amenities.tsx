import { EnquireButton } from "@/components/site/EnquireButton";
import type { SiteContent } from "@/lib/content/types";

// Lodha Bellevue: text and brochure button on the left, amenity list with icons on the right.
export function Amenities({ content }: { content: SiteContent }) {
  const { amenities } = content;
  return (
    <section id="amenities" className="section">
      <div className="container-x grid max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-12">
        <div>
          {amenities.subtitle && <p className="eyebrow">{amenities.subtitle}</p>}
          <h2 className="whitespace-pre-line font-heading text-2xl text-heading md:text-3xl">{amenities.title}</h2>
          {amenities.description && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">{amenities.description}</p>}
          {amenities.ctaLabel && (
            <EnquireButton intent="amenities" title={amenities.ctaLabel} className="btn-primary mt-6">
              {amenities.ctaLabel}
            </EnquireButton>
          )}
        </div>
        <ul className="space-y-3">
          {amenities.items.map((a, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              {a.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.image} alt="" loading="lazy" className="h-7 w-7 shrink-0 object-contain" />
              ) : (
                <span className="grid h-7 w-7 shrink-0 place-items-center text-lg text-primary" aria-hidden="true">
                  {a.icon || "✦"}
                </span>
              )}
              <span>{a.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
