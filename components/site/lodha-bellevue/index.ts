import type { Brand } from "../brands";

// lodha-bellevue.in
// Add brand-specific designs in ./sections and register them under `sections`,
// e.g. `sections: { hero: Hero }`.
export const lodhaBellevue: Brand = {
  defaults: {
    brand: { name: "Lodha Bellevue", developer: "Lodha Group" },
    seo: { title: "Lodha Bellevue | Luxury Residences" },
    hero: { layout: "split", title: "Lodha Bellevue", subtitle: "By Lodha Group" },
    theme: {
      primary: "#B8975A",
      primaryForeground: "#0E1A2B",
      secondary: "#0E1A2B",
      accent: "#B8975A",
      surface: "#0E1A2B",
      surfaceAlt: "#15253B",
      ink: "#EEF1F5",
      muted: "#9AA8BA",
      heading: "#D9BE84",
      headingFont: "Playfair Display",
      bodyFont: "Lato",
      radius: "none",
    },
    layout: {
      sections: [
        { key: "hero", enabled: true },
        { key: "about", enabled: true },
        { key: "gallery", enabled: true },
        { key: "amenities", enabled: true },
        { key: "floorPlans", enabled: true },
        { key: "pricing", enabled: true },
        { key: "virtualTour", enabled: true },
        { key: "location", enabled: true },
        { key: "emi", enabled: true },
        { key: "developer", enabled: true },
        { key: "contact", enabled: true },
        { key: "highlights", enabled: false },
        { key: "faq", enabled: false },
      ],
    },
  },
};
