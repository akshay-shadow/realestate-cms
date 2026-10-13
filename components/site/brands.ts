import type { SectionKey, SiteContent } from "@/lib/content/types";
import { lodhaBellevue } from "./lodha-bellevue";
import { mahindraVista } from "./mahindra-vista";

// Site slug (sites.slug in Supabase) -> brand folder in components/site/<slug>.
// A slug without an entry uses the shared design.
const BRANDS: Record<string, Brand> = {
  "mahindra-vista": mahindraVista,
  "lodha-bellevue": lodhaBellevue,
};

export function getBrand(slug: string): Brand {
  return BRANDS[slug] ?? {};
}

export type DeepPartial<T> = T extends (infer U)[] ? U[] : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export type SiteComponent = (props: { content: SiteContent }) => React.ReactNode;

/**
 * A client's folder, components/site/<slug>/. Anything left out falls back to
 * the shared version in components/site.
 */
export interface Brand {
  /** Starting content for this brand (theme, section order, texts). Values saved in the admin still win. */
  defaults?: DeepPartial<SiteContent>;
  /** Brand-specific designs that replace shared sections. */
  sections?: Partial<Record<SectionKey, SiteComponent>>;
  Header?: SiteComponent;
  Footer?: SiteComponent;
}
