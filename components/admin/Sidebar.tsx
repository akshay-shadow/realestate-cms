"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { editorPages } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

interface Props {
  brandName: string;
  email: string;
  slug: string;
  signOut: () => Promise<void>;
}

export function Sidebar({ brandName, email, slug, signOut }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const link = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      onClick={() => setOpen(false)}
      className={cn(
        "block rounded-md px-3 py-1.5 text-sm",
        pathname === href ? "bg-indigo-50 font-semibold text-indigo-700" : "text-slate-600 hover:bg-slate-50",
      )}
    >
      {label}
    </Link>
  );

  const group = (name: "Settings" | "Page Sections") =>
    editorPages.filter((p) => p.group === name).map((p) => link(`/admin/content/${p.key}`, p.title));

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <span className="font-bold">{brandName}</span>
        <button className="admin-btn-ghost" onClick={() => setOpen(!open)}>
          Menu
        </button>
      </div>

      <aside
        className={cn(
          "w-full shrink-0 border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:overflow-y-auto",
          open ? "block" : "hidden",
        )}
      >
        <div className="hidden border-b border-slate-200 p-5 lg:block">
          <p className="truncate font-bold">{brandName}</p>
          <p className="text-xs text-slate-500">Site: {slug}</p>
        </div>
        <nav className="space-y-6 p-4">
          <div className="space-y-0.5">
            {link("/admin", "Dashboard")}
            {link("/admin/leads", "Leads")}
            {link("/admin/media", "Media Library")}
            {link("/admin/backup", "Import / Export")}
            <a href="/" target="_blank" className="block rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50">
              View website ↗
            </a>
          </div>
          <div>
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Settings</p>
            <div className="space-y-0.5">{group("Settings")}</div>
          </div>
          <div>
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Page Sections</p>
            <div className="space-y-0.5">{group("Page Sections")}</div>
          </div>
          <div className="border-t border-slate-200 pt-4">
            <p className="truncate px-3 text-xs text-slate-500">{email}</p>
            <form action={signOut}>
              <button className="mt-2 w-full rounded-md px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50">Sign out</button>
            </form>
          </div>
        </nav>
      </aside>
    </>
  );
}
