// Everything a client site can change lives in this one JSON document
// (stored in sites.content). Add a field here, give it a default in
// defaults.ts and an editor entry in schema.ts, and it becomes editable.

export type SectionKey =
  | "hero"
  | "about"
  | "highlights"
  | "pricing"
  | "amenities"
  | "gallery"
  | "floorPlans"
  | "location"
  | "virtualTour"
  | "emi"
  | "developer"
  | "faq"
  | "contact";

export interface StatItem {
  value: string;
  label: string;
}

export interface SiteContent {
  visibility: {
    isPublic: boolean;
    previewPassword: string;
  };
  brand: {
    name: string;
    tagline: string;
    logo: string;
    projectLogo: string;
    favicon: string;
    phone: string;
    email: string;
    developer: string;
    location: string;
    address: string;
    rera: string;
    reraUrl: string;
    reraQr: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
    noindex: boolean;
  };
  theme: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    accent: string;
    surface: string;
    surfaceAlt: string;
    ink: string;
    muted: string;
    heading: string;
    navText: string;
    headingFont: string;
    bodyFont: string;
    radius: "none" | "sm" | "md" | "lg" | "xl";
  };
  emailAlerts: {
    enabled: boolean;
    notifyEmails: string;
  };
  whatsapp: {
    notifyNumbers: string;
    autoSend: boolean;
    redirectAfterSubmit: boolean;
    redirectNumber: string;
    messageTemplate: string;
    floatingButton: boolean;
    floatingNumber: string;
    floatingMessage: string;
    chatBubble: boolean;
    chatName: string;
    chatPhoto: string;
    chatGreeting: string;
  };
  tracking: {
    gaId: string;
    gtmId: string;
    metaPixelId: string;
  };
  layout: {
    sections: { key: SectionKey; enabled: boolean }[];
  };
  nav: {
    links: { label: string; href: string }[];
    ctaLabel: string;
  };
  form: {
    defaultCountryCode: string;
    showEmail: boolean;
    showInterest: boolean;
    showMessage: boolean;
    consentRequired: boolean;
    interestOptions: { label: string }[];
    submitLabel: string;
    consentText: string;
    successTitle: string;
    successMessage: string;
    redirectToThankYou: boolean;
  };
  brochure: {
    enabled: boolean;
    label: string;
    file: string;
  };
  hero: {
    layout: "split" | "fullscreen";
    images: { image: string }[];
    eyebrow: string;
    title: string;
    subtitle: string;
    mediaType: "image" | "video";
    image: string;
    video: string;
    overlayOpacity: number;
    configText: string;
    priceTag: string;
    offerTitle: string;
    offers: { text: string }[];
    ctaLabel: string;
    showForm: boolean;
    formTitle: string;
    badges: { text: string }[];
  };
  about: {
    title: string;
    subtitle: string;
    body: string;
    image: string;
    stats: StatItem[];
  };
  highlights: {
    title: string;
    subtitle: string;
    image: string;
    ctaLabel: string;
    items: { title: string; description: string }[];
  };
  pricing: {
    title: string;
    subtitle: string;
    note: string;
    priceSheetLabel: string;
    ctaLabel: string;
    items: { type: string; area: string; price: string; image: string }[];
  };
  amenities: {
    title: string;
    subtitle: string;
    description: string;
    ctaLabel: string;
    items: { icon: string; title: string; image: string }[];
  };
  gallery: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    images: { image: string; caption: string }[];
  };
  floorPlans: {
    title: string;
    subtitle: string;
    lockBehindForm: boolean;
    ctaLabel: string;
    items: { category: string; title: string; area: string; image: string }[];
  };
  location: {
    title: string;
    subtitle: string;
    mapEmbedUrl: string;
    image: string;
    ctaLabel: string;
    nearby: { category: string; place: string; distance: string }[];
  };
  virtualTour: {
    title: string;
    subtitle: string;
    image: string;
    videoUrl: string;
    ctaLabel: string;
  };
  emi: {
    title: string;
    subtitle: string;
    defaultAmount: number;
    defaultRate: number;
    defaultTenure: number;
    ctaLabel: string;
    disclaimer: string;
  };
  developer: {
    title: string;
    name: string;
    logo: string;
    description: string;
    readMoreUrl: string;
    stats: StatItem[];
  };
  faq: {
    title: string;
    items: { question: string; answer: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    formTitle: string;
  };
  popup: {
    enabled: boolean;
    delaySeconds: number;
    title: string;
    subtitle: string;
    image: string;
  };
  footer: {
    textColor: string;
    about: string;
    reraNote: string;
    advertiser: string;
    disclaimer: string;
    copyright: string;
    social: { platform: string; url: string }[];
  };
  privacy: {
    title: string;
    body: string;
  };
}

export type ContentKey = keyof SiteContent;
