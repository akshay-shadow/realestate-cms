import type { SiteContent } from "@/lib/content/types";
import { EnquireButton } from "../EnquireButton";
import { CheckIcon } from "../icons";
import { SectionHeading } from "./SectionHeading";

export function Highlights({ content }: { content: SiteContent }) {
  const { highlights } = content;
  return (
    <section id="highlights" className="section bg-surface-alt">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow={highlights.subtitle} title={highlights.title} center={false} />
          <ul className="space-y-4">
            {highlights.items.map((h, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <CheckIcon />
                </span>
                <span>
                  <span className="font-medium">{h.title}</span>
                  {h.description && <span className="mt-0.5 block text-sm text-muted">{h.description}</span>}
                </span>
              </li>
            ))}
          </ul>
          {highlights.ctaLabel && (
            <EnquireButton intent="brochure" className="btn-primary mt-8">
              {highlights.ctaLabel}
            </EnquireButton>
          )}
        </div>
        {highlights.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={highlights.image} alt={highlights.title} loading="lazy" className="aspect-[4/3] w-full rounded-theme object-cover" />
        )}
      </div>
    </section>
  );
}
