import { AboutBrandSection } from "@/components/ServiceVideoSection";
import { ConsultationForm } from "@/components/ConsultationForm";
import { HeaderBrand } from "@/components/HeaderBrand";
import { ServicePackageCard } from "@/components/ServicePackageCard";
import { phoneTelHref, siteConfig } from "@/lib/site";

export default function HomePage() {
  const { hero, servicesSection, benefitsSection, reviewsSection, finalCta } = siteConfig;

  return (
    <div className="hc-page-bg text-[var(--hc-text)]">
      <header className="hc-header-glass sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <HeaderBrand />
          <nav className="hidden items-center gap-5 text-sm font-medium lg:flex">
            <a href="#gioi-thieu" className="hc-link-brand">
              Giới thiệu
            </a>
            <a href="#dich-vu" className="hc-link-brand">
              Dịch vụ
            </a>
            <a href="#loi-ich" className="hc-link-brand">
              Lợi ích
            </a>
            <a href="#danh-gia" className="hc-link-brand">
              Đánh giá
            </a>
            <a
              href={phoneTelHref(siteConfig.contact.phone)}
              className="rounded-lg hc-btn-primary px-4 py-2 font-semibold text-white"
            >
              Gọi ngay
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-16">
        {/* HERO */}
        <section className="grid items-start gap-10 py-10 lg:grid-cols-2 lg:py-16">
          <div className="space-y-5">
            <p className="hc-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide">
              <span className="hc-badge-dot h-2 w-2 animate-pulse rounded-full" />
              {siteConfig.domain} · {siteConfig.brand.slogan}
            </p>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--hc-text)] sm:text-4xl lg:text-[2.35rem] lg:leading-tight">
              {hero.headline}
            </h1>

            <div className="space-y-2 text-base leading-relaxed text-[var(--hc-text-muted)] sm:text-lg">
              {hero.subheadline.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="space-y-1 text-sm leading-relaxed text-[var(--hc-text-muted)]">
              {hero.shortDesc.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              {hero.ctas.map((cta) => (
                <a
                  key={cta.label}
                  href={cta.href}
                  className={
                    cta.primary
                      ? "rounded-xl hc-btn-primary px-5 py-3 text-sm font-bold text-white"
                      : "hc-btn-secondary rounded-xl px-5 py-3 text-sm font-semibold"
                  }
                >
                  {cta.label}
                </a>
              ))}
            </div>

            <ul className="grid gap-2 pt-2 sm:grid-cols-2">
              {hero.trustBadges.map((badge) => (
                <li
                  key={badge}
                  className="flex items-center gap-2 text-sm font-semibold text-[var(--hc-text)]"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs text-white"
                    style={{ background: "var(--hc-gradient-brand)" }}
                  >
                    ✓
                  </span>
                  {badge}
                </li>
              ))}
            </ul>
          </div>

          <div id="dat-lich-tu-van" className="scroll-mt-28">
            <ConsultationForm />
          </div>
        </section>

        <AboutBrandSection />

        {/* DỊCH VỤ */}
        <section id="dich-vu" className="scroll-mt-24 py-12">
          <h2 className="text-2xl font-bold text-[var(--hc-text)] sm:text-3xl">{servicesSection.title}</h2>
          <p className="mt-2 text-[var(--hc-text-muted)]">{servicesSection.subtitle}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesSection.items.map((item) => (
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

        {/* LỢI ÍCH */}
        <section id="loi-ich" className="scroll-mt-24 py-12">
          <h2 className="text-2xl font-bold text-[var(--hc-text)] sm:text-3xl">{benefitsSection.title}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefitsSection.items.map((item) => (
              <article key={item.title} className="hc-card rounded-2xl p-5">
                <p className="text-2xl">{item.icon}</p>
                <h3 className="mt-2 font-bold text-[var(--hc-text)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--hc-text-muted)]">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ĐÁNH GIÁ */}
        <section id="danh-gia" className="scroll-mt-24 py-12">
          <h2 className="text-2xl font-bold text-[var(--hc-text)] sm:text-3xl">{reviewsSection.title}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {reviewsSection.items.map((quote, i) => (
              <blockquote key={i} className="hc-card rounded-2xl p-6">
                <p className="text-sm leading-relaxed text-[var(--hc-text-muted)]">&ldquo;{quote}&rdquo;</p>
              </blockquote>
            ))}
          </div>
        </section>

        {/* CTA CUỐI */}
        <section className="hc-contact-band mt-4 rounded-2xl px-6 py-10 text-white sm:px-10">
          <h2 className="text-2xl font-bold sm:text-3xl">{finalCta.title}</h2>
          <div className="mt-3 max-w-2xl space-y-2 text-white/90">
            {finalCta.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {finalCta.ctas.map((cta) => (
              <a
                key={cta.label}
                href={cta.href}
                className={
                  cta.primary
                    ? "rounded-xl bg-white px-6 py-3 text-sm font-bold text-[var(--hc-brand-blue)] shadow-md hover:bg-white/95"
                    : "rounded-xl border-2 border-white/80 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                }
              >
                {cta.label}
              </a>
            ))}
          </div>
        </section>

        {/* LIÊN HỆ */}
        <section id="lien-he" className="hc-card mt-8 rounded-2xl px-6 py-10 sm:px-10">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-[var(--hc-text)]">Liên hệ {siteConfig.name}</h2>
              <p className="mt-2 text-[var(--hc-text-muted)]">{siteConfig.brand.headerMotto}</p>
              <p className="mt-1 text-sm text-[var(--hc-text-muted)]">https://{siteConfig.domain}</p>
            </div>
            <ul className="space-y-2 text-sm text-[var(--hc-text-muted)]">
              <li>
                <strong className="text-[var(--hc-text)]">Hotline:</strong>{" "}
                <a
                  href={phoneTelHref(siteConfig.contact.phone)}
                  className="font-medium text-[var(--hc-brand-blue)] underline"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <strong className="text-[var(--hc-text)]">Email:</strong>{" "}
                <a href={`mailto:${siteConfig.contact.email}`} className="text-[var(--hc-brand-blue)] underline">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <strong className="text-[var(--hc-text)]">Khu vực:</strong> {siteConfig.contact.address}
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="hc-footer relative z-10 py-6 text-center text-xs text-[var(--hc-text-muted)]">
        © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.domain} · App iOS & Android (sắp ra mắt)
      </footer>
    </div>
  );
}
