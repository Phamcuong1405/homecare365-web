import Link from "next/link";
import { ConsultationForm } from "@/components/ConsultationForm";
import { ServiceVideoSection } from "@/components/ServiceVideoSection";
import { siteConfig } from "@/lib/site";

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
    <div className="min-h-screen bg-[#f8fafb] text-slate-800">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.14),transparent_55%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
            HC
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">{siteConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
          <a href="#video-gioi-thieu" className="hover:text-emerald-700">
            Giới thiệu
          </a>
          <a href="#dich-vu" className="hover:text-emerald-700">
            Dịch vụ
          </a>
          <a href="#lien-he" className="hover:text-emerald-700">
            Liên hệ
          </a>
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500"
          >
            Gọi ngay
          </a>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-16">
        <section className="grid items-start gap-10 py-10 lg:grid-cols-2 lg:py-16">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-500 bg-emerald-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-emerald-800 shadow-sm shadow-emerald-200/60">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              {siteConfig.domain} · {siteConfig.tagline}
            </p>

            <div className="space-y-2">
              <p className="text-3xl font-extrabold uppercase leading-none tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Bận đến mấy
              </p>
              <h1 className="text-xl font-semibold leading-snug text-slate-700 sm:text-2xl lg:text-[1.65rem] lg:leading-snug">
                Bạn vẫn xứng đáng sống trong một căn nhà{" "}
                <span className="font-bold text-emerald-700">sạch sẽ</span>
              </h1>
            </div>

            <div className="border-l-4 border-emerald-600 py-1 pl-4">
              <p className="text-2xl font-extrabold tracking-tight text-emerald-700 sm:text-3xl">
                {siteConfig.name}
              </p>
              <p className="mt-1 text-base font-semibold text-slate-800 sm:text-lg">
                Lo toàn bộ việc dọn dẹp và sắp xếp cho bạn
              </p>
            </div>

            <p className="text-lg font-bold uppercase tracking-wide text-emerald-600 sm:text-xl">
              Sạch nhà · Gọn gàng · Thư giãn mỗi ngày
            </p>

            <p className="max-w-lg text-base leading-relaxed text-slate-600">{siteConfig.description}</p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#dat-lich-tu-van"
                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500"
              >
                Đặt lịch dọn dẹp
              </a>
              <a
                href="#dich-vu"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-400"
              >
                Xem dịch vụ
              </a>
            </div>
          </div>

          <ConsultationForm />
        </section>

        <ServiceVideoSection />

        <section id="dich-vu" className="py-12">
          <h2 className="text-2xl font-bold text-slate-900">Dịch vụ nổi bật</h2>
          <p className="mt-2 text-slate-600">Giải pháp dọn dẹp & sắp xếp tại nhà theo nhu cầu của bạn.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {services.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
              >
                <div className="mb-3 h-1 w-10 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="lien-he" className="mt-8 rounded-2xl bg-emerald-700 px-6 py-10 text-white sm:px-10">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Liên hệ {siteConfig.name}</h2>
              <p className="mt-2 font-medium text-emerald-100">
                Sạch nhà — Gọn gàng — Thư giãn mỗi ngày
              </p>
              <p className="mt-1 text-sm text-emerald-100">https://{siteConfig.domain}</p>
            </div>
            <ul className="space-y-2 text-sm text-emerald-50">
              <li>
                <strong className="text-white">Hotline:</strong> {siteConfig.contact.phone}
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

      <footer className="relative z-10 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.domain} · App iOS & Android (sắp ra mắt)
      </footer>
    </div>
  );
}
