import type { SiteContent } from "@/lib/content/types";

// Lodha Bellevue: image on the left, developer story on the right.
export function Developer({ content }: { content: SiteContent }) {
  const { developer } = content;
  return (
    <section id="developer" className="section">
      <div className="container-x grid max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-12">
        {developer.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={developer.image} alt={developer.title} loading="lazy" className="block h-auto w-full" />
        ) : (
          developer.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={developer.logo} alt={developer.name} loading="lazy" className="mx-auto h-20 w-auto object-contain" />
          )
        )}
        <div>
          <h2 className="whitespace-pre-line font-heading text-2xl text-heading md:text-3xl">{developer.title}</h2>
          {developer.description && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">{developer.description}</p>}
          {developer.readMoreUrl && (
            <a href={developer.readMoreUrl} target="_blank" rel="noopener" className="mt-4 inline-block text-sm text-primary hover:underline">
              Read more →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
