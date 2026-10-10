import { getAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

const COLUMNS = ["created_at", "name", "phone", "email", "interest", "message", "source", "status", "notes", "page_url"];

function csvCell(v: unknown) {
  let s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
  // Prevent spreadsheet formula injection.
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  const admin = await getAdmin();
  if (!admin.ok) return new Response("Forbidden", { status: 403 });

  const params = new URL(req.url).searchParams;
  let query = admin.supabase
    .from("leads")
    .select([...COLUMNS, "utm"].join(","))
    .eq("site_id", admin.siteId)
    .order("created_at", { ascending: false })
    .limit(10000);

  const status = params.get("status");
  const q = params.get("q")?.replace(/[,()]/g, " ").trim();
  if (status) query = query.eq("status", status);
  if (q) query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return new Response(error.message, { status: 500 });

  const rows = (data as unknown as Record<string, unknown>[]).map((r) =>
    [...COLUMNS, "utm"].map((c) => csvCell(r[c])).join(","),
  );
  const csv = "﻿" + [[...COLUMNS, "utm"].join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
