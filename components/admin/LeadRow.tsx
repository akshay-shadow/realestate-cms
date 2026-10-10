"use client";

import { useState, useTransition } from "react";
import { deleteLead, updateLead } from "@/app/admin/actions";
import { STATUS_LABELS } from "./StatusBadge";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  interest: string | null;
  message: string | null;
  source: string | null;
  utm: Record<string, string> | null;
  status: string;
  notes: string | null;
  whatsapp_status: string | null;
  created_at: string;
}

export function LeadRow({ lead }: { lead: Lead }) {
  const [pending, start] = useTransition();
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [error, setError] = useState("");
  const phoneDigits = lead.phone.replace(/\D/g, "");

  const run = (fn: () => Promise<{ error?: string }>) =>
    start(async () => {
      const res = await fn();
      setError(res.error ?? "");
    });

  return (
    <tr className={pending ? "opacity-60" : ""}>
      <td className="whitespace-nowrap px-4 py-3 align-top text-slate-500">
        {new Date(lead.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
      </td>
      <td className="px-4 py-3 align-top">
        <p className="font-medium">{lead.name}</p>
        <div className="mt-1 flex flex-wrap gap-2 text-xs">
          <a href={`tel:${lead.phone}`} className="text-indigo-600 hover:underline">
            {lead.phone}
          </a>
          <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener" className="text-green-600 hover:underline">
            WhatsApp
          </a>
        </div>
        {lead.email && <p className="text-xs text-slate-500">{lead.email}</p>}
      </td>
      <td className="max-w-xs px-4 py-3 align-top">
        {lead.interest && <p className="font-medium">{lead.interest}</p>}
        {lead.message && <p className="line-clamp-3 text-xs text-slate-500">{lead.message}</p>}
      </td>
      <td className="px-4 py-3 align-top text-xs text-slate-500">
        <p>{lead.source ?? "-"}</p>
        {lead.utm?.utm_source && (
          <p>
            {lead.utm.utm_source}
            {lead.utm.utm_campaign && ` / ${lead.utm.utm_campaign}`}
          </p>
        )}
        {lead.whatsapp_status && (
          <p className="mt-1 max-w-[160px] truncate" title={lead.whatsapp_status}>
            WA: {lead.whatsapp_status}
          </p>
        )}
      </td>
      <td className="px-4 py-3 align-top">
        <select
          defaultValue={lead.status}
          onChange={(e) => run(() => updateLead(lead.id, { status: e.target.value }))}
          className="admin-input w-auto py-1 text-xs"
        >
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 align-top">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => notes !== (lead.notes ?? "") && run(() => updateLead(lead.id, { notes }))}
          rows={2}
          placeholder="Add note…"
          className="admin-input min-w-[160px] py-1 text-xs"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </td>
      <td className="px-4 py-3 align-top">
        <DeleteButton onConfirm={() => run(() => deleteLead(lead.id))} />
      </td>
    </tr>
  );
}

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming)
    return (
      <button onClick={() => setConfirming(true)} className="text-xs text-slate-400 hover:text-red-600">
        Delete
      </button>
    );
  return (
    <span className="flex gap-2 text-xs">
      <button onClick={onConfirm} className="font-semibold text-red-600">
        Confirm
      </button>
      <button onClick={() => setConfirming(false)} className="text-slate-500">
        Cancel
      </button>
    </span>
  );
}
