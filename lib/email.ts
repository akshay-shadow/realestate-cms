// Server-side enquiry emails through the Resend API (https://resend.com/docs/api-reference/emails/send-email).
// Plain fetch, so it runs on Cloudflare Workers where SMTP isn't available.

import type { LeadMessage } from "./whatsapp";

export const emailApiConfigured = Boolean(process.env.RESEND_API_KEY);

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

interface LeadEmail extends LeadMessage {
  project: string;
}

export async function sendLeadEmail(to: string[], lead: LeadEmail) {
  if (!emailApiConfigured) return "skipped: api not configured";
  if (!to.length) return "skipped: no recipients";

  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    [
      "Date & time",
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " IST",
    ],
  ];
  const filled = rows.filter(([, v]) => v);

  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
<h2 style="margin:0 0 12px">New enquiry for ${esc(lead.project)}</h2>
<table cellpadding="10" cellspacing="0" style="border-collapse:collapse;border:1px solid #d0d5dd;min-width:360px">
${filled
  .map(
    ([k, v]) =>
      `<tr><td style="border:1px solid #d0d5dd;background:#f2f4f7;font-weight:bold;vertical-align:top;white-space:nowrap">${k}</td><td style="border:1px solid #d0d5dd;white-space:pre-wrap">${esc(v)}</td></tr>`,
  )
  .join("\n")}
</table></div>`;
  const text = [`New enquiry for ${lead.project}`, "", ...filled.map(([k, v]) => `${k}: ${v}`)].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Website Leads <onboarding@resend.dev>",
        to,
        subject: `New enquiry: ${lead.name} - ${lead.project}`,
        html,
        text,
        ...(lead.email ? { reply_to: lead.email } : {}),
      }),
    });
    if (res.ok) return "sent";
    const err = await res.json().catch(() => ({}));
    return `failed (${err?.message ?? res.status})`;
  } catch (e) {
    return `failed (${(e as Error).message})`;
  }
}
