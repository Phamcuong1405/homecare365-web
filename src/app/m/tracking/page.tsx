"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { TrackingMap } from "@/components/mobile/TrackingMap";
import { fetchTracking } from "@/lib/tracking-client";
import type { TrackingSession } from "@/lib/tracking-types";
import { estimateEtaMinutes } from "@/lib/tracking-utils";

const STATUS_STEPS: { key: TrackingSession["status"]; label: string }[] = [
  { key: "waiting", label: "Đã nhận đơn" },
  { key: "en_route", label: "Đang di chuyển" },
  { key: "arrived", label: "Đã đến nơi" },
  { key: "working", label: "Bắt đầu làm việc" },
  { key: "done", label: "Hoàn thành" },
];

function statusIndex(status: TrackingSession["status"]) {
  const order: TrackingSession["status"][] = ["waiting", "en_route", "arrived", "working", "done"];
  return order.indexOf(status);
}

function TrackingContent() {
  const params = useSearchParams();
  const isNew = params.get("new") === "1";
  const jobFromUrl = params.get("job") ?? "";
  const storedJob =
    typeof window !== "undefined" ? localStorage.getItem("hc365_active_job") ?? "" : "";
  const jobId = jobFromUrl || storedJob;
  const [session, setSession] = useState<TrackingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (id: string) => {
    if (!id) {
      setLoading(false);
      setError("Chưa có mã đơn theo dõi");
      return;
    }
    const data = await fetchTracking(id);
    if (data) {
      setSession(data);
      setError("");
    } else {
      setError("Đang chờ nhân viên bật định vị trên app");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (jobId) load(jobId);
    else setLoading(false);
  }, [jobId, load]);

  useEffect(() => {
    if (!jobId) return;
    const t = setInterval(() => load(jobId), 5000);
    return () => clearInterval(t);
  }, [jobId, load]);

  const eta =
    session?.sharing && session
      ? estimateEtaMinutes(session.staffLat, session.staffLng, session.destLat, session.destLng)
      : null;

  const activeIdx = session ? statusIndex(session.status) : 0;

  return (
    <div className="min-h-dvh bg-[var(--m-bg)] px-4 pb-8 pt-4">
      <Link href="/m/home" className="text-sm text-[var(--m-trust)]">
        ← Trang chủ
      </Link>

      {isNew ? (
        <div className="m-card mt-4 border-l-4 border-[var(--m-primary)] p-4">
          <p className="font-bold text-[var(--m-primary)]">Đặt lịch thành công!</p>
          <p className="mt-1 text-sm text-[var(--m-muted)]">
            Mã theo dõi: <strong>{jobId || "—"}</strong>. Nhân viên sẽ bật GPS khi di chuyển tới nhà bạn.
          </p>
        </div>
      ) : null}

      <h1 className="mt-6 text-lg font-bold">Theo dõi nhân viên</h1>
      <p className="text-sm text-[var(--m-muted)]">
        Giống Grab / Zalo — vị trí cập nhật khi NV bật chia sẻ trên app
      </p>

      {jobId ? (
        <p className="mt-1 text-xs text-[var(--m-muted)]">
          Mã đơn: <span className="font-mono font-semibold text-[var(--m-text)]">{jobId}</span>
        </p>
      ) : null}

      {loading && !session ? (
        <p className="m-card mt-4 p-4 text-center text-sm text-[var(--m-muted)]">Đang tải bản đồ…</p>
      ) : session ? (
        <>
          <div className="m-card relative mt-4 overflow-hidden p-0">
            <TrackingMap
              staffLat={session.staffLat}
              staffLng={session.staffLng}
              destLat={session.destLat}
              destLng={session.destLng}
              path={session.path}
              sharing={session.sharing}
            />
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
              <p className="rounded-lg bg-white/95 px-2 py-1 text-xs font-semibold shadow">
                {session.sharing ? (
                  <>ETA: ~{eta} phút</>
                ) : (
                  <>Chờ NV bật định vị</>
                )}
              </p>
              {session.sharing ? (
                <span className="rounded-full bg-[var(--m-primary)] px-2 py-0.5 text-[10px] font-bold text-white">
                  LIVE
                </span>
              ) : null}
            </div>
          </div>

          <div className="m-card mt-4 flex items-center gap-4 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--m-primary)] text-2xl text-white">
              👩‍🔧
            </div>
            <div className="flex-1">
              <p className="font-semibold">{session.staffName}</p>
              <p className="text-xs text-[var(--m-muted)]">
                {session.sharing ? "Đang chia sẻ vị trí" : "Chưa bật GPS"} · ★ 4.9
              </p>
            </div>
            <Link
              href={`/m/staff/track?job=${encodeURIComponent(jobId)}`}
              className="rounded-full bg-[var(--m-warm)] px-3 py-2 text-xs font-semibold"
            >
              NV bật GPS
            </Link>
          </div>
        </>
      ) : (
        <p className="m-card mt-4 p-4 text-sm text-amber-700">{error || "Không có dữ liệu theo dõi"}</p>
      )}

      <div className="mt-6 space-y-2">
        {STATUS_STEPS.map((s, i) => (
          <div
            key={s.key}
            className={`flex items-center gap-3 rounded-xl p-3 ${
              i <= activeIdx ? "bg-[var(--m-primary)]/10" : "bg-white"
            }`}
          >
            <span className={i <= activeIdx ? "text-[var(--m-primary)]" : "text-gray-300"}>
              {i <= activeIdx ? "●" : "○"}
            </span>
            <span className="text-sm">{s.label}</span>
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
