"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { EnquireButton } from "../EnquireButton";
import { SectionHeading } from "./SectionHeading";

const inr = (n: number) => "₹ " + Math.round(n).toLocaleString("en-IN");

function emiFor(principal: number, annualRate: number, years: number) {
  const n = years * 12;
  const r = annualRate / 12 / 100;
  if (!principal || !n) return 0;
  if (!r) return principal / n;
  const f = Math.pow(1 + r, n);
  return (principal * r * f) / (f - 1);
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm text-muted">{label}</label>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-36 rounded-theme border border-ink/15 bg-surface px-3 py-1.5 text-right text-sm font-semibold text-ink outline-none focus:border-primary"
        />
      </div>
      <input
        type="range"
        value={Math.min(max, Math.max(min, value))}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[rgb(var(--c-primary))]"
        aria-label={label}
      />
      {format && (
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          <span>{format(min)}</span>
          <span>{format(max)}</span>
        </div>
      )}
    </div>
  );
}

export function EmiCalculator({ content }: { content: SiteContent }) {
  const { emi } = content;
  const [amount, setAmount] = useState(Number(emi.defaultAmount) || 5000000);
  const [rate, setRate] = useState(Number(emi.defaultRate) || 8.5);
  const [tenure, setTenure] = useState(Number(emi.defaultTenure) || 20);

  const monthly = emiFor(amount, rate, tenure);
  const total = monthly * tenure * 12;
  const interest = Math.max(0, total - amount);
  const principalPct = total ? Math.round((amount / total) * 100) : 0;

  const short = (v: number) => (v >= 1e7 ? `${v / 1e7} Cr` : `${v / 1e5} L`);

  return (
    <section id="emi" className="section">
      <div className="container-x max-w-5xl">
        <SectionHeading title={emi.title} subtitle={emi.subtitle} />
        <div className="grid gap-8 rounded-theme bg-surface-alt p-6 ring-1 ring-ink/10 md:grid-cols-2 md:p-8">
          <div className="space-y-6">
            <Slider label="Loan Amount (₹)" value={amount} min={500000} max={100000000} step={100000} onChange={setAmount} format={short} />
            <Slider label="Interest Rate (% p.a.)" value={rate} min={5} max={15} step={0.05} onChange={setRate} format={(v) => `${v}%`} />
            <Slider label="Loan Tenure (Years)" value={tenure} min={1} max={30} step={1} onChange={setTenure} format={(v) => `${v} Yr`} />
          </div>

          <div className="flex flex-col items-center gap-6 sm:flex-row md:flex-col lg:flex-row">
            <div
              className="relative grid h-40 w-40 shrink-0 place-items-center rounded-full"
              style={{ background: `conic-gradient(rgb(var(--c-primary)) 0 ${principalPct}%, rgb(var(--c-muted) / .35) ${principalPct}% 100%)` }}
              role="img"
              aria-label={`Principal ${principalPct}%, interest ${100 - principalPct}%`}
            >
              <div className="grid h-28 w-28 place-items-center rounded-full bg-surface-alt text-center">
                <span>
                  <span className="block text-[11px] text-muted">Monthly EMI</span>
                  <span className="block text-sm font-bold text-heading">{inr(monthly)}</span>
                </span>
              </div>
            </div>
            <dl className="w-full space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Monthly EMI</dt>
                <dd className="whitespace-nowrap font-bold text-heading">{inr(monthly)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Principal ({principalPct}%)
                </dt>
                <dd className="whitespace-nowrap font-semibold">{inr(amount)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted/40" /> Total Interest ({100 - principalPct}%)
                </dt>
                <dd className="whitespace-nowrap font-semibold">{inr(interest)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-ink/10 pt-3">
                <dt className="text-muted">Total Payment</dt>
                <dd className="whitespace-nowrap font-semibold">{inr(total)}</dd>
              </div>
              {emi.ctaLabel && (
                <EnquireButton intent="loan" title={emi.ctaLabel} className="btn-primary mt-2 w-full">
                  {emi.ctaLabel}
                </EnquireButton>
              )}
            </dl>
          </div>
        </div>
        {emi.disclaimer && <p className="mt-4 text-center text-xs text-muted">{emi.disclaimer}</p>}
      </div>
    </section>
  );
}
