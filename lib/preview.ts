import "server-only";
import { cookies } from "next/headers";
import { viewerAccess } from "./admin";
import type { Site } from "./site";

export const PREVIEW_COOKIE = "site_preview";

/** Cookie value proving the visitor knew this site's current preview password. */
export async function previewToken(siteId: string, password: string) {
  const data = new TextEncoder().encode(`${siteId}:${password}:${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Public site, a visitor holding the preview password cookie, or an admin of this site. */
export async function canViewSite(site: Site): Promise<boolean> {
  if (site.content.visibility.isPublic) return true;
  const password = site.content.visibility.previewPassword;
  if (site.id && password) {
    const cookie = (await cookies()).get(PREVIEW_COOKIE)?.value;
    if (cookie && cookie === (await previewToken(site.id, password))) return true;
  }
  return (await viewerAccess(site.id)) === "admin";
}

/** Same-site path to return to, defaulting to the homepage. */
export function safeNext(next: unknown) {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
