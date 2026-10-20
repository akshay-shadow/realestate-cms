import { EnquireButton } from "@/components/site/EnquireButton";
import { SectionHeading } from "@/components/site/sections/SectionHeading";
import type { SiteContent } from "@/lib/content/types";

// Mahindra Vista: all location advantages in one list, no category tabs.
export function Location({ content }: { content: SiteContent }) {
  const { location, brand } = content;
  return (
    <section id="location" className="section">
      <div className="container-x">
        <SectionHeading eyebrow={location.subtitle} title={location.title} />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className={location.image ? "overflow-hidden rounded-theme ring-1 ring-ink/10" : "aspect-[4/3] overflow-hidden rounded-theme bg-surface-alt ring-1 ring-ink/10"}>
            {location.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={location.image} alt="Location map" loading="lazy" className="block h-auto w-full" />
            ) : (
              location.mapEmbedUrl && (
                <iframe
                  src={location.mapEmbedUrl}
                  title="Project location"
                  loading="lazy"
                  className="h-full w-full border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )
            )}
          </div>
          <div>
            <ul className="divide-y divide-ink/10 rounded-theme bg-surface-alt px-5 ring-1 ring-ink/10">
              {location.nearby.map((n, i) => (
                <li key={`${n.place}-${i}`} className="flex items-center justify-between gap-4 py-3.5">
                  <span className="text-sm font-medium">{n.place}</span>
                  {n.distance && (
                    <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">{n.distance}</span>
                  )}
                </li>
              ))}
            </ul>
            {brand.address && <p className="mt-4 text-sm text-muted">📍 {brand.address}</p>}
            {location.ctaLabel && (
              <EnquireButton intent="location" title={location.ctaLabel} className="btn-primary mt-6">
                {location.ctaLabel}
              </EnquireButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
