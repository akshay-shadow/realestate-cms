"use client";

import { useState, useTransition } from "react";
import { importContent } from "@/app/admin/actions";

export function ImportContent() {
  const [file, setFile] = useState<File | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  function run() {
    if (!file) return;
    setConfirming(false);
    start(async () => {
      const res = await importContent(await file.text());
      setMessage(res.error ? { ok: false, text: res.error } : { ok: true, text: "Imported. The website is updated." });
    });
  }

  return (
    <div className="space-y-3">
      <input
        type="file"
        accept="application/json,.json"
        onChange={(e) => {
          setFile(e.target.files?.[0] ?? null);
          setMessage(null);
        }}
        className="block text-sm"
      />
      {file &&
        (confirming ? (
          <div className="flex items-center gap-3 text-sm">
            <span>Replace all content with {file.name}?</span>
            <button onClick={run} className="admin-btn bg-red-600 hover:bg-red-500">
              Yes, import
            </button>
            <button onClick={() => setConfirming(false)} className="admin-btn-ghost">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)} disabled={pending} className="admin-btn">
            {pending ? "Importing…" : "Import"}
          </button>
        ))}
      {message && <p className={`text-sm ${message.ok ? "text-green-600" : "text-red-600"}`}>{message.text}</p>}
    </div>
  );
}
