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

        <div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
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
