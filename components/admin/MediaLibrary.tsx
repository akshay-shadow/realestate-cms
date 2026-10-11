"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSupabase } from "@/lib/supabase/client";

const BUCKET = "media";

interface MediaFile {
  name: string;
  path: string;
  url: string;
  size: number;
  type: "image" | "video" | "file";
}

const kindOf = (name: string): MediaFile["type"] =>
  /\.(png|jpe?g|webp|gif|svg|avif|ico)$/i.test(name) ? "image" : /\.(mp4|webm|mov)$/i.test(name) ? "video" : "file";

const ACCEPT_ATTR = { image: "image/*", video: "video/*", file: "*" } as const;

export function MediaLibrary({
  slug,
  accept,
  onSelect,
}: {
  slug: string;
  accept?: "image" | "video" | "file";
  onSelect?: (url: string) => void;
}) {
  const supabase = useSupabase();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(slug, { limit: 500, sortBy: { column: "created_at", order: "desc" } });
    if (error) setError(error.message);
    setFiles(
      (data ?? [])
        .filter((f) => f.id) // skip folder placeholders
        .map((f) => {
          const path = `${slug}/${f.name}`;
          return {
            name: f.name,
            path,
            url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
            size: (f.metadata as { size?: number } | null)?.size ?? 0,
            type: kindOf(f.name),
          };
        }),
    );
    setLoading(false);
  }, [slug, supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function upload(list: FileList | null) {
    if (!list?.length) return;
    setUploading(true);
    setError("");
    let lastUrl = "";
    for (const file of Array.from(list)) {
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.\-]+/g, "-");
      const path = `${slug}/${Date.now()}-${safe}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "31536000" });
      if (error) {
        setError(`${file.name}: ${error.message}`);
        continue;
      }
      lastUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (onSelect && lastUrl && list.length === 1) return onSelect(lastUrl);
    load();
  }

  async function remove(path: string) {
    setConfirmDelete("");
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) return setError(error.message);
    setFiles((f) => f.filter((x) => x.path !== path));
  }

  const visible = accept && accept !== "file" ? files.filter((f) => f.type === accept) : files;

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
        className="mb-5 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center"
      >
        <p className="text-sm text-slate-600">Drag & drop files here, or</p>
        <button type="button" onClick={() => inputRef.current?.click()} className="admin-btn" disabled={uploading}>
          {uploading ? "Uploading…" : "Upload files"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTR[accept ?? "file"]}
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
        <p className="text-xs text-slate-400">Tip: compress images to under 500 KB (e.g. squoosh.app) for fast loading.</p>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-slate-500">No files yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {visible.map((f) => (
            <div key={f.path} className="group overflow-hidden rounded-lg border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => onSelect?.(f.url)}
                className="block aspect-square w-full bg-slate-100"
                disabled={!onSelect}
              >
                {f.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.url} alt={f.name} loading="lazy" className="h-full w-full object-cover" />
                ) : f.type === "video" ? (
                  <video src={f.url} muted className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full place-items-center text-3xl">📄</span>
                )}
              </button>
              <div className="p-2">
                <p className="truncate text-xs text-slate-600" title={f.name}>
                  {f.name.replace(/^\d+-/, "")}
                </p>
                <p className="text-[10px] text-slate-400">{(f.size / 1024).toFixed(0)} KB</p>
                <div className="mt-1 flex gap-2 text-xs">
                  {onSelect ? (
                    <button type="button" onClick={() => onSelect(f.url)} className="font-semibold text-indigo-600">
                      Select
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(f.url);
                        setCopied(f.path);
                        setTimeout(() => setCopied(""), 1500);
                      }}
                      className="text-indigo-600"
                    >
                      {copied === f.path ? "Copied!" : "Copy URL"}
                    </button>
                  )}
                  {confirmDelete === f.path ? (
                    <>
                      <button type="button" onClick={() => remove(f.path)} className="font-semibold text-red-600">
                        Confirm
                      </button>
                      <button type="button" onClick={() => setConfirmDelete("")} className="text-slate-500">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => setConfirmDelete(f.path)} className="text-slate-400 hover:text-red-600">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
