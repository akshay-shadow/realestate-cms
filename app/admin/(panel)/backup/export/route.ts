import { getAdmin } from "@/lib/admin";
import { SITE_SLUG } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdmin();
  if (!admin.ok) return new Response("Forbidden", { status: 403 });

  return new Response(JSON.stringify(admin.content, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${SITE_SLUG}-content-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
