import { cn } from "@/lib/utils";

// "View Plans / View Prices" outline buttons that jump between the two sections.
export function PlanPriceSwitch({ active }: { active: "plans" | "prices" }) {
  const btn = (on: boolean) =>
    cn(
      "border border-primary px-4 py-2 text-xs font-medium transition hover:bg-primary hover:text-primary-fg",
      on ? "bg-primary text-primary-fg" : "text-primary",
    );
  return (
    <div className="mt-6 flex gap-3">
      <a href="#floorPlans" className={btn(active === "plans")}>
        View Plans
      </a>
      <a href="#pricing" className={btn(active === "prices")}>
        View Prices
      </a>
    </div>
  );
}

/** Left-hand column used by Plans and Prices: title, text and the switch. */
export function SideIntro({
  title,
  subtitle,
  description,
  active,
}: {
  title: string;
  subtitle?: string;
  description?: string;
  active: "plans" | "prices";
}) {
  return (
    <div>
      {subtitle && <p className="eyebrow">{subtitle}</p>}
      <h2 className="font-heading text-2xl text-heading md:text-3xl">{title}</h2>
      {description && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">{description}</p>}
      <PlanPriceSwitch active={active} />
    </div>
  );
}
