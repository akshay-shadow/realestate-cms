"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { useEnquiry } from "../EnquiryProvider";
import { SectionHeading } from "./SectionHeading";

/** Turns YouTube watch/short links into embeddable URLs; other URLs pass through. */
function toEmbed(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0` : url;
}

export function VirtualTour({ content }: { content: SiteContent }) {
  const { virtualTour } = content;
  const { submitted, open } = useEnquiry();
  const [playing, setPlaying] = useState(false);
  const canPlay = Boolean(virtualTour.videoUrl) && submitted;

  const onClick = () => (canPlay ? setPlaying(true) : open({ intent: "tour", title: virtualTour.ctaLabel }));

  return (
    <section id="virtualTour" className="section bg-surface-alt">
      <div className="container-x max-w-5xl">
        <SectionHeading title={virtualTour.title} subtitle={virtualTour.subtitle} />
        <div className={`relative overflow-hidden rounded-theme bg-secondary ring-1 ring-ink/10 ${playing || !virtualTour.image ? "aspect-video" : ""}`}>
          {playing ? (
            <iframe
              src={toEmbed(virtualTour.videoUrl)}
              title={virtualTour.title}
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button onClick={onClick} className={`group block w-full ${virtualTour.image ? "relative" : "absolute inset-0"}`}>
              {virtualTour.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={virtualTour.image} alt={virtualTour.title} loading="lazy" className="block h-auto w-full opacity-80" />
              )}
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/35">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-3xl text-primary-fg shadow-xl transition group-hover:scale-110">
                  ▶
                </span>
                <span className="btn-primary">{canPlay ? "Play Tour" : virtualTour.ctaLabel}</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
