"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { waLink } from "@/lib/utils";
import { useEnquiry } from "./EnquiryProvider";
import { WhatsAppIcon } from "./icons";

export function Header({ content }: { content: SiteContent }) {
  const { brand, nav, whatsapp } = content;
  const { open } = useEnquiry();
  const [menu, setMenu] = useState(false);
  const isHome = usePathname() === "/";

  // "#brochure" and "#enquire" are special links that open the enquiry form.
  const onNav = (e: React.MouseEvent, href: string) => {
    setMenu(false);
    if (href === "#brochure" || href === "#enquire") {
      e.preventDefault();
      open({ intent: href === "#brochure" ? "brochure" : "general" });
    }
  };
  const href = (h: string) => (!isHome && h.startsWith("#") && h !== "#brochure" && h !== "#enquire" ? `/${h}` : h);
  const waNumber = whatsapp.floatingNumber || whatsapp.redirectNumber;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-secondary/95 text-ink backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <a href={isHome ? "#hero" : "/"} className="flex shrink-0 items-center gap-2">
          {brand.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logo} alt={brand.name} className="h-9 w-auto md:h-10" />
          ) : (
            <span className="font-heading text-lg font-semibold md:text-xl">{brand.name}</span>
          )}
        </a>

        <nav className="hidden items-center gap-5 text-[13px] font-medium xl:flex">
          {nav.links.map((l) => (
            <a key={l.href + l.label} href={href(l.href)} onClick={(e) => onNav(e, l.href)} className="text-ink/85 hover:text-primary">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {brand.phone && (
            <a
              href={`tel:${brand.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-2 rounded-theme border border-ink/20 px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary sm:inline-flex"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
              </svg>
              Contact
            </a>
          )}
          {waNumber && (
            <a
              href={waLink(waNumber, whatsapp.floatingMessage)}
              target="_blank"
              rel="noopener"
              className="hidden items-center gap-2 rounded-theme bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 md:inline-flex"
            >
              <WhatsAppIcon size={16} /> WhatsApp
            </a>
          )}
          <button className="p-2 xl:hidden" onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {menu ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menu && (
        <nav className="container-x flex flex-col border-t border-ink/10 pb-4 xl:hidden">
          {nav.links.map((l) => (
            <a key={l.href + l.label} href={href(l.href)} onClick={(e) => onNav(e, l.href)} className="border-b border-ink/5 py-3 text-sm font-medium">
              {l.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMenu(false);
              open();
            }}
            className="btn-primary mt-3"
          >
            {nav.ctaLabel}
          </button>
        </nav>
      )}
    </header>
  );
}
