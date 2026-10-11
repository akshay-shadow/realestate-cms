import { getAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdmin();
  if (!admin.ok) return new Response("Forbidden", { status: 403 });

  return new Response(JSON.stringify(admin.content, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${admin.slug}-content-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
