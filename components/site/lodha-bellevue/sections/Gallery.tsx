import { EnquireButton } from "@/components/site/EnquireButton";
import type { SiteContent } from "@/lib/content/types";

// Lodha Bellevue: centred title with the subtitle below, images edge to edge.
export function Gallery({ content }: { content: SiteContent }) {
  const { gallery } = content;
  const images = gallery.images.filter((g) => g.image);
  return (
    <section id="gallery" className="section">
      <div className="container-x mb-8 text-center">
        <h2 className="font-heading text-2xl text-primary md:text-3xl">{gallery.title}</h2>
        {gallery.subtitle && <p className="mt-1 text-sm text-muted">{gallery.subtitle}</p>}
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {images.map((g, i) => (
          <a key={i} href={g.image} target="_blank" rel="noopener" className="group relative block aspect-[4/3] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.image}
              alt={g.caption || gallery.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {g.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8 text-sm text-white">
                {g.caption}
              </span>
            )}
          </a>
        ))}
      </div>
      {gallery.ctaLabel && (
        <div className="mt-8 text-center">
          <EnquireButton intent="gallery" title={gallery.ctaLabel} className="btn-primary">
            {gallery.ctaLabel}
          </EnquireButton>
        </div>
      )}
    </section>
  );
}
