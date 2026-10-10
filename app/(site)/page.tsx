import { About } from "@/components/site/sections/About";
import { Amenities } from "@/components/site/sections/Amenities";
import { Contact } from "@/components/site/sections/Contact";
import { Developer } from "@/components/site/sections/Developer";
import { EmiCalculator } from "@/components/site/sections/EmiCalculator";
import { Faq } from "@/components/site/sections/Faq";
import { FloorPlans } from "@/components/site/sections/FloorPlans";
import { Gallery } from "@/components/site/sections/Gallery";
import { Hero } from "@/components/site/sections/Hero";
import { Highlights } from "@/components/site/sections/Highlights";
import { Location } from "@/components/site/sections/Location";
import { Pricing } from "@/components/site/sections/Pricing";
import { VirtualTour } from "@/components/site/sections/VirtualTour";
import type { SectionKey, SiteContent } from "@/lib/content/types";
import { getSite } from "@/lib/site";

export const revalidate = 3600;

const SECTIONS: Record<SectionKey, (p: { content: SiteContent }) => React.ReactNode> = {
  hero: Hero,
  about: About,
  highlights: Highlights,
  pricing: Pricing,
  amenities: Amenities,
  gallery: Gallery,
  floorPlans: FloorPlans,
  location: Location,
  virtualTour: VirtualTour,
  emi: EmiCalculator,
  developer: Developer,
  faq: Faq,
  contact: Contact,
};

export default async function HomePage() {
  const { content } = await getSite();
  return (
    <>
      {content.layout.sections
        .filter((s) => s.enabled && SECTIONS[s.key])
        .map((s) => {
          const Section = SECTIONS[s.key];
          return <Section key={s.key} content={content} />;
        })}
    </>
  );
}
