"use client";

import { useEnquiry } from "@/components/site/EnquiryProvider";
import type { SiteContent } from "@/lib/content/types";

// Mahindra Vista: two-part mobile bar, phone number | Book Site Visit.
export function MobileBar({ content }: { content: SiteContent }) {
  const { brand } = content;
  const { open } = useEnquiry();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-ink/10 bg-secondary text-ink md:hidden">
      {brand.phone ? (
        <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="grid place-items-center px-2 py-3.5 text-sm font-semibold text-white">
          {brand.phone}
        </a>
      ) : (
        <button onClick={() => open()} className="py-3.5 text-sm font-semibold">
          Enquire Now
        </button>
      )}
      <button
        onClick={() => open({ title: "Book Site Visit", interest: "Site Visit" })}
        className="bg-primary py-3.5 text-sm font-semibold text-primary-fg"
      >
        Book Site Visit
      </button>
    </div>
  );
}
