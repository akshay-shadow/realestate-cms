import type { SiteContent } from "@/lib/content/types";
import { LeadForm } from "../LeadForm";

export function Contact({ content }: { content: SiteContent }) {
  const { contact, brand } = content;
  return (
    <section id="contact" className="section">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="heading">{contact.title}</h2>
          {contact.subtitle && <p className="mt-4 max-w-lg text-muted">{contact.subtitle}</p>}
          <div className="mt-8 space-y-2">
            {brand.phone && (
              <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="block text-2xl font-semibold text-heading">
                {brand.phone}
              </a>
            )}
            {brand.email && <p className="text-muted">{brand.email}</p>}
            {brand.address && <p className="text-sm text-muted">{brand.address}</p>}
          </div>
        </div>
        <div className="mx-auto w-full max-w-md rounded-theme bg-surface-alt p-6 ring-1 ring-ink/10 md:p-8">
          <h3 className="mb-5 text-center text-xl font-semibold text-heading">{contact.formTitle}</h3>
          <LeadForm content={content} source="contact" allowMessage showBrochureLink />
        </div>
      </div>
    </section>
  );
}
