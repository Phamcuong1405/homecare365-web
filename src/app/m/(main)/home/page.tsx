"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileServiceVideoPlayer } from "@/components/mobile/MobileServiceVideoPlayer";
import {
  getQuickServiceById,
  mobileBrand,
  promos,
  quickServices,
  trustStats,
  uspBadges,
} from "@/lib/mobile-app-data";

export default function MobileHomePage() {
  const [name, setName] = useState("bạn");
  const [promoIdx, setPromoIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId ? getQuickServiceById(selectedId) : null;

  useEffect(() => {
    setName(localStorage.getItem("hc365_user_name") ?? "bạn");
    const t = setInterval(() => setPromoIdx((i) => (i + 1) % promos.length), 4000);
    return () => clearInterval(t);
  }, []);

  function handleSelectService(id: string) {
    if (selectedId === id) {
      setSelectedId(null);
      return;
    }
    setSelectedId(id);
  }

  const promo = promos[promoIdx];

  return (
    <div className="pb-4">
      <header className="m-glass sticky top-0 z-30 px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--m-primary)] text-white">
              👤
            </div>
            <div>
              <p className="text-xs text-[var(--m-muted)]">Xin chào,</p>
              <p className="font-semibold capitalize">{name}</p>
            </div>
          </div>
          <Link href="/m/notifications" className="relative text-xl">
            🔔
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white">
              2
            </span>
          </Link>
        </div>
        <p className="mt-2 truncate text-xs text-[var(--m-muted)]">📍 Hà Nội — đổi địa chỉ</p>
      </header>

      <div className="px-4">
        <div className="m-card mt-3 flex items-center gap-2 px-4 py-3">
          <span>🔍</span>
          <span className="text-sm text-[var(--m-muted)]">Bạn cần dọn gì hôm nay?</span>
        </div>

        <h2 className="mb-1 mt-6 text-sm font-bold text-[var(--m-text)]">Dịch vụ nhanh</h2>
        <p className="mb-3 text-[10px] text-[var(--m-muted)]">Chạm để xem video — chạm lại hoặc chọn mục khác để đổi</p>

        <div className="grid grid-cols-4 gap-3">
          {quickServices.map((s) => {
            const isActive = selectedId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectService(s.id)}
                className={`m-card flex flex-col items-center p-2.5 text-center transition active:scale-95 ${
                  isActive ? "m-service-chip-active" : ""
                }`}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="mt-1 line-clamp-2 text-[10px] font-medium leading-tight">{s.title}</span>
              </button>
            );
          })}
        </div>

        {selected?.videoSrc ? (
          <div className="mt-3">
            <MobileServiceVideoPlayer
              videoSrc={selected.videoSrc}
              title={selected.title}
              onClose={() => setSelectedId(null)}
            />
            <p className="mt-2 text-xs text-[var(--m-muted)]">{selected.desc}</p>
            {"jobTasks" in selected && selected.jobTasks?.length ? (
              <div className="m-card mt-3 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--m-trust)]">
                  {"jobTasksLabel" in selected && selected.jobTasksLabel
                    ? selected.jobTasksLabel
                    : "Mô tả công việc"}
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-[var(--m-text)]">
                  {selected.jobTasks.map((task) => (
                    <li key={task} className="flex gap-2">
                      <span className="text-[var(--m-primary)]">•</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-3 flex gap-2">
              <Link
                href={`/m/service/${selected.id}`}
                className="flex-1 rounded-xl border border-[var(--m-primary)] py-2.5 text-center text-xs font-semibold text-[var(--m-primary-dark)]"
              >
                Chi tiết
              </Link>
              <Link
                href={`/m/book?service=${selected.id}`}
                className="m-btn-primary flex-1 py-2.5 text-center text-xs"
              >
                Đặt lịch
              </Link>
            </div>
          </div>
        ) : null}

        <div
          className="m-card mt-6 overflow-hidden p-4 text-white"
          style={{ background: `linear-gradient(135deg, ${promo.color}, #1e9e6a)` }}
        >
          <p className="text-xs opacity-90">Ưu đãi</p>
          <p className="text-lg font-bold">{promo.title}</p>
          <p className="text-sm">{promo.sub}</p>
          <Link href="/m/book" className="mt-3 inline-block rounded-lg bg-white/25 px-4 py-2 text-xs font-semibold">
            Đặt ngay →
          </Link>
        </div>

        <h2 className="mb-3 mt-6 text-sm font-bold">Vì sao tin {mobileBrand.name}</h2>
        <div className="grid grid-cols-4 gap-2">
          {trustStats.map((t) => (
            <div key={t.label} className="m-card p-2 text-center">
              <p className="text-sm font-bold text-[var(--m-trust)]">{t.value}</p>
              <p className="text-[9px] text-[var(--m-muted)]">{t.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {uspBadges.map((u) => (
            <div key={u.title} className="m-card flex gap-2 p-3" style={{ background: "var(--m-warm)" }}>
              <span className="text-xl">{u.icon}</span>
              <div>
                <p className="text-xs font-bold">{u.title}</p>
                <p className="text-[10px] text-[var(--m-muted)]">{u.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="m-card mt-6 border-l-4 border-[var(--m-primary)] p-4">
          <p className="text-xs font-semibold text-[var(--m-primary)]">Gợi ý cho bạn</p>
          <p className="mt-1 text-sm font-medium">Nhà bạn đã 7 ngày chưa tổng vệ sinh</p>
          <button
            type="button"
            onClick={() => handleSelectService("deep")}
            className="mt-2 text-xs font-semibold text-[var(--m-trust)]"
          >
            Xem video tổng vệ sinh →
          </button>
        </div>
      </div>

      <Link
        href="/m/book"
        className="m-btn-primary fixed bottom-[calc(5.5rem+var(--m-safe-b))] left-4 right-4 z-30 mx-auto max-w-lg py-4 text-center text-base shadow-xl"
      >
        Đặt lịch ngay
      </Link>
    </div>
  );
}
