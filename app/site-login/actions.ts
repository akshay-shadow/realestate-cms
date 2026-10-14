"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PREVIEW_COOKIE, previewToken, safeNext } from "@/lib/preview";
import { getSite } from "@/lib/site";

export async function unlockSite(_prev: { error?: string } | undefined, formData: FormData) {
  const site = await getSite();
  const password = site.content.visibility.previewPassword;
  if (!site.id || !password || String(formData.get("password") ?? "") !== password) {
    return { error: "Incorrect password" };
  }

  (await cookies()).set(PREVIEW_COOKIE, await previewToken(site.id, password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(safeNext(formData.get("next")));
}
