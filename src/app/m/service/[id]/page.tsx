"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getServiceById } from "@/lib/mobile-app-data";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const service = getServiceById(id ?? "");

  if (!service) {
    return (
      <div className="p-6 text-center">
        <p>Không tìm thấy dịch vụ</p>
        <Link href="/m/home" className="mt-4 text-[var(--m-primary)]">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--m-bg)] pb-28">
      <div className="relative h-48 bg-gradient-to-br from-[var(--m-primary)] to-[var(--m-trust)]">
        <Link href="/m/home" className="absolute left-4 top-12 rounded-full bg-white/90 px-3 py-1 text-sm">
          ←
        </Link>
        <span className="absolute bottom-6 left-6 text-6xl">{service.icon}</span>
      </div>

      <div className="px-4">
        <h1 className="mt-4 text-xl font-bold">{service.title}</h1>
        <p className="mt-2 text-sm text-[var(--m-muted)]">{service.desc}</p>

        <div className="m-card mt-4 p-4">
          <p className="text-xs font-semibold text-[var(--m-trust)]">Giá tham khảo</p>
          <p className="text-2xl font-bold text-[var(--m-primary)]">{service.priceFrom}</p>
          <p className="mt-1 text-xs text-[var(--m-muted)]">Combo & định kỳ — giá tốt hơn</p>
        </div>

        <h2 className="mt-6 text-sm font-bold">Bao gồm</h2>
        <ul className="m-card mt-2 space-y-2 p-4 text-sm">
          {service.includes.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-[var(--m-primary)]">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <h2 className="mt-6 text-sm font-bold">Đánh giá khách hàng</h2>
        <div className="m-card mt-2 p-4">
          <p className="text-amber-500">★★★★★ 4.9/5</p>
          <p className="mt-2 text-sm text-[var(--m-muted)]">
            &ldquo;Nhân viên làm cẩn thận, nhà sạch thơm — rất hài lòng!&rdquo;
          </p>
        </div>
      </div>

      <div className="m-glass fixed bottom-0 left-0 right-0 border-t p-4 pb-[calc(1rem+var(--m-safe-b))]">
        <Link
          href={`/m/book?service=${service.id}`}
          className="m-btn-primary block w-full py-4 text-center text-base font-semibold"
        >
          ĐẶT LỊCH NGAY
        </Link>
      </div>
    </div>
  );
}
