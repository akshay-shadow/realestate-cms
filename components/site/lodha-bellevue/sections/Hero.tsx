import { Carousel } from "@/components/site/Carousel";
import { EnquireButton } from "@/components/site/EnquireButton";
import type { SiteContent } from "@/lib/content/types";

// Lodha Bellevue: image slider on the left, gold panel with headline and price on the right.
export function Hero({ content }: { content: SiteContent }) {
  const { hero } = content;
  const images = hero.images.map((i) => i.image).filter(Boolean);
  if (!images.length && hero.image) images.push(hero.image);
  const headline = hero.headline || hero.title;

  return (
    <section id="hero" className="scroll-mt-16 bg-surface">
      <div className="grid lg:h-[calc(100svh-4rem)] lg:min-h-[560px] lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full">
          <Carousel fill slideClass="w-full h-full" gap="gap-0" autoplay={5000} showCounter={false}>
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`${hero.title} ${i + 1}`}
                className="h-full w-full object-cover"
                fetchPriority={i === 0 ? "high" : "auto"}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
          </Carousel>
        </div>

        <div className="flex flex-col items-center justify-center bg-primary px-6 py-10 text-center text-primary-fg lg:px-10">
          {hero.headline && <h1 className="sr-only">{hero.title}</h1>}
          {hero.headline ? (
            <p className="whitespace-pre-line font-heading text-3xl uppercase leading-tight md:text-4xl xl:text-5xl">{headline}</p>
          ) : (
            <h1 className="font-heading text-3xl uppercase leading-tight md:text-4xl xl:text-5xl">{headline}</h1>
          )}
          {(hero.configText || hero.priceTag) && <span className="my-6 h-px w-2/3 bg-current opacity-40 md:my-10" aria-hidden="true" />}
          {hero.configText && <p className="font-heading text-lg uppercase tracking-wide md:text-xl">{hero.configText}</p>}
          {hero.priceTag && <p className="mt-1 font-heading text-4xl md:text-5xl">{hero.priceTag}</p>}
          {hero.ctaLabel && (
            <EnquireButton className="mt-8 border border-current px-6 py-2.5 text-sm font-medium uppercase tracking-wider transition hover:bg-primary-fg hover:text-primary">
              {hero.ctaLabel}
            </EnquireButton>
          )}
        </div>
      </div>
    </section>
  );
}
