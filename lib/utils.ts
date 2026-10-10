export function hexToRgb(hex: string, fallback = "0 0 0") {
  let h = (hex || "").trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return fallback;
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export const RADIUS: Record<string, string> = {
  none: "0px",
  sm: "4px",
  md: "10px",
  lg: "16px",
  xl: "28px",
};

export function googleFontsHref(fonts: string[]) {
  const families = Array.from(new Set(fonts.filter(Boolean)))
    .map((f) => `family=${encodeURIComponent(f.trim()).replace(/%20/g, "+")}:wght@400;500;600;700`)
    .join("&");
  return families ? `https://fonts.googleapis.com/css2?${families}&display=swap` : null;
}

export function fillTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? "");
}

export function waLink(number: string, text: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function paragraphs(text: string) {
  return (text || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
