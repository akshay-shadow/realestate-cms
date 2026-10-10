import type { SiteContent } from "@/lib/content/types";
import { paragraphs } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

export function Developer({ content }: { content: SiteContent }) {
  const { developer, brand } = content;
  return (
    <section id="developer" className="section bg-surface-alt">
      <div className="container-x grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto]">
        <div>
          <SectionHeading title={developer.title} center={false} />
          {developer.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={developer.logo} alt={developer.name} loading="lazy" className="mb-6 h-14 w-auto" />
          )}
          <div className="space-y-4 leading-relaxed text-muted">
            {paragraphs(developer.description).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {developer.readMoreUrl && (
            <a href={developer.readMoreUrl} target="_blank" rel="noopener" className="btn-primary-outline mt-6">
              Read More
            </a>
          )}
          {developer.stats.length > 0 && (
            <dl className="mt-8 grid grid-cols-3 gap-4">
              {developer.stats.map((s) => (
                <div key={s.label} className="card p-4 text-center">
                  <dt className="text-2xl font-semibold text-heading">{s.value}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {brand.reraQr && (
          <div className="mx-auto text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.reraQr} alt="RERA QR code" loading="lazy" className="h-40 w-40 rounded-theme bg-white p-2" />
            {brand.rera && <p className="mt-2 text-xs text-muted">RERA: {brand.rera}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
