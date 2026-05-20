import { ServicePackageCard } from "@/components/ServicePackageCard";
import { siteConfig } from "@/lib/site";

type ServicesGridSectionProps = {
  compact?: boolean;
  className?: string;
};

export function ServicesGridSection({ compact = false, className = "" }: ServicesGridSectionProps) {
  const { title, subtitle, items } = siteConfig.servicesSection;

  return (
    <section
      id="dich-vu"
      className={`scroll-mt-24 ${compact ? "" : "py-12"} ${className}`.trim()}
    >
      <h2 className={`font-bold text-[var(--hc-text)] ${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>
        {title}
      </h2>
      <p className={`mt-2 text-[var(--hc-text-muted)] ${compact ? "text-sm" : ""}`}>{subtitle}</p>
      <div
        className={`mt-4 grid gap-4 ${compact ? "grid-cols-1" : "mt-6 gap-6 sm:grid-cols-2 lg:grid-cols-3"}`}
      >
        {items.map((item) => (
          <ServicePackageCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            desc={item.desc}
            videoSrc={"videoSrc" in item ? (item.videoSrc as string) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
