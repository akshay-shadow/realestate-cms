"use client";

import { useEffect, useState, useTransition } from "react";
import { resetSection, saveSection } from "@/app/admin/actions";
import type { EditorPage } from "@/lib/content/schema";
import { FieldInput } from "./FieldInput";
import { SiteSlugContext } from "./MediaField";

type Obj = Record<string, unknown>;

export function ContentEditor({
  page,
  initialValue,
  siteSlug,
}: {
  page: EditorPage;
  initialValue: Obj;
  siteSlug: string;
}) {
  const [value, setValue] = useState<Obj>(initialValue);
  const [saved, setSaved] = useState<Obj>(initialValue);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (message?.type !== "ok") return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  function save() {
    start(async () => {
      const res = await saveSection(page.key, value);
      if (res.error) return setMessage({ type: "error", text: res.error });
      setSaved(value);
      setMessage({ type: "ok", text: "Saved. Your website is updated." });
    });
  }

  function reset() {
    setConfirmReset(false);
    start(async () => {
      const res = await resetSection(page.key);
      if (res.error) return setMessage({ type: "error", text: res.error });
      setMessage({ type: "ok", text: "Restored defaults. Reloading…" });
      window.location.reload();
    });
  }

  return (
    <SiteSlugContext.Provider value={siteSlug}>
      <div className="mx-auto max-w-3xl pb-24">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{page.group}</p>
          <h1 className="text-2xl font-bold">{page.title}</h1>
          {page.description && <p className="mt-1 text-sm text-slate-500">{page.description}</p>}
        </div>

        <div className="admin-card space-y-5">
          {page.fields.map((field) => (
            <FieldInput
              key={field.name}
              field={field}
              value={value[field.name]}
              onChange={(v) => setValue((prev) => ({ ...prev, [field.name]: v }))}
            />
          ))}
        </div>

        <div className="mt-4 text-right">
          {confirmReset ? (
            <span className="text-sm">
              Replace this section with demo defaults?{" "}
              <button onClick={reset} className="font-semibold text-red-600">
                Yes, reset
              </button>{" "}
              <button onClick={() => setConfirmReset(false)} className="text-slate-500">
                Cancel
              </button>
            </span>
          ) : (
            <button onClick={() => setConfirmReset(true)} className="text-xs text-slate-400 hover:text-red-600">
              Reset to defaults
            </button>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <p className={`text-sm ${message?.type === "error" ? "text-red-600" : "text-slate-500"}`}>
            {message?.text ?? (dirty ? "You have unsaved changes" : "All changes saved")}
          </p>
          <div className="flex gap-2">
            {dirty && (
              <button onClick={() => setValue(saved)} className="admin-btn-ghost" disabled={pending}>
                Discard
              </button>
            )}
            <button onClick={save} className="admin-btn" disabled={pending || !dirty}>
              {pending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </SiteSlugContext.Provider>
  );
}
