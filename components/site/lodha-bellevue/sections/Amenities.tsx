import { Carousel } from "@/components/site/Carousel";
import { EnquireButton } from "@/components/site/EnquireButton";
import { ResponsiveImage } from "@/components/site/ResponsiveImage";
import type { SiteContent } from "@/lib/content/types";

// Lodha Bellevue: write-up and brochure button on the left, amenity list on the right,
// then a full-width slider three at a time. The slider uses its own images (desktop + mobile),
// falling back to the amenity images when none are added.
export function Amenities({ content }: { content: SiteContent }) {
  const { amenities } = content;
  const ownSlides = (amenities.slider ?? []).filter((s) => s.image);
  const slides = ownSlides.length
    ? ownSlides
    : amenities.items.filter((a) => a.image).map((a) => ({ image: a.image, mobileImage: "", caption: a.title }));

  return (
    <section id="amenities" className="section">
      <div className="container-x">
        <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-12">
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

        {slides.length > 0 && (
          <Carousel
            className="mt-10 md:mt-14"
            slideClass="w-[85%] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
            autoplay={4500}
            showCounter={false}
          >
            {slides.map((s, i) => (
              <figure key={i} className="relative">
                <ResponsiveImage src={s.image} mobileSrc={s.mobileImage} alt={s.caption || amenities.title} className="block h-auto w-full" />
                {s.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 text-sm text-white">
                    {s.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
}
