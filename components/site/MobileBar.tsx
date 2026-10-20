"use client";

import type { SiteContent } from "@/lib/content/types";
import { waLink } from "@/lib/utils";
import { useEnquiry } from "./EnquiryProvider";
import { WhatsAppIcon } from "./icons";

// Sticky mobile action bar: Call | Brochure | WhatsApp. Brand folders can replace it (Brand.MobileBar).
export function MobileBar({ content }: { content: SiteContent }) {
  const { whatsapp, brand, brochure } = content;
  const { open } = useEnquiry();
  const number = whatsapp.floatingNumber || whatsapp.redirectNumber;
  const chat = number ? waLink(number, whatsapp.floatingMessage) : "";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-ink/10 bg-secondary text-ink md:hidden">
      {brand.phone ? (
        <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium">
          <span aria-hidden="true">📞</span> Call
        </a>
      ) : (
        <button onClick={() => open()} className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium">
          <span aria-hidden="true">✉️</span> Enquire
        </button>
      )}
      <button
        onClick={() => open({ intent: brochure.enabled ? "brochure" : "general" })}
        className="flex flex-col items-center gap-0.5 bg-primary py-2.5 text-xs font-semibold text-primary-fg"
      >
        <span aria-hidden="true">📄</span> {brochure.enabled ? "Brochure" : "Enquire"}
      </button>
      {chat ? (
        <a href={chat} target="_blank" rel="noopener" className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium text-[#25D366]">
          <WhatsAppIcon size={16} /> WhatsApp
        </a>
      ) : (
        <button onClick={() => open()} className="py-2.5 text-xs font-medium">
          Enquire
        </button>
      )}
    </div>
  );
}
