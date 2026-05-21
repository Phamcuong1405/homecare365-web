"use client";

import Link from "next/link";

const mockBookings = [
  { id: "1", service: "Dọn nhà theo giờ", date: "22/05/2026 09:00", status: "Đang xử lý" },
  { id: "2", service: "Tổng vệ sinh", date: "15/05/2026 14:00", status: "Hoàn thành" },
];

export default function BookingsPage() {
  return (
    <div className="px-4 pt-4">
      <h1 className="text-lg font-bold">Đặt lịch của bạn</h1>
      <Link href="/m/book" className="m-btn-primary mt-4 block py-3.5 text-center text-sm">
        + Đặt lịch mới
      </Link>
      <div className="mt-6 space-y-3">
        {mockBookings.map((b) => (
          <Link key={b.id} href="/m/tracking" className="m-card block p-4">
            <p className="font-semibold">{b.service}</p>
            <p className="mt-1 text-xs text-[var(--m-muted)]">{b.date}</p>
            <span className="mt-2 inline-block rounded-full bg-[var(--m-primary)]/15 px-2 py-0.5 text-xs font-medium text-[var(--m-primary-dark)]">
              {b.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
