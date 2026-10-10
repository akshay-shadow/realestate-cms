"use client";

import { createContext, useContext, useState } from "react";
import { MediaLibrary } from "./MediaLibrary";

export const SiteSlugContext = createContext("demo");

export function MediaField({
  value,
  onChange,
  accept,
}: {
  value: string;
  onChange: (v: string) => void;
  accept: "image" | "video" | "file";
}) {
  const slug = useContext(SiteSlugContext);
  const [picking, setPicking] = useState(false);

  return (
    <div className="space-y-2">
      {value && accept === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-28 max-w-full rounded-lg border border-slate-200 bg-slate-100 object-contain" />
      )}
      {value && accept === "video" && <video src={value} className="h-28 rounded-lg border border-slate-200" muted />}
      <div className="flex gap-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste a URL or choose a file" className="admin-input" />
        <button type="button" onClick={() => setPicking(true)} className="admin-btn-ghost shrink-0">
          Choose
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="admin-btn-ghost shrink-0" title="Clear">
            ✕
          </button>
        )}
      </div>

      {picking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPicking(false)}>
          <div className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Choose {accept}</h2>
              <button onClick={() => setPicking(false)} className="text-2xl text-slate-400 hover:text-slate-700">
                ×
              </button>
            </div>
            <MediaLibrary
              slug={slug}
              accept={accept}
              onSelect={(url) => {
                onChange(url);
                setPicking(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
