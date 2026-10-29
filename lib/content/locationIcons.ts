// Icons for nearby places (Location section). The SVGs live in
// components/site/LocationIcon.tsx; this list feeds the admin dropdown.
export const LOCATION_ICON_OPTIONS = [
  { value: "", label: "Pin (default)" },
  { value: "bridge", label: "Bridge / sea link" },
  { value: "road", label: "Road / highway" },
  { value: "metro", label: "Metro / train" },
  { value: "airport", label: "Airport" },
  { value: "racecourse", label: "Racecourse / park" },
  { value: "mall", label: "Mall / shopping" },
  { value: "hospital", label: "Hospital" },
  { value: "school", label: "School / college" },
  { value: "office", label: "Office / business hub" },
] as const;
