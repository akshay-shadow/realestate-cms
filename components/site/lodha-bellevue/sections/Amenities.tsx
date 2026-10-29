import { Carousel } from "@/components/site/Carousel";
import { ResponsiveImage } from "@/components/site/ResponsiveImage";
import type { SiteContent } from "@/lib/content/types";

// Lodha Bellevue: centred title, then a two-at-a-time image slider with round arrows below.
// Uses Amenities → Slider images (desktop + mobile), falling back to the amenity images.
export function Amenities({ content }: { content: SiteContent }) {
  const { amenities } = content;
  const ownSlides = (amenities.slider ?? []).filter((s) => s.image);
  const slides = ownSlides.length
    ? ownSlides
    : amenities.items.filter((a) => a.image).map((a) => ({ image: a.image, mobileImage: "", caption: a.title }));

  return (
    <section id="amenities" className="section">
      <div className="container-x">
        <div className="mb-8 text-center md:mb-10">
          {amenities.subtitle && <p className="eyebrow">{amenities.subtitle}</p>}
          <h2 className="font-heading text-2xl uppercase tracking-wide text-heading md:text-3xl">{amenities.title}</h2>
          <span className="mx-auto mt-3 block h-px w-28 bg-primary" aria-hidden="true" />
          {amenities.description && (
            <p className="mx-auto mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted">{amenities.description}</p>
          )}
        </div>

        {slides.length > 0 && (
          <Carousel slideClass="w-[85%] md:w-[calc(50%-12px)]" gap="gap-6" autoplay={4500} showCounter={false} arrows="below">
            {slides.map((s, i) => (
              <figure key={i} className="relative">
                <ResponsiveImage src={s.image} mobileSrc={s.mobileImage} alt={s.caption || amenities.title} className="block h-auto w-full" />
                {s.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-sm text-white">
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
