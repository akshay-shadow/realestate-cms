"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { cn } from "@/lib/utils";
import { EnquireButton } from "../EnquireButton";
import { useEnquiry } from "../EnquiryProvider";
import { categoriesOf, Tabs } from "../Tabs";
import { SectionHeading } from "./SectionHeading";

const FALLBACK = "Floor Plan";

export function FloorPlans({ content }: { content: SiteContent }) {
  const { floorPlans } = content;
  const { submitted, open } = useEnquiry();
  const locked = floorPlans.lockBehindForm && !submitted;
  const tabs = categoriesOf(floorPlans.items, FALLBACK);
  const [active, setActive] = useState(tabs[0] ?? FALLBACK);
  const items = floorPlans.items.filter((f) => (f.category?.trim() || FALLBACK) === active);

  return (
    <section id="floorPlans" className="section">
      <div className="container-x">
        <SectionHeading eyebrow={floorPlans.subtitle} title={floorPlans.title} />
        <Tabs tabs={tabs} active={active} onChange={setActive} />
        <div className={cn("mx-auto grid gap-6", items.length === 1 ? "max-w-3xl" : "max-w-6xl sm:grid-cols-2 lg:grid-cols-3")}>
          {items.map((f, i) => (
            <div key={`${active}-${i}`} className="overflow-hidden rounded-theme bg-surface-alt ring-1 ring-ink/10">
              <div className={cn("relative overflow-hidden bg-white", !f.image && "aspect-[4/3]")}>
                {f.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.image}
                    alt={`${f.title} plan`}
                    loading="lazy"
                    className={cn("block h-auto w-full transition", locked && "scale-110 blur-md")}
                  />
                )}
                {locked ? (
                  <button
                    onClick={() => open({ intent: "floorplan", interest: f.title, title: `View ${f.title}` })}
                    className="absolute inset-0 grid place-items-center bg-black/30"
                  >
                    <span className="btn-primary">🔒 View {f.category || "Plan"}</span>
                  </button>
                ) : (
                  f.image && <a href={f.image} target="_blank" rel="noopener" className="absolute inset-0" aria-label={`Open ${f.title}`} />
                )}
              </div>
              {(f.title || f.area) && (
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <h3 className="font-semibold">{f.title}</h3>
                  {f.area && <span className="text-sm text-muted">{f.area}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
        {floorPlans.ctaLabel && (
          <div className="mt-8 text-center">
            <EnquireButton intent="floorplan" title={floorPlans.ctaLabel} className="btn-primary">
              {floorPlans.ctaLabel}
            </EnquireButton>
          </div>
        )}
      </div>
    </section>
  );
}
