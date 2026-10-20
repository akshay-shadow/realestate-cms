import type { SiteContent } from "@/lib/content/types";
import { Carousel } from "../Carousel";
import { EnquireButton } from "../EnquireButton";
import { LeadForm } from "../LeadForm";

function InfoPanel({ content }: { content: SiteContent }) {
  const { hero, brand } = content;
  return (
    <div className="text-center">
      {hero.eyebrow && (
        <p className="mx-auto mb-3 inline-block rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          {hero.eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-semibold leading-tight text-heading">{hero.title}</h1>
      {hero.subtitle && <p className="mt-1 text-sm text-muted">{hero.subtitle}</p>}
      {brand.location && <p className="mt-3 text-sm font-medium">📍 {brand.location}</p>}

      {hero.offers.length > 0 && (
        <div className="mx-auto mt-5 rounded-theme border border-dashed border-primary/60 bg-primary/5 p-4">
          {hero.offerTitle && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{hero.offerTitle}</p>}
          <ul className="space-y-1 text-sm">
            {hero.offers.map((o) => (
              <li key={o.text}>✦ {o.text}</li>
            ))}
          </ul>
        </div>
      )}

      {hero.configText && <p className="mt-5 text-sm text-muted">{hero.configText} Starting At</p>}
      {hero.priceTag && <p className="mt-1 text-3xl font-bold text-heading">{hero.priceTag}</p>}
    </div>
  );
}

export function Hero({ content }: { content: SiteContent }) {
  const { hero, brochure } = content;

  if (hero.layout === "split") {
    const images = hero.images.filter((i) => i.image);
    return (
      <section id="hero" className="scroll-mt-16 bg-secondary">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="relative self-center">
            {images.length > 0 ? (
              <Carousel slideClass="w-full" gap="gap-0" autoplay={5000} showCounter={false}>
                {images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img.image}
                    alt={`${hero.title} ${i + 1}`}
                    className="block h-auto w-full"
                    fetchPriority={i === 0 ? "high" : "auto"}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                ))}
              </Carousel>
            ) : (
              hero.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={hero.image} alt={hero.title} className="block h-auto w-full" />
              )
            )}
          </div>

          <div className="flex flex-col justify-center gap-6 bg-surface px-5 py-8 md:px-8">
            <InfoPanel content={content} />
            {hero.showForm ? (
              <div>
                {hero.formTitle && <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wider">{hero.formTitle}</p>}
                <LeadForm content={content} source="hero" showBrochureLink />
              </div>
            ) : (
              <EnquireButton className="btn-primary w-full">{hero.ctaLabel}</EnquireButton>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Full-screen background layout
  const overlay = Math.min(100, Math.max(0, Number(hero.overlayOpacity) || 0)) / 100;
  return (
    <section id="hero" className="relative flex min-h-[calc(100svh-4rem)] scroll-mt-16 items-center overflow-hidden bg-secondary text-white">
      {hero.mediaType === "video" && hero.video ? (
        <video className="absolute inset-0 h-full w-full object-cover" src={hero.video} poster={hero.image || undefined} autoPlay muted loop playsInline />
      ) : (
        hero.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.image} alt={hero.title} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        )
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black to-black/40" style={{ opacity: overlay }} />

      <div className="container-x relative grid items-center gap-10 py-16 lg:grid-cols-[1.3fr_1fr]">
        <div>
          {hero.eyebrow && <p className="eyebrow">{hero.eyebrow}</p>}
          <h1 className="text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">{hero.title}</h1>
          {hero.subtitle && <p className="mt-4 max-w-xl text-white/85 md:text-lg">{hero.subtitle}</p>}
          {hero.configText && <p className="mt-6 text-white/80">{hero.configText} Starting At</p>}
          {hero.priceTag && <p className="mt-1 text-3xl font-semibold text-accent">{hero.priceTag}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <EnquireButton>{hero.ctaLabel}</EnquireButton>
            {brochure.enabled && (
              <EnquireButton intent="brochure" className="btn-outline">
                {brochure.label}
              </EnquireButton>
            )}
          </div>
          {hero.badges.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
              {hero.badges.map((b) => (
                <li key={b.text}>✓ {b.text}</li>
              ))}
            </ul>
          )}
        </div>
        {hero.showForm && (
          <div className="rounded-theme bg-surface p-6 text-ink shadow-2xl md:p-8">
            <h2 className="mb-5 text-center text-xl font-semibold text-heading">{hero.formTitle}</h2>
            <LeadForm content={content} source="hero" showBrochureLink />
          </div>
        )}
      </div>
    </section>
  );
}
