"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { postTrackingUpdate } from "@/lib/tracking-client";

function StaffTrackContent() {
  const params = useSearchParams();
  const jobId = params.get("job") ?? "";
  const [staffName, setStaffName] = useState("Chị Lan");
  const [sharing, setSharing] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [lastPos, setLastPos] = useState("");
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!jobId) return;
    postTrackingUpdate(jobId, {
      action: "trackingStart",
      staffName,
      sharing: false,
    });
  }, [jobId, staffName]);

  function stopSharing() {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setSharing(false);
    setStatus("Đã tắt chia sẻ vị trí");
    postTrackingUpdate(jobId, { action: "trackingStop", staffName, sharing: false });
  }

  function startSharing() {
    if (!jobId) {
      setStatus("Thiếu mã đơn (job) trong link");
      return;
    }
    if (!navigator.geolocation) {
      setStatus("Thiết bị không hỗ trợ GPS");
      return;
    }

    setSharing(true);
    setStatus("Đang bật GPS…");

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLastPos(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        setStatus("Đang chia sẻ vị trí cho khách");
        postTrackingUpdate(jobId, {
          action: "trackingUpdate",
          staffName,
          staffLat: lat,
          staffLng: lng,
          sharing: true,
          status: "en_route",
        });
      },
      (err) => {
        setStatus(`Lỗi GPS: ${err.message}`);
        setSharing(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  }

  useEffect(() => {
    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-dvh bg-[var(--m-bg)] px-4 pb-8 pt-4">
      <Link href="/m/home" className="text-sm text-[var(--m-trust)]">
        ← Trang chủ
      </Link>

      <h1 className="mt-6 text-lg font-bold">Nhân viên — Bật định vị</h1>
      <p className="mt-1 text-sm text-[var(--m-muted)]">
        Khách theo dõi lộ trình realtime khi bạn di chuyển tới nhà (giống Grab / Zalo)
      </p>

      <div className="m-card mt-4 space-y-3 p-4">
        <p className="text-xs text-[var(--m-muted)]">
          Mã đơn: <span className="font-mono font-bold text-[var(--m-text)]">{jobId || "—"}</span>
        </p>
        <label className="text-sm font-semibold">Tên nhân viên</label>
        <input
          className="m-input"
          value={staffName}
          onChange={(e) => setStaffName(e.target.value)}
          placeholder="Tên hiển thị với khách"
        />
      </div>

      <div className="mt-6 space-y-3">
        {!sharing ? (
          <button type="button" onClick={startSharing} className="m-btn-primary w-full py-4 text-base font-semibold">
            Bật chia sẻ vị trí (GPS)
          </button>
        ) : (
          <button
            type="button"
            onClick={stopSharing}
            className="w-full rounded-xl border-2 border-red-400 py-4 text-base font-semibold text-red-600"
          >
            Tắt chia sẻ vị trí
          </button>
        )}
        {status ? <p className="text-center text-sm text-[var(--m-muted)]">{status}</p> : null}
        {lastPos ? (
          <p className="text-center text-xs text-[var(--m-muted)]">Vị trí: {lastPos}</p>
        ) : null}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-[var(--m-muted)]">
        Cho phép trình duyệt / app truy cập vị trí. Giữ màn hình mở khi di chuyển. Khách xem tại trang Theo dõi
        nhân viên.
      </p>

      {jobId ? (
        <Link
          href={`/m/tracking?job=${encodeURIComponent(jobId)}`}
          className="mt-4 block text-center text-sm text-[var(--m-trust)]"
        >
          Xem như khách hàng →
        </Link>
      ) : null}
    </div>
  );
}

export default function StaffTrackPage() {
  return (
    <Suspense fallback={<div className="p-6">Đang tải...</div>}>
      <StaffTrackContent />
    </Suspense>
  );
}
