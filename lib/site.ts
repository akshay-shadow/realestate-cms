import { cache } from "react";
import { defaultContent } from "./content/defaults";
import type { SiteContent } from "./content/types";
import { createPublicClient, supabaseConfigured } from "./supabase/server";

export const SITE_SLUG = process.env.NEXT_PUBLIC_SITE_SLUG || "demo";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

type Plain = Record<string, unknown>;
const isPlain = (v: unknown): v is Plain => typeof v === "object" && v !== null && !Array.isArray(v);

/** Objects merge recursively; arrays and scalars from `override` replace the base. */
export function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlain(base) || !isPlain(override)) return (override === undefined ? base : override) as T;
  const out: Plain = { ...base };
  for (const [k, v] of Object.entries(override)) {
    out[k] = k in base ? deepMerge((base as Plain)[k], v) : v;
  }
  return out as T;
}

/** Merges saved content over defaults and appends sections added in newer versions (hidden). */
export function normalizeContent(saved: unknown): SiteContent {
  const content = deepMerge(defaultContent, saved ?? {});
  const present = new Set(content.layout.sections.map((s) => s.key));
  const missing = defaultContent.layout.sections.filter((s) => !present.has(s.key)).map((s) => ({ ...s, enabled: false }));
  if (missing.length) content.layout = { ...content.layout, sections: [...content.layout.sections, ...missing] };
  return content;
}

export interface Site {
  id: string | null;
  slug: string;
  content: SiteContent;
}

/** Loads this deployment's site content, falling back to demo defaults. */
export const getSite = cache(async (): Promise<Site> => {
  if (!supabaseConfigured) return { id: null, slug: SITE_SLUG, content: defaultContent };

  const { data, error } = await createPublicClient()
    .from("sites")
    .select("id, slug, content")
    .eq("slug", SITE_SLUG)
    .maybeSingle();

  if (error) console.error("Failed to load site content:", error.message);
  return {
    id: data?.id ?? null,
    slug: SITE_SLUG,
    content: normalizeContent(data?.content),
  };
});
