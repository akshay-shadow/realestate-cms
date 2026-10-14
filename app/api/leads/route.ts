import { NextResponse } from "next/server";
import { viewerAccess } from "@/lib/admin";
import { sendLeadEmail } from "@/lib/email";
import { getSite } from "@/lib/site";
import { createServiceClient, supabaseConfigured } from "@/lib/supabase/server";
import { fillTemplate, waLink } from "@/lib/utils";
import { sendLeadToWhatsApp } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const clean = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** "+91 98745-63210" -> "+91 9874563210", so the same number always matches. */
function normalizePhone(phone: string) {
  const m = phone.match(/^(\+\d{1,4})\s*(.*)$/);
  return m ? `${m[1]} ${m[2].replace(/\D/g, "")}` : phone.replace(/\D/g, "");
}

/** Escapes LIKE wildcards so an email is matched literally (case-insensitively). */
const likeLiteral = (s: string) => s.replace(/[\\%_]/g, "\\$&");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields, humans don't.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const lead = {
    name: clean(body.name, 120),
    phone: normalizePhone(clean(body.phone, 30)),
    email: clean(body.email, 160).toLowerCase(),
    interest: clean(body.interest, 120),
    message: clean(body.message, 2000),
  };

  if (lead.name.length < 2) return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  if (lead.phone.replace(/\D/g, "").length < 8)
    return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
  if (lead.email && !/^\S+@\S+\.\S+$/.test(lead.email))
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });

  const site = await getSite();
  const { whatsapp, emailAlerts, brand } = site.content;

  // A private site only takes test enquiries from its own admins.
  if (!site.content.visibility.isPublic && (await viewerAccess(site.id)) !== "admin")
    return NextResponse.json({ error: "This website isn't public yet." }, { status: 403 });

  // One enquiry per mobile number / email per site.
  if (supabaseConfigured && site.id) {
    const db = createServiceClient();
    const exists = (q: PromiseLike<{ count: number | null }>) => Promise.resolve(q).then((r) => (r.count ?? 0) > 0);
    const base = () => db.from("leads").select("id", { count: "exact", head: true }).eq("site_id", site.id!);
    const [phoneTaken, emailTaken] = await Promise.all([
      exists(base().eq("phone", lead.phone)),
      lead.email ? exists(base().ilike("email", likeLiteral(lead.email))) : false,
    ]);
    if (phoneTaken || emailTaken)
      return NextResponse.json(
        {
          error: `You've already enquired with this ${phoneTaken ? "mobile number" : "email"}. Our team will contact you shortly.`,
        },
        { status: 409 },
      );
  }

  const text = fillTemplate(whatsapp.messageTemplate, { project: brand.name, ...lead });

  let whatsappStatus = "disabled";
  if (whatsapp.autoSend) {
    const numbers = whatsapp.notifyNumbers.split(",").map((n) => n.replace(/\D/g, "")).filter(Boolean);
    whatsappStatus = await sendLeadToWhatsApp(numbers, text, lead);
  }

  const source = clean(body.source, 40);
  const pageUrl = clean(body.pageUrl, 500);
  let leadId: string | null = null;

  if (supabaseConfigured && site.id) {
    const { data, error } = await createServiceClient()
      .from("leads")
      .insert({
        site_id: site.id,
        ...lead,
        email: lead.email || null,
        source: source || null,
        utm: typeof body.utm === "object" && body.utm ? body.utm : null,
        page_url: pageUrl || null,
        user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
        whatsapp_status: whatsappStatus,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Lead insert failed:", error.message);
      return NextResponse.json({ error: "Could not submit right now. Please call us." }, { status: 500 });
    }
    leadId = data.id;
  } else {
    console.warn("Supabase not configured - lead not stored:", lead);
  }

  // Sent after the lead is saved, so an email problem never loses a lead.
  if (emailAlerts.enabled) {
    const to = emailAlerts.notifyEmails.split(",").map((e) => e.trim()).filter((e) => /^\S+@\S+\.\S+$/.test(e));
    const emailStatus = await sendLeadEmail(to, { ...lead, project: brand.name });
    if (emailStatus !== "sent") console.warn("Lead email:", emailStatus);
    if (leadId) {
      const { error } = await createServiceClient().from("leads").update({ email_status: emailStatus }).eq("id", leadId);
      if (error) console.warn("Could not store email status:", error.message);
    }
  }

  return NextResponse.json({
    ok: true,
    whatsappUrl: whatsapp.redirectAfterSubmit && whatsapp.redirectNumber ? waLink(whatsapp.redirectNumber, text) : null,
  });
}
