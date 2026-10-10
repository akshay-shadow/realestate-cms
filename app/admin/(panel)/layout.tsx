import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/Sidebar";
import { getAdmin } from "@/lib/admin";
import { SITE_SLUG } from "@/lib/site";
import { signOut } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();

  if (!admin.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="admin-card max-w-md text-center">
          <h1 className="text-lg font-bold text-slate-900">Access not available</h1>
          <p className="mt-2 text-sm text-slate-600">{admin.reason}</p>
          {admin.email && (
            <form action={signOut} className="mt-5">
              <button className="admin-btn-ghost">Sign out ({admin.email})</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <Sidebar brandName={admin.content.brand.name} email={admin.email} slug={SITE_SLUG} signOut={signOut} />
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
