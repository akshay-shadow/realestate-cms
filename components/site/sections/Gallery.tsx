"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { Carousel } from "../Carousel";
import { EnquireButton } from "../EnquireButton";
import { SectionHeading } from "./SectionHeading";

export function Gallery({ content }: { content: SiteContent }) {
  const { gallery } = content;
  const images = gallery.images.filter((g) => g.image);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((a) => (a! + 1) % images.length);
      if (e.key === "ArrowLeft") setActive((a) => (a! - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, images.length]);

  return (
    <section id="gallery" className="section bg-surface-alt">
      <div className="container-x">
        <SectionHeading eyebrow={gallery.subtitle} title={gallery.title} />
        <Carousel slideClass="w-[85%] md:w-[calc(50%-8px)]" autoplay={4500}>
          {images.map((g, i) => (
            <button key={i} onClick={() => setActive(i)} className="group relative block w-full overflow-hidden rounded-theme">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.image}
                alt={g.caption || gallery.title}
                loading="lazy"
                className="block h-auto w-full transition duration-500 group-hover:scale-105"
              />
              {g.caption && (
                <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">{g.caption}</span>
              )}
            </button>
          ))}
        </Carousel>
        {gallery.ctaLabel && (
          <div className="mt-8 text-center">
            <EnquireButton intent="gallery" title={gallery.ctaLabel} className="btn-primary">
              {gallery.ctaLabel}
            </EnquireButton>
          </div>
        )}
      </div>

      {active !== null && images[active] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setActive(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[active].image} alt={images[active].caption} className="max-h-[85vh] max-w-full rounded-theme object-contain" />
          <button className="absolute right-4 top-4 text-4xl text-white" aria-label="Close">
            ×
          </button>
          {(["prev", "next"] as const).map((dir) => (
            <button
              key={dir}
              className={`absolute top-1/2 -translate-y-1/2 p-4 text-4xl text-white ${dir === "prev" ? "left-2" : "right-2"}`}
              aria-label={dir === "prev" ? "Previous" : "Next"}
              onClick={(e) => {
                e.stopPropagation();
                setActive((active + (dir === "prev" ? -1 : 1) + images.length) % images.length);
              }}
            >
              {dir === "prev" ? "‹" : "›"}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
