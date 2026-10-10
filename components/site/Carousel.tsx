"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight scroll-snap carousel. `slideClass` sets slide width per
 * breakpoint via Tailwind classes; `autoplay` (ms) advances automatically.
 */
export function Carousel({
  children,
  slideClass = "w-full",
  autoplay,
  showCounter = true,
  className,
  gap = "gap-4",
  fill,
}: {
  children: React.ReactNode;
  slideClass?: string;
  autoplay?: number;
  showCounter?: boolean;
  className?: string;
  gap?: string;
  /** Absolutely fill the nearest positioned parent. */
  fill?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = Children.toArray(children);
  const count = slides.length;

  const go = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el || !count) return;
      const next = (i + count) % count;
      const child = el.children[next] as HTMLElement | undefined;
      if (child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
    },
    [count],
  );

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    let best = 0;
    let bestDist = Infinity;
    children.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setIndex(best);
  };

  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    const t = setInterval(() => {
      const el = track.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      go(atEnd ? 0 : index + 1);
    }, autoplay);
    return () => clearInterval(t);
  }, [autoplay, paused, index, count, go]);

  const arrow = "absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-xl text-white backdrop-blur transition hover:bg-primary hover:text-primary-fg";

  return (
    <div className={cn(fill ? "absolute inset-0" : "relative", className)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        ref={track}
        onScroll={onScroll}
        className={cn("flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", gap)}
      >
        {slides.map((s, i) => (
          <div key={i} className={cn("shrink-0 snap-start", slideClass)}>
            {s}
          </div>
        ))}
      </div>
      {count > 1 && (
        <>
          <button type="button" onClick={() => go(index - 1)} className={cn(arrow, "left-2")} aria-label="Previous">
            ‹
          </button>
          <button type="button" onClick={() => go(index + 1)} className={cn(arrow, "right-2")} aria-label="Next">
            ›
          </button>
          {showCounter && (
            <p className="absolute bottom-3 right-3 z-10 rounded-full bg-black/60 px-3 py-0.5 text-xs text-white">
              {index + 1}/{count}
            </p>
          )}
        </>
      )}
    </div>
  );
}
