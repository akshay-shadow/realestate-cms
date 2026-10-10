import type { SiteContent } from "@/lib/content/types";
import { Carousel } from "../Carousel";
import { EnquireButton } from "../EnquireButton";
import { SectionHeading } from "./SectionHeading";

export function Amenities({ content }: { content: SiteContent }) {
  const { amenities } = content;
  return (
    <section id="amenities" className="section">
      <div className="container-x">
        <SectionHeading eyebrow={amenities.subtitle} title={amenities.title} />
        <Carousel slideClass="w-[78%] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]" showCounter={false}>
          {amenities.items.map((a, i) => (
            <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-theme bg-surface-alt">
              {a.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.image} alt={a.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              ) : (
                <span className="grid h-full place-items-center pb-8 text-6xl" aria-hidden="true">
                  {a.icon}
                </span>
              )}
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-4 pt-10 text-center text-lg font-semibold text-white">
                {a.title}
              </p>
            </div>
          ))}
        </Carousel>
        {amenities.ctaLabel && (
          <div className="mt-8 text-center">
            <EnquireButton intent="amenities" title={amenities.ctaLabel} className="btn-primary">
              {amenities.ctaLabel}
            </EnquireButton>
          </div>
        )}
      </div>
    </section>
  );
}
