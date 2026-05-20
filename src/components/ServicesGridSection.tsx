import { ServicePackageCard } from "@/components/ServicePackageCard";
import { siteConfig } from "@/lib/site";

type ServicesGridSectionProps = {
  className?: string;
};

export function ServicesGridSection({ className = "" }: ServicesGridSectionProps) {
  const { title, subtitle, items } = siteConfig.servicesSection;

  return (
    <section id="dich-vu" className={`scroll-mt-24 py-12 ${className}`.trim()}>
      <h2 className="text-2xl font-bold text-[var(--hc-text)] sm:text-3xl">{title}</h2>
      <p className="mt-2 text-[var(--hc-text-muted)]">{subtitle}</p>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
