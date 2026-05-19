import Link from "next/link";
import { ConsultationForm } from "@/components/ConsultationForm";
import { ServiceVideoSection } from "@/components/ServiceVideoSection";
import { phoneTelHref, siteConfig } from "@/lib/site";

const services = [
  {
    title: "Dọn dẹp tổng thể",
    desc: "Lau chùi, hút bụi, vệ sinh phòng khách, bếp, phòng ngủ theo tiêu chuẩn.",
  },
  {
    title: "Sắp xếp không gian",
    desc: "Gọn gàng tủ đồ, bếp, bàn làm việc — nhà ngăn nắp, dễ sinh hoạt.",
  },
  {
    title: "Gói định kỳ 365 ngày",
    desc: "Đặt lịch cố định theo tuần/tháng, đội ngũ quen nhà bạn, ổn định lâu dài.",
  },
];

export default function HomePage() {
  return (
    <div className="hc-page-bg text-[var(--hc-text)]">
      <header className="hc-header-glass sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl hc-btn-primary text-sm font-bold text-white">
              HC
            </span>
            <span className="text-lg font-bold tracking-tight text-[var(--hc-text)]">{siteConfig.name}</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--hc-text-muted)] sm:flex">
            <a href="#video-gioi-thieu" className="transition hover:text-[var(--hc-primary)]">
              Giới thiệu
            </a>
            <a href="#dich-vu" className="transition hover:text-[var(--hc-primary)]">
              Dịch vụ
            </a>
            <a href="#lien-he" className="transition hover:text-[var(--hc-primary)]">
              Liên hệ
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
        <section className="grid items-start gap-10 py-10 lg:grid-cols-2 lg:py-16">
          <div className="space-y-5">
            <p className="hc-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide">
              <span className="hc-badge-dot h-2 w-2 animate-pulse rounded-full" />
              {siteConfig.domain} · {siteConfig.tagline}
            </p>

            <div className="space-y-2">
              <p className="text-3xl font-extrabold uppercase leading-none tracking-tight text-[var(--hc-text)] sm:text-4xl lg:text-5xl">
                Bận đến mấy
              </p>
              <h1 className="text-xl font-semibold leading-snug text-[var(--hc-text-muted)] sm:text-2xl lg:text-[1.65rem] lg:leading-snug">
                Bạn vẫn xứng đáng sống trong một căn nhà{" "}
                <span className="hc-highlight-word">sạch sẽ</span>
              </h1>
            </div>

            <div className="hc-accent-bar py-1">
              <p className="text-2xl font-extrabold tracking-tight hc-text-gradient sm:text-3xl">
                {siteConfig.name}
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--hc-text)] sm:text-lg">
                Lo toàn bộ việc dọn dẹp và sắp xếp cho bạn
              </p>
            </div>

            <p className="hc-slogan text-lg font-bold uppercase sm:text-xl">
              Sạch nhà · Gọn gàng · Thư giãn mỗi ngày
            </p>

            <p className="max-w-lg text-base leading-relaxed text-[var(--hc-text-muted)]">
              {siteConfig.description}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#dat-lich-tu-van"
                className="rounded-xl hc-btn-primary px-6 py-3 text-sm font-bold text-white"
              >
                Đặt lịch dọn dẹp
              </a>
              <a href="#dich-vu" className="hc-btn-secondary rounded-xl px-6 py-3 text-sm font-semibold">
                Xem dịch vụ
              </a>
            </div>
          </div>

          <ConsultationForm />
        </section>

        <ServiceVideoSection />

        <section id="dich-vu" className="py-12">
          <h2 className="text-2xl font-bold text-[var(--hc-text)]">Dịch vụ nổi bật</h2>
          <p className="mt-2 text-[var(--hc-text-muted)]">
            Giải pháp dọn dẹp & sắp xếp tại nhà theo nhu cầu của bạn.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {services.map((item) => (
              <article key={item.title} className="hc-card rounded-2xl p-5">
                <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-[var(--hc-brand-light)] to-[var(--hc-brand)]" />
                <h3 className="font-bold text-[var(--hc-text)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--hc-text-muted)]">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="lien-he" className="hc-contact-band mt-8 rounded-2xl px-6 py-10 text-white sm:px-10">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Liên hệ {siteConfig.name}</h2>
              <p className="mt-2 font-medium text-white/90">Sạch nhà — Gọn gàng — Thư giãn mỗi ngày</p>
              <p className="mt-1 text-sm text-white/80">https://{siteConfig.domain}</p>
            </div>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <strong className="text-white">Hotline:</strong>{" "}
                <a href={phoneTelHref(siteConfig.contact.phone)} className="font-medium underline hover:text-white">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <strong className="text-white">Email:</strong>{" "}
                <a href={`mailto:${siteConfig.contact.email}`} className="underline">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <strong className="text-white">Khu vực:</strong> {siteConfig.contact.address}
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
