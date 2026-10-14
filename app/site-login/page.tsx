import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { canViewSite, safeNext } from "@/lib/preview";
import { getSite } from "@/lib/site";
import { PasswordForm } from "./PasswordForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

export default async function SiteLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next);
  const site = await getSite();
  if (await canViewSite(site)) redirect(next);

  const { brand, visibility } = site.content;
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-lg">
        {brand.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brand.logo} alt={brand.name} className="mx-auto mb-4 h-12 w-auto" />
        ) : (
          <p className="mb-2 text-xl font-bold text-slate-900">{brand.name}</p>
        )}
        <h1 className="text-lg font-semibold text-slate-900">This website is in preview</h1>
        {visibility.previewPassword ? (
          <>
            <p className="mt-1 text-sm text-slate-500">Enter the password to view it.</p>
            <div className="text-left">
              <PasswordForm next={next} />
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-500">It will be available soon.</p>
        )}
        <a href="/admin/login" className="mt-6 inline-block text-xs text-slate-400 hover:text-slate-600">
          Admin login
        </a>
      </div>
    </div>
  );
}
