"use client";

import { useId, useState } from "react";
import { FONT_OPTIONS, type Field } from "@/lib/content/schema";
import { MediaField } from "./MediaField";

type Obj = Record<string, unknown>;

function emptyItem(fields: Field[]): Obj {
  return Object.fromEntries(
    fields.map((f) => [
      f.name,
      f.type === "boolean" ? true : f.type === "list" ? [] : f.type === "number" ? 0 : f.type === "select" ? f.options[0]?.value : "",
    ]),
  );
}

export function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const id = useId();

  if (field.type === "boolean") {
    return (
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-indigo-600"
        />
        <span>
          <span className="text-sm font-medium text-slate-800">{field.label}</span>
          {field.help && <span className="block text-xs text-slate-500">{field.help}</span>}
        </span>
      </label>
    );
  }

  if (field.type === "list") {
    return <ListField field={field} value={Array.isArray(value) ? (value as Obj[]) : []} onChange={onChange} />;
  }

  const str = value == null ? "" : String(value);
  let input: React.ReactNode;

  switch (field.type) {
    case "textarea":
      input = (
        <textarea
          id={id}
          value={str}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(10, Math.max(3, str.split("\n").length + 1))}
          className="admin-input"
        />
      );
      break;
    case "number":
      input = (
        <input id={id} type="number" value={str} onChange={(e) => onChange(Number(e.target.value))} className="admin-input max-w-[160px]" />
      );
      break;
    case "color":
      input = (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={/^#[0-9a-f]{6}$/i.test(str) ? str : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded border border-slate-300 bg-white p-1"
          />
          <input id={id} value={str} onChange={(e) => onChange(e.target.value)} className="admin-input max-w-[140px] font-mono" />
        </div>
      );
      break;
    case "select":
      input = (
        <select id={id} value={str} onChange={(e) => onChange(e.target.value)} className="admin-input">
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "font":
      input = (
        <>
          <input id={id} list={`${id}-list`} value={str} onChange={(e) => onChange(e.target.value)} className="admin-input" />
          <datalist id={`${id}-list`}>
            {FONT_OPTIONS.map((f) => (
              <option key={f} value={f} />
            ))}
          </datalist>
        </>
      );
      break;
    case "media":
      input = <MediaField value={str} onChange={onChange} accept={field.accept ?? "image"} />;
      break;
    default:
      input = (
        <input id={id} type={field.type === "url" ? "url" : "text"} value={str} onChange={(e) => onChange(e.target.value)} className="admin-input" />
      );
  }

  return (
    <div>
      {field.label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-800">
          {field.label}
        </label>
      )}
      {input}
      {field.help && <p className="mt-1 text-xs text-slate-500">{field.help}</p>}
    </div>
  );
}

function ListField({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { type: "list" }>;
  value: Obj[];
  onChange: (v: unknown) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const update = (i: number, item: Obj) => onChange(value.map((v, j) => (j === i ? item : v)));
  const remove = (i: number) => {
    onChange(value.filter((_, j) => j !== i));
    setOpenIndex(null);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpenIndex(openIndex === i ? j : openIndex);
  };
  const add = () => {
    onChange([...value, emptyItem(field.fields)]);
    setOpenIndex(value.length);
  };

  const labelOf = (item: Obj, i: number) => {
    const raw = String(item[field.itemLabel] ?? "");
    const labelField = field.fields.find((f) => f.name === field.itemLabel);
    const pretty = labelField?.type === "select" ? labelField.options.find((o) => o.value === raw)?.label : raw;
    return pretty || `Item ${i + 1}`;
  };

  // Compact one-line rows when every sub-field is simple (e.g. section order).
  const inline = field.fields.every((f) => f.type === "boolean" || f.type === "select");

  return (
    <div>
      <p className="mb-1 text-sm font-medium text-slate-800">{field.label}</p>
      {field.help && <p className="mb-2 text-xs text-slate-500">{field.help}</p>}
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 px-3 py-2">
              {inline ? (
                <div className="flex flex-1 flex-wrap items-center gap-4">
                  {field.fields.map((f) => (
                    <div key={f.name} className={f.type === "select" ? "min-w-[180px] flex-1" : ""}>
                      <FieldInput
                        field={{ ...f, label: f.type === "select" ? "" : f.label } as Field}
                        value={item[f.name]}
                        onChange={(v) => update(i, { ...item, [f.name]: v })}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex flex-1 items-center gap-2 text-left text-sm font-medium"
                >
                  <span className="text-slate-400">{openIndex === i ? "▾" : "▸"}</span>
                  <span className="truncate">{labelOf(item, i)}</span>
                </button>
              )}
              <div className="flex shrink-0 gap-1 text-slate-500">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded px-1.5 hover:bg-slate-200 disabled:opacity-30" title="Move up">
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  className="rounded px-1.5 hover:bg-slate-200 disabled:opacity-30"
                  title="Move down"
                >
                  ↓
                </button>
                <button type="button" onClick={() => remove(i)} className="rounded px-1.5 hover:bg-red-100 hover:text-red-600" title="Remove">
                  ✕
                </button>
              </div>
            </div>
            {!inline && openIndex === i && (
              <div className="space-y-4 border-t border-slate-200 bg-white p-4">
                {field.fields.map((f) => (
                  <FieldInput key={f.name} field={f} value={item[f.name]} onChange={(v) => update(i, { ...item, [f.name]: v })} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="admin-btn-ghost mt-2">
        + Add item
      </button>
    </div>
  );
}
