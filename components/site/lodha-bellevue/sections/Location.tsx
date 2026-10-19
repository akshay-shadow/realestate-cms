"use client";

import { useState } from "react";
import { EnquireButton } from "@/components/site/EnquireButton";
import type { SiteContent } from "@/lib/content/types";

const INITIAL = 8;

// Lodha Bellevue: map on the left; places with travel times, "View All" and a note on the right.
export function Location({ content }: { content: SiteContent }) {
  const { location } = content;
  const [all, setAll] = useState(false);
  const places = all ? location.nearby : location.nearby.slice(0, INITIAL);
  const hasMap = Boolean(location.image || location.mapEmbedUrl);

  return (
    <section id="location" className="section bg-surface-alt">
      <div className="container-x">
        {location.title && <h2 className="mb-8 text-center font-heading text-2xl text-heading md:text-3xl">{location.title}</h2>}
        <div className={hasMap ? "grid items-center gap-8 md:grid-cols-2 md:gap-12" : "mx-auto max-w-2xl"}>
          {hasMap && (
            <div className="aspect-[4/3] overflow-hidden bg-surface ring-1 ring-ink/10">
              {location.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={location.image} alt="Location map" loading="lazy" className="h-full w-full object-cover" />
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
            <ul className="divide-y divide-ink/10">
              {places.map((n, i) => (
                <li key={`${n.place}-${i}`} className="flex items-center gap-3 py-2.5 text-sm">
                  <svg className="shrink-0 text-primary" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  <span className="flex-1">{n.place}</span>
                  {n.distance && <span className="shrink-0 font-semibold">{n.distance}</span>}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              {location.nearby.length > INITIAL && (
                <button type="button" onClick={() => setAll(!all)} className="btn-primary">
                  {all ? "Show Less" : "View All"}
                </button>
              )}
              {location.ctaLabel && (
                <EnquireButton intent="location" title={location.ctaLabel} className="btn-primary">
                  {location.ctaLabel}
                </EnquireButton>
              )}
            </div>
            {location.note && <p className="mt-4 text-xs text-muted">{location.note}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
