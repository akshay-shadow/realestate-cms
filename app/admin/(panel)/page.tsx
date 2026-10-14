import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { whatsappApiConfigured } from "@/lib/whatsapp";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function DashboardPage() {
  const { supabase, siteId, slug, onOwnDomain, content } = await requireAdmin();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 864e5).toISOString();

  const count = (build: (q: any) => any) =>
    build(supabase.from("leads").select("id", { count: "exact", head: true }).eq("site_id", siteId)).then(
      (r: { count: number | null }) => r.count ?? 0,
    );

  const [total, today, week, fresh, recent] = await Promise.all([
    count((q) => q),
    count((q) => q.gte("created_at", startOfDay)),
    count((q) => q.gte("created_at", weekAgo)),
    count((q) => q.eq("status", "new")),
    supabase
      .from("leads")
      .select("id, name, phone, interest, status, created_at")
      .eq("site_id", siteId)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const checks = [
    {
      ok: content.visibility.isPublic,
      label: content.visibility.isPublic
        ? "Website is live"
        : "Website is private (admins only). Turn it on in Settings → Visibility when ready",
    },
    { ok: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY), label: "Service role key set (required to save leads)" },
    {
      ok: !content.whatsapp.autoSend || whatsappApiConfigured,
      label: content.whatsapp.autoSend
        ? "WhatsApp Cloud API credentials set"
        : "WhatsApp auto-send is off (enable in Settings → WhatsApp)",
    },
    {
      ok: onOwnDomain,
      label: onOwnDomain
        ? "This domain is linked to the site"
        : `This domain isn't in the "${slug}" site's domains list (showing the default site)`,
    },
    { ok: Boolean(content.brochure.file) || !content.brochure.enabled, label: "Brochure file uploaded" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Total leads", total],
          ["Today", today],
          ["Last 7 days", week],
          ["New / uncontacted", fresh],
        ].map(([label, value]) => (
          <div key={label as string} className="admin-card">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-bold">{value as number}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="admin-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent leads</h2>
            <Link href="/admin/leads" className="text-sm text-indigo-600 hover:underline">
              View all →
            </Link>
          </div>
          {recent.data?.length ? (
            <ul className="divide-y divide-slate-100">
              {recent.data.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{l.name}</p>
                    <p className="text-slate-500">
                      {l.phone} {l.interest && `· ${l.interest}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={l.status} />
                    <p className="mt-1 text-xs text-slate-400">{new Date(l.created_at).toLocaleString("en-IN")}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No leads yet. Submit the form on your website to test.</p>
          )}
        </div>

        <div className="admin-card">
          <h2 className="mb-4 font-semibold">Setup checklist</h2>
          <ul className="space-y-3 text-sm">
            {checks.map((c) => (
              <li key={c.label} className="flex gap-2">
                <span className={c.ok ? "text-green-600" : "text-amber-500"}>{c.ok ? "✓" : "!"}</span>
                <span className="text-slate-700">{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
