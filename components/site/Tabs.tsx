"use client";

import { cn } from "@/lib/utils";

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  if (tabs.length < 2) return null;
  return (
    <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist">
      {tabs.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={t === active}
          onClick={() => onChange(t)}
          className={cn(
            "rounded-theme px-5 py-2 text-sm font-medium transition",
            t === active ? "bg-primary text-primary-fg" : "bg-surface-alt text-ink ring-1 ring-ink/10 hover:ring-primary",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/** Unique categories in first-seen order. */
export function categoriesOf<T extends { category?: string }>(items: T[], fallback: string) {
  return Array.from(new Set(items.map((i) => i.category?.trim() || fallback)));
}
