"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { LeadForm } from "./LeadForm";

/** Why the form was opened - saved as the lead's source. */
export type Intent =
  | "general"
  | "popup"
  | "brochure"
  | "pricing"
  | "floorplan"
  | "amenities"
  | "gallery"
  | "location"
  | "tour"
  | "loan";

interface OpenOptions {
  intent?: Intent;
  interest?: string;
  title?: string;
}

interface EnquiryCtx {
  open: (opts?: OpenOptions) => void;
  submitted: boolean;
  markSubmitted: () => void;
}

const Ctx = createContext<EnquiryCtx | null>(null);
const SUBMITTED_KEY = "lead_submitted";
const UTM_KEY = "lead_utm";

export function useEnquiry() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEnquiry must be used inside EnquiryProvider");
  return ctx;
}

/** Stores UTM / click-id params from the landing URL for the rest of the visit. */
function captureUtm() {
  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "kw", "cid"];
  const found = Object.fromEntries(keys.filter((k) => params.get(k)).map((k) => [k, params.get(k)!]));
  if (Object.keys(found).length) sessionStorage.setItem(UTM_KEY, JSON.stringify(found));
}

export function getUtm() {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_KEY) || "null");
  } catch {
    return null;
  }
}

export function EnquiryProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  const [modal, setModal] = useState<Required<Pick<OpenOptions, "intent">> & OpenOptions | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    captureUtm();
    setSubmitted(localStorage.getItem(SUBMITTED_KEY) === "1");
  }, []);

  const open = useCallback((opts?: OpenOptions) => {
    setModal({ ...opts, intent: opts?.intent ?? "general" });
  }, []);

  const markSubmitted = useCallback(() => {
    localStorage.setItem(SUBMITTED_KEY, "1");
    setSubmitted(true);
  }, []);

  // Auto popup, once per session, never for people who already enquired.
  useEffect(() => {
    const { popup } = content;
    if (!popup.enabled || localStorage.getItem(SUBMITTED_KEY) === "1" || sessionStorage.getItem("popup_seen")) return;
    const t = setTimeout(() => {
      sessionStorage.setItem("popup_seen", "1");
      setModal((m) => m ?? { intent: "popup" });
    }, Math.max(0, Number(popup.delaySeconds) || 0) * 1000);
    return () => clearTimeout(t);
  }, [content]);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModal(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modal]);

  const isPopup = modal?.intent === "popup";
  const title = modal?.title ?? (isPopup ? content.popup.title : modal?.intent === "brochure" ? content.brochure.label : content.nav.ctaLabel);
  const subtitle = isPopup ? content.popup.subtitle : "";
  const sideImage = isPopup ? content.popup.image : "";

  return (
    <Ctx.Provider value={{ open, submitted, markSubmitted }}>
      {children}
      {modal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div
            className={`relative grid w-full overflow-hidden rounded-theme bg-surface-alt text-ink shadow-2xl ring-1 ring-ink/10 ${
              sideImage ? "max-w-3xl md:grid-cols-2" : "max-w-md"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {sideImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sideImage} alt="" className="hidden h-auto w-full self-center md:block" />
            )}
            <div className="p-6 text-center md:p-8">
              <button
                onClick={() => setModal(null)}
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-xl text-muted hover:bg-ink/10 hover:text-ink"
                aria-label="Close"
              >
                ×
              </button>
              {content.brand.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={content.brand.logo} alt={content.brand.name} className="mx-auto mb-3 h-10 w-auto" />
              ) : (
                <p className="mb-1 font-heading text-lg font-semibold">{content.brand.name}</p>
              )}
              <h3 className="text-2xl font-semibold text-heading">{title}</h3>
              {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
              <div className="mt-5">
                <LeadForm
                  content={content}
                  source={modal.intent}
                  defaultInterest={modal.interest}
                  showBrochureLink={modal.intent === "brochure" || isPopup}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
