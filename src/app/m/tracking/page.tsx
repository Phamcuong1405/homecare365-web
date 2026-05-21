"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TrackingContent() {
  const params = useSearchParams();
  const isNew = params.get("new") === "1";

  return (
    <div className="min-h-dvh bg-[var(--m-bg)] px-4 pb-8 pt-4">
      <Link href="/m/home" className="text-sm text-[var(--m-trust)]">
        ← Trang chủ
      </Link>
      {isNew ? (
        <div className="m-card mt-4 border-l-4 border-[var(--m-primary)] p-4">
          <p className="font-bold text-[var(--m-primary)]">Đặt lịch thành công!</p>
          <p className="mt-1 text-sm text-[var(--m-muted)]">
            HomeCare365 sẽ liên hệ trong 24h để xác nhận.
          </p>
        </div>
      ) : null}

      <h1 className="mt-6 text-lg font-bold">Theo dõi nhân viên</h1>
      <p className="text-sm text-[var(--m-muted)]">Giống Grab — demo MVP</p>

      <div className="m-card relative mt-4 h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#e3f2fd]">
        <div className="absolute inset-0 flex items-center justify-center text-4xl">🗺️</div>
        <p className="absolute bottom-3 left-3 text-xs font-medium">ETA: ~28 phút</p>
      </div>

      <div className="m-card mt-4 flex items-center gap-4 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--m-primary)] text-2xl text-white">
          👩‍🔧
        </div>
        <div className="flex-1">
          <p className="font-semibold">Chị Lan — NV verified</p>
          <p className="text-xs text-[var(--m-muted)]">★ 4.9 · 320+ job · CCCD ✓</p>
        </div>
        <button type="button" className="rounded-full bg-[var(--m-warm)] px-3 py-2 text-xs font-semibold">
          Chat
        </button>
      </div>

      <div className="mt-6 space-y-2">
        {["Đã nhận đơn", "Đang di chuyển", "Bắt đầu làm việc", "Hoàn thành"].map((s, i) => (
          <div
            key={s}
            className={`flex items-center gap-3 rounded-xl p-3 ${
              i <= 1 ? "bg-[var(--m-primary)]/10" : "bg-white"
            }`}
          >
            <span className={i <= 1 ? "text-[var(--m-primary)]" : "text-gray-300"}>
              {i <= 1 ? "●" : "○"}
            </span>
            <span className="text-sm">{s}</span>
          </div>
        ))}
      </div>

      <Link href="/m/bookings" className="m-btn-primary mt-8 block py-4 text-center">
        Xem lịch sử đặt lịch
      </Link>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-6">Đang tải...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
