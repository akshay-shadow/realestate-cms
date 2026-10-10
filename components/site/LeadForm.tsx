"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { getUtm, useEnquiry } from "./EnquiryProvider";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const COUNTRY_CODES = ["+91", "+971", "+1", "+44", "+61", "+65", "+966", "+974", "+968", "+965", "+973", "+49", "+33", "+64", "+60", "+852"];

function trackLead(source: string) {
  window.gtag?.("event", "generate_lead", { form_source: source });
  window.fbq?.("track", "Lead");
  window.dataLayer?.push({ event: "lead_submit", form_source: source });
}

interface Props {
  content: SiteContent;
  source: string;
  defaultInterest?: string;
  allowMessage?: boolean;
  showBrochureLink?: boolean;
  onDone?: () => void;
}

export function LeadForm({ content, source, defaultInterest, allowMessage, showBrochureLink, onDone }: Props) {
  const { form, brochure } = content;
  const router = useRouter();
  const { markSubmitted } = useEnquiry();
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const codes = COUNTRY_CODES.includes(form.defaultCountryCode) ? COUNTRY_CODES : [form.defaultCountryCode, ...COUNTRY_CODES];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const { countryCode, mobile, consent: _consent, ...rest } = data;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          interest: rest.interest || defaultInterest || "",
          phone: `${countryCode ?? ""} ${mobile ?? ""}`.trim(),
          source,
          utm: getUtm(),
          pageUrl: window.location.href,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");

      trackLead(source);
      markSubmitted();
      setStatus("done");
      onDone?.();

      if (json.whatsappUrl) {
        window.location.href = json.whatsappUrl;
      } else if (form.redirectToThankYou) {
        router.push("/thank-you");
      }
    } catch (err) {
      setError((err as Error).message);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-theme bg-primary/10 p-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary text-2xl text-primary-fg">✓</div>
        <p className="text-lg font-semibold">{form.successTitle}</p>
        <p className="mt-1 text-sm text-muted">{form.successMessage}</p>
        {showBrochureLink && brochure.enabled && brochure.file && (
          <a href={brochure.file} target="_blank" rel="noopener" className="btn-primary mt-4">
            {brochure.label} ↓
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 text-left">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input name="name" required minLength={2} placeholder="Name" className="input" autoComplete="name" aria-label="Name" />
      <div className="flex gap-2">
        <select name="countryCode" defaultValue={form.defaultCountryCode} className="input w-[92px] shrink-0 px-2" aria-label="Country code">
          {codes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          name="mobile"
          type="tel"
          inputMode="tel"
          required
          pattern="[0-9\s\-]{6,15}"
          placeholder="Mobile Number"
          className="input"
          autoComplete="tel-national"
          aria-label="Mobile number"
        />
      </div>
      {form.showEmail && (
        <input name="email" type="email" placeholder="Email Address" className="input" autoComplete="email" aria-label="Email" />
      )}
      {form.showInterest && form.interestOptions.length > 0 && (
        <select name="interest" defaultValue={defaultInterest ?? ""} className="input" aria-label="Interested in">
          <option value="">Interested in</option>
          {form.interestOptions.map((o) => (
            <option key={o.label} value={o.label}>
              {o.label}
            </option>
          ))}
        </select>
      )}
      {allowMessage && form.showMessage && (
        <textarea name="message" rows={3} placeholder="Message (optional)" className="input" aria-label="Message" />
      )}
      {form.consentText && (
        <label className="flex items-start gap-2 text-[11px] leading-snug text-muted">
          <input
            type="checkbox"
            name="consent"
            defaultChecked
            required={form.consentRequired}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[rgb(var(--c-primary))]"
          />
          <span>
            {form.consentText}{" "}
            <Link href="/privacy-policy" target="_blank" className="text-primary underline">
              Privacy policy
            </Link>
          </span>
        </label>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
        {status === "sending" ? "Submitting…" : form.submitLabel}
      </button>
    </form>
  );
}
