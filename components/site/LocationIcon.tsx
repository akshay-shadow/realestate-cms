// Line icons for nearby places. Keys match LOCATION_ICON_OPTIONS in lib/content/locationIcons.ts.
const PATHS: Record<string, string> = {
  pin: "M12 21s-6.5-6.1-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.9 12 21 12 21zM12 12.3a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  bridge: "M2 17h20M4 17V9m16 8V9M4 9c3 4 13 4 16 0M8 17v-4.5m4 4.5v-3.6m4 3.6v-4.5",
  road: "M8 3 5 21M16 3l3 18M12 4v3m0 4v3m0 4v3",
  metro: "M7 3h10a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2zM5 10h14M9 14h.01M15 14h.01M8 21l2-4m6 4-2-4",
  airport: "M2.5 19h19M3 13.5l4.5 1.2L20 11a1.8 1.8 0 0 0-1-3.4l-4.6 1.3-6.4-4-2 .6 3.9 4.6-3.4 1-2-1.6-1.5.5z",
  racecourse: "M3 20h18M5 20v-7m14 7v-7M3 13h18M7 13V9.5a5 5 0 0 1 10 0V13",
  mall: "M5 8h14l-1 12H6L5 8zM9 8V6a3 3 0 0 1 6 0v2",
  hospital: "M4 21V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v16M2 21h20M12 8v6m-3-3h6M10 21v-3h4v3",
  school: "M2 9l10-5 10 5-10 5L2 9zm4 2v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6",
  office: "M4 21V4h10v17M14 9h6v12M2 21h20M7 8h1m3 0h1m-5 4h1m3 0h1m-5 4h1m3 0h1m5-4h1m-1 4h1",
};

export function LocationIcon({ name, className }: { name?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name ?? ""] ?? PATHS.pin} />
    </svg>
  );
}
