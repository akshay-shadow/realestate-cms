import { EnquireButton } from "@/components/site/EnquireButton";
import type { SiteContent } from "@/lib/content/types";
import { SideIntro } from "./PlanPriceSwitch";

// Lodha Bellevue: text and Plans/Prices switch on the left; price table on the right.
export function Pricing({ content }: { content: SiteContent }) {
  const { pricing } = content;
  const breakup = pricing.ctaLabel || "Price Breakup";
  return (
    <section id="pricing" className="section">
      <div className="container-x grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
        <SideIntro title={pricing.title} subtitle={pricing.subtitle} description={pricing.description} active="prices" />

        <div className="min-w-0">
          {/* Mobile: one card per configuration. */}
          <ul className="space-y-3 sm:hidden">
            {pricing.items.map((p, i) => (
              <li key={`${p.type}-${i}`} className="border border-ink/10 bg-surface p-4">
                <p className="font-heading text-lg">{p.type}</p>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Size</dt>
                    <dd className="text-right">{p.area}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Price</dt>
                    <dd className="text-right font-semibold">{p.price}</dd>
                  </div>
                </dl>
                <EnquireButton
                  intent="pricing"
                  interest={p.type}
                  title={`${pricing.priceSheetLabel || "Price Breakup"} – ${p.type}`}
                  className="mt-3 w-full border border-primary px-3 py-2 text-sm text-primary transition hover:bg-primary hover:text-primary-fg"
                >
                  {breakup}
                </EnquireButton>
              </li>
            ))}
          </ul>

          {/* Tablet and desktop: table. */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary text-primary-fg">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Size</th>
                  <th className="px-4 py-2.5 font-medium">Price</th>
                  <th className="px-4 py-2.5">
                    <span className="sr-only">{breakup}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {pricing.items.map((p, i) => (
                  <tr key={`${p.type}-${i}`}>
                    <td className="px-4 py-3">{p.type}</td>
                    <td className="px-4 py-3 text-muted">{p.area}</td>
                    <td className="px-4 py-3">{p.price}</td>
                    <td className="px-4 py-3 text-right">
                      <EnquireButton
                        intent="pricing"
                        interest={p.type}
                        title={`${pricing.priceSheetLabel || "Price Breakup"} – ${p.type}`}
                        className="border border-primary px-3 py-1.5 text-xs text-primary transition hover:bg-primary hover:text-primary-fg"
                      >
                        {breakup}
                      </EnquireButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pricing.note && <p className="mt-4 text-xs text-muted">{pricing.note}</p>}
        </div>
      </div>
    </section>
  );
}
