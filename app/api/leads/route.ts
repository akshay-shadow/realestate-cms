import { NextResponse } from "next/server";
import { getSite } from "@/lib/site";
import { createServiceClient, supabaseConfigured } from "@/lib/supabase/server";
import { fillTemplate, waLink } from "@/lib/utils";
import { sendLeadToWhatsApp } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const clean = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

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
    phone: clean(body.phone, 30),
    email: clean(body.email, 160),
    interest: clean(body.interest, 120),
    message: clean(body.message, 2000),
  };

  if (lead.name.length < 2) return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  if (lead.phone.replace(/\D/g, "").length < 8)
    return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
  if (lead.email && !/^\S+@\S+\.\S+$/.test(lead.email))
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });

  const site = await getSite();
  const { whatsapp, brand } = site.content;
  const text = fillTemplate(whatsapp.messageTemplate, { project: brand.name, ...lead });

  let whatsappStatus = "disabled";
  if (whatsapp.autoSend) {
    const numbers = whatsapp.notifyNumbers.split(",").map((n) => n.replace(/\D/g, "")).filter(Boolean);
    whatsappStatus = await sendLeadToWhatsApp(numbers, text, lead);
  }

  if (supabaseConfigured && site.id) {
    const { error } = await createServiceClient()
      .from("leads")
      .insert({
        site_id: site.id,
        ...lead,
        email: lead.email || null,
        source: clean(body.source, 40) || null,
        utm: typeof body.utm === "object" && body.utm ? body.utm : null,
        page_url: clean(body.pageUrl, 500) || null,
        user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
        whatsapp_status: whatsappStatus,
      });

    if (error) {
      console.error("Lead insert failed:", error.message);
      return NextResponse.json({ error: "Could not submit right now. Please call us." }, { status: 500 });
    }
  } else {
    console.warn("Supabase not configured - lead not stored:", lead);
  }

  return NextResponse.json({
    ok: true,
    whatsappUrl: whatsapp.redirectAfterSubmit && whatsapp.redirectNumber ? waLink(whatsapp.redirectNumber, text) : null,
  });
}
