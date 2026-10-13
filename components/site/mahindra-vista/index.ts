import type { Brand } from "../brands";

// mahindrasvista.in
// Add brand-specific designs in ./sections and register them under `sections`,
// e.g. `sections: { hero: Hero }`.
export const mahindraVista: Brand = {
  defaults: {
    brand: { name: "Mahindra Vista", developer: "Mahindra Lifespaces" },
    seo: { title: "Mahindra Vista | New Launch Homes" },
    hero: { layout: "fullscreen", title: "Mahindra Vista", subtitle: "By Mahindra Lifespaces" },
    theme: {
      primary: "#C8102E",
      primaryForeground: "#FFFFFF",
      secondary: "#1F2933",
      accent: "#C8102E",
      surface: "#FFFFFF",
      surfaceAlt: "#F5F6F7",
      ink: "#1F2933",
      muted: "#5F6B7A",
      heading: "#111827",
      headingFont: "Montserrat",
      bodyFont: "Open Sans",
      radius: "sm",
    },
    layout: {
      sections: [
        { key: "hero", enabled: true },
        { key: "highlights", enabled: true },
        { key: "about", enabled: true },
        { key: "pricing", enabled: true },
        { key: "floorPlans", enabled: true },
        { key: "amenities", enabled: true },
        { key: "gallery", enabled: true },
        { key: "location", enabled: true },
        { key: "developer", enabled: true },
        { key: "faq", enabled: true },
        { key: "contact", enabled: true },
        { key: "virtualTour", enabled: false },
        { key: "emi", enabled: false },
      ],
    },
  },
};
