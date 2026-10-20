import { Carousel } from "@/components/site/Carousel";
import { EnquireButton } from "@/components/site/EnquireButton";
import type { SiteContent } from "@/lib/content/types";

// Lodha Bellevue: each banner is an image (with its own caption) beside its own gold info panel.
// Panel text set on a banner wins; empty fields fall back to the section-level Hero values.
export function Hero({ content }: { content: SiteContent }) {
  const { hero } = content;
  const slides = hero.images.filter((s) => s.image);
  if (!slides.length && hero.image) slides.push({ image: hero.image });

  return (
    <section id="hero" className="scroll-mt-16 bg-surface">
      <h1 className="sr-only">{hero.title}</h1>
      <Carousel slideClass="w-full" gap="gap-0" autoplay={6000} showCounter={false}>
        {slides.map((s, i) => {
          const headline = s.headline || hero.headline || hero.title;
          const configText = s.configText || hero.configText;
          const priceTag = s.priceTag || hero.priceTag;
          return (
            <div key={i} className="grid h-full lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
              <div className="relative self-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.caption || `${hero.title} ${i + 1}`}
                  className="block h-auto w-full"
                  fetchPriority={i === 0 ? "high" : "auto"}
                  loading={i === 0 ? "eager" : "lazy"}
                />
                {s.caption && (
                  <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-4 pt-14 text-center font-heading text-lg text-[rgb(252_248_234)] md:pb-6 md:text-2xl">
                    {s.caption}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center justify-center bg-primary px-6 py-10 text-center text-primary-fg lg:px-10">
                <p className="whitespace-pre-line font-heading text-3xl uppercase leading-tight md:text-4xl xl:text-5xl">{headline}</p>
                {(configText || priceTag) && <span className="my-6 h-px w-2/3 bg-current opacity-40 md:my-8" aria-hidden="true" />}
                {configText && <p className="font-heading text-lg uppercase tracking-wide md:text-xl">{configText}</p>}
                {priceTag && <p className="mt-1 font-heading text-4xl md:text-5xl">{priceTag}</p>}
                {hero.ctaLabel && (
                  <EnquireButton className="mt-8 border border-current px-6 py-2.5 text-sm font-medium uppercase tracking-wider transition hover:bg-primary-fg hover:text-primary">
                    {hero.ctaLabel}
                  </EnquireButton>
                )}
              </div>
            </div>
          );
        })}
      </Carousel>
    </section>
  );
}
