import { EnquireButton } from "@/components/site/EnquireButton";
import type { SiteContent } from "@/lib/content/types";

// Lodha Bellevue: cream band with the project logo and a centred intro paragraph.
export function About({ content }: { content: SiteContent }) {
  const { about, brand } = content;
  return (
    <section id="about" className="section bg-surface-alt">
      <div className="container-x">
        <div className="mx-auto max-w-4xl text-center">
          {brand.projectLogo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.projectLogo} alt={brand.name} loading="lazy" className="mx-auto mb-5 h-10 w-auto object-contain md:h-12" />
          )}
          {about.subtitle && <p className="eyebrow">{about.subtitle}</p>}
          <h2 className="font-heading text-xl text-heading md:text-2xl">{about.title}</h2>
          {about.body && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted md:text-base">{about.body}</p>}
          {about.ctaLabel && (
            <EnquireButton title={about.ctaLabel} className="btn-primary mt-6">
              {about.ctaLabel}
            </EnquireButton>
          )}
        </div>
        {about.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={about.image} alt={about.title} loading="lazy" className="mt-8 block h-auto w-full md:mt-12" />
        )}
        {about.stats.length > 0 && (
          <dl className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
            {about.stats.map((s) => (
              <div key={s.label}>
                <dt className="font-heading text-2xl text-primary md:text-3xl">{s.value}</dt>
                <dd className="mt-1 text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
