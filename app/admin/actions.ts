"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { defaultContent } from "@/lib/content/defaults";
import { getEditorPage } from "@/lib/content/schema";
import { createClient } from "@/lib/supabase/server";

const LEAD_STATUSES = ["new", "contacted", "site_visit", "converted", "lost"];

export async function saveSection(key: string, value: unknown) {
  if (!getEditorPage(key)) return { error: "Unknown section" };
  if (typeof value !== "object" || value === null || Array.isArray(value)) return { error: "Invalid data" };

  const { supabase, siteId } = await requireAdmin();
  const { data: site, error: readError } = await supabase.from("sites").select("content").eq("id", siteId).single();
  if (readError) return { error: readError.message };

  const content = { ...(site.content ?? {}), [key]: value };
  const { error } = await supabase.from("sites").update({ content }).eq("id", siteId);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function resetSection(key: string) {
  if (!getEditorPage(key)) return { error: "Unknown section" };
  return saveSection(key, defaultContent[key as keyof typeof defaultContent]);
}

/** Replace the whole content document (used by JSON import). */
export async function importContent(json: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { error: "File is not valid JSON" };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return { error: "Invalid content file" };

  const { supabase, siteId } = await requireAdmin();
  const { error } = await supabase.from("sites").update({ content: parsed }).eq("id", siteId);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateLead(id: string, patch: { status?: string; notes?: string }) {
  const update: Record<string, string> = {};
  if (patch.status !== undefined) {
    if (!LEAD_STATUSES.includes(patch.status)) return { error: "Invalid status" };
    update.status = patch.status;
  }
  if (patch.notes !== undefined) update.notes = patch.notes.slice(0, 2000);

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("leads").update(update).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteLead(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
