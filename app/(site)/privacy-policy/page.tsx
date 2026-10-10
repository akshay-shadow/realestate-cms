import type { Metadata } from "next";
import { getSite } from "@/lib/site";
import { paragraphs } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getSite();
  return { title: content.privacy.title, alternates: { canonical: "/privacy-policy" } };
}

export default async function PrivacyPage() {
  const { content } = await getSite();
  return (
    <section className="container-x max-w-3xl pb-20 pt-32">
      <h1 className="heading mb-8">{content.privacy.title}</h1>
      <div className="space-y-4 leading-relaxed text-muted">
        {paragraphs(content.privacy.body).map((p, i) => (
          <p key={i} className="whitespace-pre-line">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
