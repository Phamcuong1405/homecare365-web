import Link from "next/link";
import { ConsultationForm } from "@/components/ConsultationForm";
import { siteConfig } from "@/lib/site";

const services = [
  {
    title: "Dọn dẹp tổng thể",
    desc: "Lau chùi, hút bụi, vệ sinh phòng khách, bếp, phòng ngủ — nhà sạch từng góc.",
  },
  {
    title: "Sắp xếp gọn gàng",
    desc: "Phân loại đồ đạc, tối ưu không gian — căn nhà ngăn nắp, dễ sinh hoạt.",
  },
  {
    title: "Gói định kỳ 365 ngày",
    desc: "Đặt lịch theo tuần/tháng — bạn bận đến mấy vẫn có nhà sạch, thư giãn mỗi ngày.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafb] text-slate-800">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_50%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white">
            HC
          </span>
          <span className="text-lg font-bold text-slate-900">{siteConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
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
        <section className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
          <div className="max-w-xl">
            <p className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-2xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-600/35 sm:text-base">
              <span>{siteConfig.domain}</span>
              <span className="text-emerald-100">·</span>
              <span>{siteConfig.tagline}</span>
            </p>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700 sm:text-base">
              Bận đến mấy
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
              Bạn vẫn xứng đáng sống trong một căn nhà{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                sạch sẽ
              </span>
            </h1>

            <p className="mt-6 text-2xl font-black uppercase tracking-tight text-emerald-600 sm:text-3xl">
              HomeCare365
            </p>
            <p className="mt-2 text-lg font-semibold leading-snug text-slate-800 sm:text-xl">
              Lo toàn bộ việc dọn dẹp và sắp xếp cho bạn
            </p>
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-bold text-emerald-900 sm:text-lg">
              Sạch nhà · Gọn gàng · Thư giãn mỗi ngày
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#dat-lich-tu-van"
                className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500"
              >
                Đăng ký tư vấn
              </a>
            </div>
          </div>

          <ConsultationForm />
        </section>

        <section id="dich-vu" className="py-12">
          <h2 className="text-2xl font-bold text-slate-900">Dịch vụ nổi bật</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {services.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
              >
                <div className="mb-3 h-1 w-10 rounded-full bg-emerald-500" />
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="lien-he" className="mt-8 rounded-2xl bg-emerald-700 px-6 py-10 text-white sm:px-10">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Liên hệ HomeCare365</h2>
              <p className="mt-2 text-emerald-100">Website chính thức: https://{siteConfig.domain}</p>
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
