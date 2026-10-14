import { Carousel } from "@/components/site/Carousel";
import { EnquireButton } from "@/components/site/EnquireButton";
import type { SiteContent } from "@/lib/content/types";

// Mahindra Vista: text on the left, one-image-at-a-time slider on the right.
export function Amenities({ content }: { content: SiteContent }) {
  const { amenities } = content;
  return (
    <section id="amenities" className="section">
      <div className="container-x grid items-center gap-8 lg:grid-cols-[2fr_3fr] lg:gap-14">
        <div>
          {amenities.subtitle && <p className="eyebrow">{amenities.subtitle}</p>}
          <h2 className="heading">{amenities.title}</h2>
          {amenities.description && <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">{amenities.description}</p>}
          {amenities.ctaLabel && (
            <EnquireButton intent="amenities" title={amenities.ctaLabel} className="btn-primary mt-6">
              {amenities.ctaLabel}
            </EnquireButton>
          )}
        </div>

        <Carousel autoplay={4000}>
          {amenities.items.map((a, i) => (
            <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-theme bg-surface-alt">
              {a.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.image} alt={a.title} loading={i === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full place-items-center pb-8 text-7xl" aria-hidden="true">
                  {a.icon}
                </span>
              )}
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-12 text-xl font-semibold text-white">
                {a.title}
              </p>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
