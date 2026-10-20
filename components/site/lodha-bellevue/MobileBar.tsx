"use client";

import { useEnquiry } from "@/components/site/EnquiryProvider";
import type { SiteContent } from "@/lib/content/types";

// Lodha Bellevue: two-part mobile bar, phone number | Book Site Visit.
// The site background is white, so the number sits on the dark text colour.
export function MobileBar({ content }: { content: SiteContent }) {
  const { brand } = content;
  const { open } = useEnquiry();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 md:hidden">
      {brand.phone ? (
        <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="grid place-items-center bg-ink px-2 py-3.5 text-sm font-semibold text-white">
          {brand.phone}
        </a>
      ) : (
        <button onClick={() => open()} className="bg-ink py-3.5 text-sm font-semibold text-white">
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
