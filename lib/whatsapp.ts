// Server-side WhatsApp alerts through the official WhatsApp Cloud API.
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/messages

const GRAPH_VERSION = "v21.0";

export interface LeadMessage {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
}

export const whatsappApiConfigured = Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

/**
 * Sends the enquiry to each number. Uses an approved template when
 * WHATSAPP_TEMPLATE_NAME is set (required to reach numbers that haven't
 * messaged your business in the last 24h), otherwise a plain text message.
 */
export async function sendLeadToWhatsApp(numbers: string[], text: string, lead: LeadMessage) {
  if (!whatsappApiConfigured) return "skipped: api not configured";
  if (!numbers.length) return "skipped: no numbers";

  const template = process.env.WHATSAPP_TEMPLATE_NAME;
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const results = await Promise.all(
    numbers.map(async (to) => {
      const body = template
        ? {
            messaging_product: "whatsapp",
            to,
            type: "template",
            template: {
              name: template,
              language: { code: process.env.WHATSAPP_TEMPLATE_LANG || "en" },
              components: [
                {
                  type: "body",
                  parameters: [lead.name, lead.phone, lead.email, lead.interest, lead.message].map((v) => ({
                    type: "text",
                    text: v || "-",
                  })),
                },
              ],
            },
          }
        : { messaging_product: "whatsapp", to, type: "text", text: { body: text } };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (res.ok) return `${to}: sent`;
        const err = await res.json().catch(() => ({}));
        return `${to}: failed (${err?.error?.message ?? res.status})`;
      } catch (e) {
        return `${to}: failed (${(e as Error).message})`;
      }
    }),
  );

  return results.join("; ");
}
