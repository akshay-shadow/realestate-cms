import type { SiteContent } from "@/lib/content/types";
import { SectionHeading } from "./SectionHeading";

export function Faq({ content }: { content: SiteContent }) {
  const { faq } = content;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section id="faq" className="section bg-surface-alt">
      <div className="container-x max-w-3xl">
        <SectionHeading title={faq.title} />
        <div className="space-y-3">
          {faq.items.map((f, i) => (
            <details key={i} className="group rounded-theme bg-surface p-5 shadow-sm ring-1 ring-ink/10" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.question}
                <span className="text-xl text-primary transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </section>
  );
}
