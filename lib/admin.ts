import "server-only";
import { redirect } from "next/navigation";
import type { SiteContent } from "./content/types";
import { normalizeContent, SITE_SLUG } from "./site";
import { createClient, supabaseConfigured } from "./supabase/server";

export type AdminContext =
  | { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; email: string; siteId: string; content: SiteContent }
  | { ok: false; reason: string; email?: string };

/** Resolves the logged-in admin and this deployment's site, enforcing access. */
export async function getAdmin(): Promise<AdminContext> {
  if (!supabaseConfigured) return { ok: false, reason: "Supabase environment variables are not set. See README." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: site } = await supabase.from("sites").select("id, content").eq("slug", SITE_SLUG).maybeSingle();
  if (!site) return { ok: false, email: user.email, reason: `No site found with slug "${SITE_SLUG}". Run supabase/schema.sql.` };

  const { data: membership } = await supabase
    .from("site_admins")
    .select("site_id")
    .eq("site_id", site.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership)
    return { ok: false, email: user.email, reason: `Your account is not an admin of "${SITE_SLUG}". Add it to the site_admins table.` };

  return {
    ok: true,
    supabase,
    email: user.email ?? "",
    siteId: site.id,
    content: normalizeContent(site.content),
  };
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin.ok) throw new Error(admin.reason);
  return admin;
}
