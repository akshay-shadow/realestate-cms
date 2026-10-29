import type { Brand } from "../brands";
import { MobileBar } from "./MobileBar";
import { About } from "./sections/About";
import { Amenities } from "./sections/Amenities";
import { Developer } from "./sections/Developer";
import { FloorPlans } from "./sections/FloorPlans";
import { Gallery } from "./sections/Gallery";
import { Hero } from "./sections/Hero";
import { Highlights } from "./sections/Highlights";
import { Location } from "./sections/Location";
import { Pricing } from "./sections/Pricing";

// lodha-bellevue.in
// Page structure follows the Mahalaxmi Bellevue reference: banner slider, intro,
// developer story, residences, plans, price table, amenities, gallery, location.
export const lodhaBellevue: Brand = {
  sections: {
    hero: Hero,
    about: About,
    developer: Developer,
    highlights: Highlights,
    floorPlans: FloorPlans,
    pricing: Pricing,
    amenities: Amenities,
    gallery: Gallery,
    location: Location,
  },
  MobileBar,
  defaults: {
    brand: { name: "Lodha Bellevue", developer: "Lodha Group" },
    seo: { title: "Lodha Bellevue | Luxury Residences" },
    hero: { layout: "split", title: "Lodha Bellevue", subtitle: "By Lodha Group" },
    developer: {
      title: "About Lodha Group",
      name: "Lodha Group",
      logo: "",
      readMoreUrl: "",
      stats: [],
      description:
        "Lodha is one of India's leading real estate developers, known for landmark residences across Mumbai and a commitment to quality, design and on-time delivery.",
    },
    pricing: { ctaLabel: "Price Breakup" },
    about: { ctaLabel: "Enquire Now" },
    form: {
      showEmail: true,
      showInterest: true,
      interestOptions: [{ label: "3 Bed-Residences" }, { label: "4 Bed-Residences" }, { label: "5 Bed-Residences" }],
      namePlaceholder: "Full Name",
      phonePlaceholder: "Number",
      emailPlaceholder: "Email id",
      interestPlaceholder: "What are you looking for?",
    },
    location: { note: "*Travel times are approximate and depend on traffic." },
    nav: {
      links: [
        { label: "About", href: "#about" },
        { label: "Plans", href: "#floorPlans" },
        { label: "Prices", href: "#pricing" },
        { label: "Amenities", href: "#amenities" },
        { label: "Location", href: "#location" },
        { label: "Gallery", href: "#gallery" },
      ],
    },
    // Light cream / gold look of the Mahalaxmi Bellevue reference.
    theme: {
      primary: "#A0873A",
      primaryForeground: "#FFFFFF",
      secondary: "#FFFFFF",
      accent: "#A0873A",
      surface: "#FFFFFF",
      surfaceAlt: "#FCF8EA",
      ink: "#2E2E2E",
      muted: "#6B6B6B",
      heading: "#2E2E2E",
      navText: "#2E2E2E",
      headingFont: "Poppins",
      bodyFont: "Poppins",
      radius: "none",
    },
    layout: {
      sections: [
        { key: "hero", enabled: true },
        { key: "about", enabled: true },
        { key: "developer", enabled: false },
        { key: "highlights", enabled: true },
        { key: "floorPlans", enabled: true },
        { key: "pricing", enabled: true },
        { key: "amenities", enabled: true },
        { key: "gallery", enabled: true },
        { key: "location", enabled: true },
        { key: "contact", enabled: true },
        { key: "virtualTour", enabled: false },
        { key: "emi", enabled: false },
        { key: "faq", enabled: false },
      ],
    },
  },
};
