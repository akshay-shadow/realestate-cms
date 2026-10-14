import type { ContentKey } from "./types";

// Describes how each part of SiteContent is edited in the admin panel.
// The admin form is generated from this, so adding a field here is all it
// takes to make it editable.

export type Field =
  | { type: "text" | "textarea" | "url" | "color" | "number"; name: string; label: string; help?: string }
  | { type: "boolean"; name: string; label: string; help?: string }
  | { type: "media"; name: string; label: string; accept?: "image" | "video" | "file"; help?: string }
  | { type: "select"; name: string; label: string; options: { value: string; label: string }[]; help?: string }
  | { type: "font"; name: string; label: string; help?: string }
  | { type: "list"; name: string; label: string; itemLabel: string; fields: Field[]; help?: string };

export interface EditorPage {
  key: ContentKey;
  title: string;
  group: "Settings" | "Page Sections";
  description?: string;
  fields: Field[];
}

const sectionHeader: Field[] = [
  { type: "text", name: "subtitle", label: "Small heading (above title)" },
  { type: "text", name: "title", label: "Title" },
];

export const SECTION_OPTIONS = [
  { value: "hero", label: "Hero / Banner" },
  { value: "about", label: "About / Overview" },
  { value: "highlights", label: "Highlights" },
  { value: "pricing", label: "Pricing" },
  { value: "amenities", label: "Amenities" },
  { value: "gallery", label: "Gallery" },
  { value: "floorPlans", label: "Floor Plans" },
  { value: "location", label: "Location" },
  { value: "virtualTour", label: "Virtual Tour" },
  { value: "emi", label: "EMI Calculator" },
  { value: "developer", label: "Developer" },
  { value: "faq", label: "FAQ" },
  { value: "contact", label: "Contact Form" },
];

export const FONT_OPTIONS = [
  "Inter",
  "Poppins",
  "Montserrat",
  "Lato",
  "Open Sans",
  "Roboto",
  "Nunito Sans",
  "DM Sans",
  "Manrope",
  "Outfit",
  "Jost",
  "Playfair Display",
  "Cormorant Garamond",
  "Lora",
  "Merriweather",
  "Cinzel",
  "Marcellus",
  "Libre Baskerville",
  "Bodoni Moda",
  "Raleway",
];

export const editorPages: EditorPage[] = [
  // ---------------- Settings ----------------
  {
    key: "brand",
    title: "Brand & Contact",
    group: "Settings",
    fields: [
      { type: "text", name: "name", label: "Project / Brand name" },
      { type: "text", name: "tagline", label: "Tagline" },
      {
        type: "media",
        name: "logo",
        label: "Main logo (left of menu)",
        accept: "image",
        help: "Leave empty to show the name as text.",
      },
      { type: "media", name: "projectLogo", label: "Project logo (right of menu)", accept: "image", help: "Optional." },
      { type: "media", name: "favicon", label: "Favicon", accept: "image" },
      { type: "text", name: "phone", label: "Phone number" },
      { type: "text", name: "email", label: "Email" },
      { type: "text", name: "developer", label: "Developer name" },
      { type: "text", name: "location", label: "Short location (shown in banner)" },
      { type: "textarea", name: "address", label: "Site address" },
      { type: "text", name: "rera", label: "RERA project registration no." },
      { type: "url", name: "reraUrl", label: "RERA website link" },
      { type: "media", name: "reraQr", label: "RERA QR code", accept: "image" },
    ],
  },
  {
    key: "visibility",
    title: "Visibility",
    group: "Settings",
    description:
      "While the website isn't live, visitors must enter the preview password to see it (logged-in admins skip this). Turn it live when the site is ready.",
    fields: [
      { type: "boolean", name: "isPublic", label: "Website is live (visible to everyone)" },
      {
        type: "text",
        name: "previewPassword",
        label: "Preview password",
        help: "Share this with anyone who should see the site before launch. Changing it signs everyone out of the preview.",
      },
    ],
  },
  {
    key: "seo",
    title: "SEO",
    group: "Settings",
    fields: [
      { type: "text", name: "title", label: "Meta title", help: "Ideal: 50–60 characters." },
      { type: "textarea", name: "description", label: "Meta description", help: "Ideal: 140–160 characters." },
      { type: "text", name: "keywords", label: "Keywords (comma separated)" },
      { type: "media", name: "ogImage", label: "Social share image (1200×630)", accept: "image" },
      { type: "boolean", name: "noindex", label: "Hide from search engines (noindex)" },
    ],
  },
  {
    key: "theme",
    title: "Theme & Fonts",
    group: "Settings",
    fields: [
      { type: "color", name: "primary", label: "Primary color (buttons, highlights)" },
      { type: "color", name: "primaryForeground", label: "Text on primary color" },
      { type: "color", name: "secondary", label: "Secondary color (dark sections, footer)" },
      { type: "color", name: "accent", label: "Accent color" },
      { type: "color", name: "surface", label: "Page background" },
      { type: "color", name: "surfaceAlt", label: "Alternate section background" },
      { type: "color", name: "ink", label: "Main text color" },
      { type: "color", name: "muted", label: "Muted text color" },
      { type: "color", name: "heading", label: "Section heading color" },
      { type: "color", name: "navText", label: "Menu text color", help: "Leave empty to use the main text color." },
      { type: "font", name: "headingFont", label: "Heading font", help: "Any Google Font name works." },
      { type: "font", name: "bodyFont", label: "Body font" },
      {
        type: "select",
        name: "radius",
        label: "Corner roundness",
        options: [
          { value: "none", label: "Sharp" },
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
          { value: "lg", label: "Large" },
          { value: "xl", label: "Extra large" },
        ],
      },
    ],
  },
  {
    key: "emailAlerts",
    title: "Email Alerts",
    group: "Settings",
    description: "Every enquiry is emailed to these addresses after it's saved. Replying to the email replies to the visitor.",
    fields: [
      {
        type: "boolean",
        name: "enabled",
        label: "Email each new enquiry",
        help: "Needs RESEND_API_KEY in the server environment.",
      },
      { type: "text", name: "notifyEmails", label: "Send to (comma separated)" },
    ],
  },
  {
    key: "whatsapp",
    title: "WhatsApp",
    group: "Settings",
    description:
      "Numbers in international format without + or spaces, e.g. 919876543210. Template placeholders: {project} {name} {phone} {email} {interest} {message}",
    fields: [
      {
        type: "boolean",
        name: "autoSend",
        label: "Send enquiry automatically via WhatsApp Cloud API",
        help: "Needs WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID in the server environment.",
      },
      { type: "text", name: "notifyNumbers", label: "Notify numbers (comma separated)" },
      {
        type: "boolean",
        name: "redirectAfterSubmit",
        label: "Open WhatsApp chat after form submit",
        help: "Opens WhatsApp with the enquiry pre-filled so the visitor sends it to you. Works without any API setup.",
      },
      { type: "text", name: "redirectNumber", label: "WhatsApp number for the chat" },
      { type: "textarea", name: "messageTemplate", label: "Enquiry message template" },
      { type: "boolean", name: "floatingButton", label: "Show floating WhatsApp button" },
      { type: "text", name: "floatingNumber", label: "Floating button number" },
      { type: "textarea", name: "floatingMessage", label: "Floating button pre-filled message" },
      { type: "boolean", name: "chatBubble", label: "Show chat greeting bubble" },
      { type: "text", name: "chatName", label: "Chat agent name" },
      { type: "media", name: "chatPhoto", label: "Chat agent photo", accept: "image" },
      { type: "text", name: "chatGreeting", label: "Chat greeting" },
    ],
  },
  {
    key: "tracking",
    title: "Tracking & Pixels",
    group: "Settings",
    description: "Lead submissions fire generate_lead (Google) and Lead (Meta) events automatically.",
    fields: [
      { type: "text", name: "gaId", label: "Google Analytics 4 ID (G-XXXX)" },
      { type: "text", name: "gtmId", label: "Google Tag Manager ID (GTM-XXXX)" },
      { type: "text", name: "metaPixelId", label: "Meta (Facebook) Pixel ID" },
    ],
  },
  {
    key: "layout",
    title: "Section Order",
    group: "Settings",
    description: "Reorder, show or hide page sections.",
    fields: [
      {
        type: "list",
        name: "sections",
        label: "Sections",
        itemLabel: "key",
        fields: [
          { type: "select", name: "key", label: "Section", options: SECTION_OPTIONS },
          { type: "boolean", name: "enabled", label: "Visible" },
        ],
      },
    ],
  },
  {
    key: "nav",
    title: "Navigation",
    group: "Settings",
    fields: [
      {
        type: "list",
        name: "links",
        label: "Menu links",
        itemLabel: "label",
        help: "Use #sectionKey to scroll to a section, e.g. #pricing",
        fields: [
          { type: "text", name: "label", label: "Label" },
          { type: "text", name: "href", label: "Link" },
        ],
      },
      { type: "text", name: "ctaLabel", label: "Header button label" },
    ],
  },
  {
    key: "form",
    title: "Enquiry Form",
    group: "Settings",
    description: "Name and mobile number are always asked.",
    fields: [
      { type: "text", name: "defaultCountryCode", label: "Default country code", help: "e.g. +91" },
      { type: "boolean", name: "showEmail", label: "Ask for email" },
      { type: "boolean", name: "showInterest", label: "Ask “Interested in” (configuration)" },
      { type: "boolean", name: "showMessage", label: "Ask for message (contact section only)" },
      { type: "boolean", name: "consentRequired", label: "Consent checkbox must be ticked" },
      {
        type: "list",
        name: "interestOptions",
        label: "“Interested in” options",
        itemLabel: "label",
        fields: [{ type: "text", name: "label", label: "Option" }],
      },
      { type: "text", name: "submitLabel", label: "Submit button label" },
      { type: "textarea", name: "consentText", label: "Consent text" },
      { type: "text", name: "successTitle", label: "Success title" },
      { type: "textarea", name: "successMessage", label: "Success message" },
      { type: "boolean", name: "redirectToThankYou", label: "Redirect to /thank-you page after submit (for ad conversion tracking)" },
    ],
  },
  {
    key: "brochure",
    title: "Brochure",
    group: "Settings",
    description: "The brochure opens only after the visitor submits the form.",
    fields: [
      { type: "boolean", name: "enabled", label: "Show brochure button" },
      { type: "text", name: "label", label: "Button label" },
      { type: "media", name: "file", label: "Brochure file (PDF)", accept: "file" },
    ],
  },
  {
    key: "popup",
    title: "Enquiry Popup",
    group: "Settings",
    fields: [
      { type: "boolean", name: "enabled", label: "Auto-open popup" },
      { type: "number", name: "delaySeconds", label: "Open after (seconds)" },
      { type: "text", name: "title", label: "Title" },
      { type: "textarea", name: "subtitle", label: "Subtitle" },
      { type: "media", name: "image", label: "Side image", accept: "image" },
    ],
  },
  {
    key: "footer",
    title: "Footer",
    group: "Settings",
    fields: [
      { type: "color", name: "textColor", label: "Footer text color", help: "Leave empty to use the muted text color." },
      { type: "textarea", name: "about", label: "About text" },
      { type: "textarea", name: "reraNote", label: "RERA note" },
      { type: "textarea", name: "advertiser", label: "Authorised advertiser / channel partner line" },
      { type: "textarea", name: "disclaimer", label: "Disclaimer" },
      { type: "text", name: "copyright", label: "Copyright" },
      {
        type: "list",
        name: "social",
        label: "Social links",
        itemLabel: "platform",
        fields: [
          { type: "text", name: "platform", label: "Platform" },
          { type: "url", name: "url", label: "URL" },
        ],
      },
    ],
  },
  {
    key: "privacy",
    title: "Privacy Policy",
    group: "Settings",
    fields: [
      { type: "text", name: "title", label: "Title" },
      { type: "textarea", name: "body", label: "Content", help: "Blank lines start a new paragraph." },
    ],
  },

  // ---------------- Page sections ----------------
  {
    key: "hero",
    title: "Hero / Banner",
    group: "Page Sections",
    fields: [
      {
        type: "select",
        name: "layout",
        label: "Layout",
        options: [
          { value: "split", label: "Image slider + info panel (side by side)" },
          { value: "fullscreen", label: "Full-screen background" },
        ],
      },
      {
        type: "list",
        name: "images",
        label: "Slider images (split layout)",
        itemLabel: "image",
        fields: [{ type: "media", name: "image", label: "Image", accept: "image" }],
      },
      { type: "text", name: "eyebrow", label: "Small text above title" },
      { type: "text", name: "title", label: "Title (project name)" },
      { type: "textarea", name: "subtitle", label: "Subtitle (e.g. By Developer)" },
      { type: "text", name: "configText", label: "Configuration text (e.g. Luxurious 2, 3 & 4 BHK)" },
      {
        type: "select",
        name: "mediaType",
        label: "Background type",
        options: [
          { value: "image", label: "Image" },
          { value: "video", label: "Video" },
        ],
      },
      { type: "media", name: "image", label: "Background image (full-screen layout / video poster)", accept: "image" },
      { type: "media", name: "video", label: "Background video (MP4)", accept: "video" },
      { type: "number", name: "overlayOpacity", label: "Dark overlay (0–100)" },
      { type: "text", name: "priceTag", label: "Price tag" },
      { type: "text", name: "offerTitle", label: "Offer box title" },
      {
        type: "list",
        name: "offers",
        label: "Offers",
        itemLabel: "text",
        fields: [{ type: "text", name: "text", label: "Offer" }],
      },
      { type: "text", name: "ctaLabel", label: "Button label" },
      { type: "boolean", name: "showForm", label: "Show enquiry form in banner" },
      { type: "text", name: "formTitle", label: "Form title" },
      {
        type: "list",
        name: "badges",
        label: "Badges",
        itemLabel: "text",
        fields: [{ type: "text", name: "text", label: "Text" }],
      },
    ],
  },
  {
    key: "about",
    title: "About / Overview",
    group: "Page Sections",
    fields: [
      ...sectionHeader,
      { type: "textarea", name: "body", label: "Description", help: "Blank lines start a new paragraph." },
      { type: "media", name: "image", label: "Image", accept: "image" },
      {
        type: "list",
        name: "stats",
        label: "Stats",
        itemLabel: "label",
        fields: [
          { type: "text", name: "value", label: "Value" },
          { type: "text", name: "label", label: "Label" },
        ],
      },
    ],
  },
  {
    key: "highlights",
    title: "Highlights",
    group: "Page Sections",
    fields: [
      ...sectionHeader,
      {
        type: "list",
        name: "items",
        label: "Highlights",
        itemLabel: "title",
        fields: [
          { type: "text", name: "title", label: "Title" },
          { type: "textarea", name: "description", label: "Description (optional)" },
        ],
      },
      { type: "media", name: "image", label: "Image", accept: "image" },
      { type: "text", name: "ctaLabel", label: "Button label" },
    ],
  },
  {
    key: "pricing",
    title: "Pricing",
    group: "Page Sections",
    fields: [
      ...sectionHeader,
      {
        type: "list",
        name: "items",
        label: "Configurations",
        itemLabel: "type",
        fields: [
          { type: "text", name: "type", label: "Type (e.g. 3 BHK)" },
          { type: "text", name: "area", label: "Area" },
          { type: "text", name: "price", label: "Price" },
          { type: "media", name: "image", label: "Plan image (shown blurred)", accept: "image" },
        ],
      },
      { type: "text", name: "priceSheetLabel", label: "Price sheet row label" },
      { type: "text", name: "ctaLabel", label: "Button label" },
      { type: "textarea", name: "note", label: "Note below table" },
    ],
  },
  {
    key: "amenities",
    title: "Amenities",
    group: "Page Sections",
    fields: [
      ...sectionHeader,
      {
        type: "textarea",
        name: "description",
        label: "Description",
        help: "Shown beside the slider on layouts with text on the side (e.g. Mahindra Vista).",
      },
      {
        type: "list",
        name: "items",
        label: "Amenities",
        itemLabel: "title",
        fields: [
          { type: "text", name: "title", label: "Name" },
          { type: "media", name: "image", label: "Image", accept: "image" },
          { type: "text", name: "icon", label: "Icon (emoji, used when no image)" },
        ],
      },
      { type: "text", name: "ctaLabel", label: "Button label (opens form)" },
    ],
  },
  {
    key: "gallery",
    title: "Gallery",
    group: "Page Sections",
    fields: [
      ...sectionHeader,
      {
        type: "list",
        name: "images",
        label: "Images",
        itemLabel: "caption",
        fields: [
          { type: "media", name: "image", label: "Image", accept: "image" },
          { type: "text", name: "caption", label: "Caption" },
        ],
      },
      { type: "text", name: "ctaLabel", label: "Button label (opens form)" },
    ],
  },
  {
    key: "floorPlans",
    title: "Floor Plans",
    group: "Page Sections",
    fields: [
      ...sectionHeader,
      { type: "boolean", name: "lockBehindForm", label: "Blur plans until visitor submits the form" },
      { type: "text", name: "ctaLabel", label: "Button label (opens form)" },
      {
        type: "list",
        name: "items",
        label: "Plans",
        itemLabel: "title",
        help: "Plans are grouped into tabs by category (e.g. Master Plan, Floor Plan, Unit Plan).",
        fields: [
          { type: "text", name: "category", label: "Category / tab" },
          { type: "text", name: "title", label: "Title" },
          { type: "text", name: "area", label: "Area" },
          { type: "media", name: "image", label: "Plan image", accept: "image" },
        ],
      },
    ],
  },
  {
    key: "location",
    title: "Location",
    group: "Page Sections",
    fields: [
      ...sectionHeader,
      {
        type: "url",
        name: "mapEmbedUrl",
        label: "Google Maps embed URL",
        help: "Google Maps → Share → Embed a map → copy the src=\"…\" URL.",
      },
      { type: "media", name: "image", label: "Location map image (shown instead of embed if set)", accept: "image" },
      {
        type: "list",
        name: "nearby",
        label: "Nearby places",
        itemLabel: "place",
        help: "Grouped into tabs by category (e.g. Connectivity, Education Hub, Healthcare, Retail).",
        fields: [
          { type: "text", name: "category", label: "Category / tab" },
          { type: "text", name: "place", label: "Place" },
          { type: "text", name: "distance", label: "Distance / time" },
        ],
      },
      { type: "text", name: "ctaLabel", label: "Button label (opens form)" },
    ],
  },
  {
    key: "virtualTour",
    title: "Virtual Tour",
    group: "Page Sections",
    fields: [
      { type: "text", name: "title", label: "Title" },
      { type: "textarea", name: "subtitle", label: "Subtitle" },
      { type: "media", name: "image", label: "Cover image", accept: "image" },
      {
        type: "url",
        name: "videoUrl",
        label: "YouTube / video URL (optional)",
        help: "Plays after the visitor submits the form. Leave empty to only collect tour requests.",
      },
      { type: "text", name: "ctaLabel", label: "Button label" },
    ],
  },
  {
    key: "emi",
    title: "EMI Calculator",
    group: "Page Sections",
    fields: [
      { type: "text", name: "title", label: "Title" },
      { type: "textarea", name: "subtitle", label: "Subtitle" },
      { type: "number", name: "defaultAmount", label: "Default loan amount (₹)" },
      { type: "number", name: "defaultRate", label: "Default interest rate (% p.a.)" },
      { type: "number", name: "defaultTenure", label: "Default tenure (years)" },
      { type: "text", name: "ctaLabel", label: "Button label (opens form)" },
      { type: "textarea", name: "disclaimer", label: "Disclaimer" },
    ],
  },
  {
    key: "developer",
    title: "Developer",
    group: "Page Sections",
    fields: [
      { type: "text", name: "title", label: "Section title" },
      { type: "text", name: "name", label: "Developer name" },
      { type: "media", name: "logo", label: "Developer logo", accept: "image" },
      { type: "textarea", name: "description", label: "Description" },
      { type: "url", name: "readMoreUrl", label: "“Read more” link (optional)" },
      {
        type: "list",
        name: "stats",
        label: "Stats",
        itemLabel: "label",
        fields: [
          { type: "text", name: "value", label: "Value" },
          { type: "text", name: "label", label: "Label" },
        ],
      },
    ],
  },
  {
    key: "faq",
    title: "FAQ",
    group: "Page Sections",
    fields: [
      { type: "text", name: "title", label: "Title" },
      {
        type: "list",
        name: "items",
        label: "Questions",
        itemLabel: "question",
        fields: [
          { type: "text", name: "question", label: "Question" },
          { type: "textarea", name: "answer", label: "Answer" },
        ],
      },
    ],
  },
  {
    key: "contact",
    title: "Contact Section",
    group: "Page Sections",
    fields: [
      { type: "text", name: "title", label: "Title" },
      { type: "textarea", name: "subtitle", label: "Subtitle" },
      { type: "text", name: "formTitle", label: "Form title" },
    ],
  },
];

export function getEditorPage(key: string) {
  return editorPages.find((p) => p.key === key);
}
