import "server-only";
import { redirect } from "next/navigation";
import type { SiteContent } from "./content/types";
import { getSite } from "./site";
import { createClient, supabaseConfigured } from "./supabase/server";

export type AdminContext =
  | {
      ok: true;
      supabase: Awaited<ReturnType<typeof createClient>>;
      email: string;
      siteId: string;
      slug: string;
      onOwnDomain: boolean;
      content: SiteContent;
    }
  | { ok: false; reason: string; email?: string };

/** Resolves the logged-in admin and the site for the requested domain, enforcing access. */
export async function getAdmin(): Promise<AdminContext> {
  if (!supabaseConfigured) return { ok: false, reason: "Supabase environment variables are not set. See README." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const site = await getSite();
  if (!site.id)
    return { ok: false, email: user.email, reason: `No site found for this domain or with slug "${site.slug}". Run supabase/schema.sql.` };

  const { data: membership } = await supabase
    .from("site_admins")
    .select("site_id")
    .eq("site_id", site.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership)
    return { ok: false, email: user.email, reason: `Your account is not an admin of "${site.slug}". Add it to the site_admins table.` };

  return {
    ok: true,
    supabase,
    email: user.email ?? "",
    siteId: site.id,
    slug: site.slug,
    onOwnDomain: site.onOwnDomain,
    content: site.content,
  };
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin.ok) throw new Error(admin.reason);
  return admin;
}
