import Link from "next/link";
import { ConsultationForm } from "@/components/ConsultationForm";
import { siteConfig } from "@/lib/site";

const services = [
  {
    title: "Chăm sóc người cao tuổi",
    desc: "Hỗ trợ sinh hoạt, theo dõi thuốc, đồng hành an toàn tại nhà.",
  },
  {
    title: "Điều dưỡng tại nhà",
    desc: "Y tá, điều dưỡng viên có chứng chỉ, linh hoạt ca ngày/đêm.",
  },
  {
    title: "Phục hồi chức năng",
    desc: "Tập vật lý trị liệu, theo dõi tiến độ qua báo cáo định kỳ.",
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
          <div>
            <p className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              {siteConfig.domain} · Chăm sóc 365 ngày
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Chăm sóc sức khỏe tại nhà — an tâm mỗi ngày
            </h1>
            <p className="mt-5 text-lg text-slate-600">{siteConfig.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#dat-lich-tu-van"
                className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500"
              >
                Đăng ký tư vấn
              </a>
              <span className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700">
                https://{siteConfig.domain}
              </span>
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
