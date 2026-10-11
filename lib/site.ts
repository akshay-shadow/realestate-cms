import { headers } from "next/headers";
import { cache } from "react";
import { defaultContent } from "./content/defaults";
import type { SiteContent } from "./content/types";
import { createPublicClient, supabaseConfigured } from "./supabase/server";

/** Site shown when the request's domain isn't listed in any site's `domains` (localhost, *.workers.dev). */
export const DEFAULT_SITE_SLUG = process.env.DEFAULT_SITE_SLUG || process.env.NEXT_PUBLIC_SITE_SLUG || "demo";

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
  /** Origin the site is being served on, e.g. https://skyline.com */
  url: string;
  /** False when no site lists this domain and the DEFAULT_SITE_SLUG fallback was used. */
  onOwnDomain: boolean;
  content: SiteContent;
}

/** The request's host and origin. `host` is null when the Host header looks malformed. */
const getRequestHost = cache(async (): Promise<{ host: string | null; url: string }> => {
  const h = await headers();
  const raw = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0].trim().toLowerCase();
  if (!/^[a-z0-9.-]+(:\d+)?$/.test(raw)) return { host: null, url: "http://localhost:3000" };

  const host = raw.replace(/:\d+$/, "");
  const local = host === "localhost" || host === "127.0.0.1";
  const proto = h.get("x-forwarded-proto")?.split(",")[0].trim() === "http" || local ? "http" : "https";
  return { host, url: `${proto}://${raw}` };
});

/** Loads the site for the requested domain, falling back to DEFAULT_SITE_SLUG, then to demo defaults. */
export const getSite = cache(async (): Promise<Site> => {
  const { host, url } = await getRequestHost();
  if (!supabaseConfigured) return { id: null, slug: DEFAULT_SITE_SLUG, url, onOwnDomain: false, content: defaultContent };

  const db = createPublicClient();
  let data: { id: string; slug: string; content: unknown } | null = null;

  if (host) {
    const res = await db.from("sites").select("id, slug, content").contains("domains", [host]).limit(1).maybeSingle();
    if (res.error) console.error("Failed to look up site by domain:", res.error.message);
    data = res.data;
  }
  const onOwnDomain = Boolean(data);
  if (!data) {
    const res = await db.from("sites").select("id, slug, content").eq("slug", DEFAULT_SITE_SLUG).maybeSingle();
    if (res.error) console.error("Failed to load site content:", res.error.message);
    data = res.data;
  }

  return {
    id: data?.id ?? null,
    slug: data?.slug ?? DEFAULT_SITE_SLUG,
    url,
    onOwnDomain,
    content: normalizeContent(data?.content),
  };
});
