import type { SiteContent } from "@/lib/content/types";
import { EnquireButton } from "../EnquireButton";
import { SectionHeading } from "./SectionHeading";

export function Pricing({ content }: { content: SiteContent }) {
  const { pricing } = content;
  return (
    <section id="pricing" className="section bg-surface-alt">
      <div className="container-x">
        <SectionHeading eyebrow={pricing.subtitle} title={pricing.title} />
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pricing.items.map((p) => (
            <div key={p.type} className="rounded-theme bg-surface p-4 ring-1 ring-ink/10">
              <EnquireButton
                intent="pricing"
                interest={p.type}
                title={`${pricing.priceSheetLabel || "Price Sheet"} – ${p.type}`}
                className="group relative block w-full overflow-hidden rounded-theme bg-surface-alt"
              >
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={`${p.type} plan`} loading="lazy" className="block h-auto w-full scale-110 blur-sm" />
                )}
                <span className="absolute inset-0 grid place-items-center bg-black/30">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-xl text-gray-900 transition group-hover:scale-110" aria-hidden="true">
                    🔍
                  </span>
                </span>
              </EnquireButton>
              <dl className="mt-4 divide-y divide-ink/10 text-sm">
                <div className="flex justify-between py-2.5">
                  <dt className="text-muted">Typology</dt>
                  <dd className="font-semibold">{p.type}</dd>
                </div>
                <div className="flex justify-between gap-3 py-2.5">
                  <dt className="text-muted">Carpet Area</dt>
                  <dd className="text-right font-semibold">{p.area}</dd>
                </div>
                <div className="flex justify-between gap-3 py-2.5">
                  <dt className="text-muted">Price</dt>
                  <dd className="text-right font-semibold text-heading">{p.price}</dd>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <dt className="text-muted">{pricing.priceSheetLabel}</dt>
                  <dd>
                    <EnquireButton
                      intent="pricing"
                      interest={p.type}
                      title={`${pricing.priceSheetLabel || "Price Sheet"} – ${p.type}`}
                      className="btn-primary px-4 py-2 text-xs"
                    >
                      {pricing.ctaLabel}
                    </EnquireButton>
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        {pricing.note && <p className="mt-8 text-center text-xs text-muted">{pricing.note}</p>}
      </div>
    </section>
  );
}
