import { EnquireButton } from "@/components/site/EnquireButton";
import { LocationIcon } from "@/components/site/LocationIcon";
import type { SiteContent } from "@/lib/content/types";

// Lodha Bellevue: tagline, then the map on the left and a connectivity grid on the right
// (icon, place in capitals, travel time).
export function Location({ content }: { content: SiteContent }) {
  const { location } = content;
  const hasMap = Boolean(location.image || location.mapEmbedUrl);

  return (
    <section id="location" className="section">
      <div className="container-x">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          {location.title && <h2 className="font-heading text-2xl text-heading md:text-3xl">{location.title}</h2>}
          {location.description && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{location.description}</p>}
        </div>

        <div className={hasMap ? "grid items-center gap-8 md:grid-cols-2 md:gap-10" : "mx-auto max-w-4xl"}>
          {hasMap && (
            <div className={location.image ? "overflow-hidden" : "aspect-[4/3] overflow-hidden bg-surface"}>
              {location.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={location.image} alt="Location map" loading="lazy" className="block h-auto w-full" />
              ) : (
                <iframe
                  src={location.mapEmbedUrl}
                  title="Project location"
                  loading="lazy"
                  className="h-full w-full border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </div>
          )}

          <div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3">
              {location.nearby.map((n, i) => (
                <li key={`${n.place}-${i}`}>
                  <LocationIcon name={n.icon} className="mb-2 h-8 w-8 text-primary" />
                  <p className="text-xs font-medium uppercase leading-snug tracking-wide">{n.place}</p>
                  {n.distance && <p className="mt-0.5 text-xs text-muted">{n.distance}</p>}
                </li>
              ))}
            </ul>
            {location.ctaLabel && (
              <EnquireButton intent="location" title={location.ctaLabel} className="btn-primary mt-8">
                {location.ctaLabel}
              </EnquireButton>
            )}
            {location.note && <p className="mt-4 text-xs text-muted">{location.note}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
