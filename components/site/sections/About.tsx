import type { SiteContent } from "@/lib/content/types";
import { cn, paragraphs } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

export function About({ content }: { content: SiteContent }) {
  const { about } = content;
  const hasImage = Boolean(about.image);

  return (
    <section id="about" className="section">
      <div className={cn("container-x", hasImage ? "grid items-center gap-12 lg:grid-cols-2" : "max-w-5xl text-center")}>
        <div>
          <SectionHeading eyebrow={about.subtitle} title={about.title} center={!hasImage} />
          <div className="space-y-4 leading-relaxed text-muted">
            {paragraphs(about.body).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {about.stats.length > 0 && (
            <dl className={cn("mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4", !hasImage && "mx-auto max-w-3xl")}>
              {about.stats.map((s) => (
                <div key={s.label} className="card p-4 text-center">
                  <dt className="text-2xl font-semibold text-heading">{s.value}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {hasImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={about.image} alt={about.title} loading="lazy" className="block h-auto w-full rounded-theme" />
        )}
      </div>
    </section>
  );
}
