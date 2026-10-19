"use client";

import { useState } from "react";
import { EnquireButton } from "@/components/site/EnquireButton";
import { useEnquiry } from "@/components/site/EnquiryProvider";
import { categoriesOf } from "@/components/site/Tabs";
import type { SiteContent } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { SideIntro } from "./PlanPriceSwitch";

const FALLBACK = "Floor Plan";

// Lodha Bellevue: text and Plans/Prices switch on the left; BHK tabs and plan cards on the right.
export function FloorPlans({ content }: { content: SiteContent }) {
  const { floorPlans } = content;
  const { submitted, open } = useEnquiry();
  const locked = floorPlans.lockBehindForm && !submitted;
  const tabs = categoriesOf(floorPlans.items, FALLBACK);
  const [active, setActive] = useState(tabs[0] ?? FALLBACK);
  const items = floorPlans.items.filter((f) => (f.category?.trim() || FALLBACK) === active);

  return (
    <section id="floorPlans" className="section bg-surface-alt">
      <div className="container-x grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
        <SideIntro title={floorPlans.title} subtitle={floorPlans.subtitle} description={floorPlans.description} active="plans" />

        <div>
          {tabs.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-6 border-b border-ink/10" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={t === active}
                  onClick={() => setActive(t)}
                  className={cn(
                    "-mb-px border-b-2 pb-2 text-sm transition",
                    t === active ? "border-primary text-primary" : "border-transparent text-muted hover:text-ink",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((f, i) => (
              <div key={`${active}-${i}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-white ring-1 ring-ink/10">
                  {f.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.image}
                      alt={`${f.title} plan`}
                      loading="lazy"
                      className={cn("h-full w-full object-contain transition", locked && "scale-110 blur-md")}
                    />
                  )}
                  {locked ? (
                    <button
                      onClick={() => open({ intent: "floorplan", interest: f.title, title: `View ${f.title}` })}
                      className="absolute inset-0 grid place-items-center"
                      aria-label={`View ${f.title}`}
                    >
                      <span className="btn-primary bg-surface">View Plan</span>
                    </button>
                  ) : (
                    f.image && <a href={f.image} target="_blank" rel="noopener" className="absolute inset-0" aria-label={`Open ${f.title}`} />
                  )}
                </div>
                <p className="mt-3 text-center font-heading text-sm">
                  {f.title}
                  {f.area && <span className="text-muted"> · {f.area}</span>}
                </p>
              </div>
            ))}
          </div>
          {floorPlans.ctaLabel && (
            <div className="mt-8">
              <EnquireButton intent="floorplan" title={floorPlans.ctaLabel} className="btn-primary">
                {floorPlans.ctaLabel}
              </EnquireButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
