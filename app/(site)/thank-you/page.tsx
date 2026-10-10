import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/lib/site";

export const metadata: Metadata = { title: "Thank You", robots: { index: false } };

export default async function ThankYouPage() {
  const { content } = await getSite();
  const { form, brochure, brand } = content;
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-center justify-center pt-24 text-center">
      <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary text-4xl text-primary-fg">✓</div>
      <h1 className="heading">{form.successTitle}</h1>
      <p className="mt-4 max-w-md text-muted">{form.successMessage}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {brochure.enabled && brochure.file && (
          <a href={brochure.file} target="_blank" rel="noopener" className="btn-primary">
            {brochure.label}
          </a>
        )}
        {brand.phone && (
          <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="btn border border-ink/20">
            Call {brand.phone}
          </a>
        )}
        <Link href="/" className="btn border border-ink/20">
          Back to home
        </Link>
      </div>
    </section>
  );
}
