export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  site_visit: "Site visit",
  converted: "Converted",
  lost: "Lost",
};

const COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  site_visit: "bg-purple-100 text-purple-700",
  converted: "bg-green-100 text-green-700",
  lost: "bg-slate-200 text-slate-600",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${COLORS[status] ?? COLORS.new}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
