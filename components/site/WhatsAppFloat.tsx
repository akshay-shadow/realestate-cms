"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { waLink } from "@/lib/utils";
import { useEnquiry } from "./EnquiryProvider";
import { WhatsAppIcon } from "./icons";

export function WhatsAppFloat({ content }: { content: SiteContent }) {
  const { whatsapp, brand, brochure } = content;
  const { open } = useEnquiry();
  const [bubble, setBubble] = useState(false);
  const number = whatsapp.floatingNumber || whatsapp.redirectNumber;
  const chat = number ? waLink(number, whatsapp.floatingMessage) : "";

  useEffect(() => {
    if (!whatsapp.chatBubble || sessionStorage.getItem("chat_bubble_closed")) return;
    const t = setTimeout(() => setBubble(true), 4000);
    return () => clearTimeout(t);
  }, [whatsapp.chatBubble]);

  const closeBubble = () => {
    sessionStorage.setItem("chat_bubble_closed", "1");
    setBubble(false);
  };

  return (
    <>
      {whatsapp.floatingButton && chat && (
        <div className="fixed bottom-20 left-4 z-40 flex flex-col items-start gap-3 md:bottom-6">
          {bubble && (
            <div className="relative w-56 rounded-xl bg-white p-4 text-center text-gray-900 shadow-2xl">
              <button onClick={closeBubble} className="absolute right-2 top-1 text-lg text-gray-400 hover:text-gray-700" aria-label="Close">
                ×
              </button>
              <p className="font-semibold">Hey, I&apos;m {whatsapp.chatName}!</p>
              <p className="mt-0.5 text-xs text-gray-500">{whatsapp.chatGreeting}</p>
              <a href={chat} target="_blank" rel="noopener" className="mt-3 block rounded-lg bg-[#128C4B] py-2 text-sm font-semibold text-white">
                Let&apos;s Chat
              </a>
            </div>
          )}
          <a
            href={chat}
            target="_blank"
            rel="noopener"
            aria-label="Chat on WhatsApp"
            className="flex items-center gap-2 rounded-full bg-[#128C4B] py-1.5 pl-1.5 pr-4 text-white shadow-lg transition hover:brightness-110"
          >
            {whatsapp.chatPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={whatsapp.chatPhoto} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
                <WhatsAppIcon size={22} />
              </span>
            )}
            <span className="text-left leading-tight">
              <span className="block text-xs font-semibold">Chat with us</span>
              <span className="block text-[10px] opacity-80">Expert help in minutes</span>
            </span>
          </a>
        </div>
      )}

      {/* Sticky mobile action bar: Call | Brochure | WhatsApp */}
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
    </>
  );
}
