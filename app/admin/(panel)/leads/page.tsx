import Link from "next/link";
import { LeadRow } from "@/components/admin/LeadRow";
import { STATUS_LABELS } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/admin";

const PAGE_SIZE = 25;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q = "", status = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const { supabase, siteId } = await requireAdmin();

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" })
    .eq("site_id", siteId)
    .order("created_at", { ascending: false })
    .range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1);

  if (status) query = query.eq("status", status);
  if (q) {
    const term = q.replace(/[,()]/g, " ").trim();
    query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`);
  }

  const { data: leads, count, error } = await query;
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const qs = (p: number) => `?${new URLSearchParams({ q, status, page: String(p) })}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">
          Leads <span className="text-base font-normal text-slate-500">({count ?? 0})</span>
        </h1>
        <a href={`/admin/leads/export?${new URLSearchParams({ q, status })}`} className="admin-btn-ghost">
          ⬇ Export CSV
        </a>
      </div>

      <form className="flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search name, phone, email" className="admin-input max-w-xs" />
        <select name="status" defaultValue={status} className="admin-input w-auto">
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <button className="admin-btn">Filter</button>
        {(q || status) && (
          <Link href="/admin/leads" className="admin-btn-ghost">
            Clear
          </Link>
        )}
      </form>

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Interest / Message</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads?.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
            {!leads?.length && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 text-sm">
          {pageNum > 1 && (
            <Link href={qs(pageNum - 1)} className="admin-btn-ghost">
              ← Prev
            </Link>
          )}
          <span className="text-slate-500">
            Page {pageNum} of {totalPages}
          </span>
          {pageNum < totalPages && (
            <Link href={qs(pageNum + 1)} className="admin-btn-ghost">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
