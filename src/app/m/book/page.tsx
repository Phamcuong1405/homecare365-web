"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { buildFullAddress } from "@/lib/consultation-form-utils";
import { getQuickServiceById, quickServices } from "@/lib/mobile-app-data";
import { postTrackingUpdate } from "@/lib/tracking-client";
import { generateJobId } from "@/lib/tracking-utils";
import { submitConsultation } from "@/lib/submit-consultation";

const steps = ["Dịch vụ", "Thời gian", "Xác nhận"];

function MobileBookContent() {
  const router = useRouter();
  const params = useSearchParams();
  const preselect = params.get("service");
  const [step, setStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (preselect && getQuickServiceById(preselect)) initial.add(preselect);
    return initial;
  });
  const [area, setArea] = useState("60");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("Hà Nội");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedServices = quickServices.filter((s) => selectedIds.has(s.id));
  const serviceTitles = selectedServices.map((s) => s.title).join(", ");

  function toggleService(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setError("");
  }

  function goToStep1() {
    if (selectedIds.size === 0) {
      setError("Vui lòng chọn ít nhất một dịch vụ");
      return;
    }
    setError("");
    setStep(1);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fullAddress = buildFullAddress({
      fullName: name,
      phone,
      houseNumber,
      alley: "",
      street,
      ward,
      district,
      city,
      note: "",
    });
    const jobId = generateJobId();

    const result = await submitConsultation({
      fullName: name,
      phone,
      houseNumber,
      alley: "",
      street,
      ward,
      district,
      city,
      note: `[APP] ${jobId} | ${serviceTitles || "—"} | ${area}m² | ${date} ${time}`,
    });

    if (result.ok) {
      await postTrackingUpdate(jobId, {
        action: "trackingStart",
        destAddress: fullAddress,
        staffName: "Nhân viên HomeCare365",
        sharing: false,
        status: "waiting",
      });
      localStorage.setItem("hc365_active_job", jobId);
      setLoading(false);
      router.push(`/m/tracking?job=${encodeURIComponent(jobId)}&new=1`);
      return;
    }

    setLoading(false);
    setError(result.message);
  }

  return (
    <div className="min-h-dvh bg-[var(--m-bg)] pb-8">
      <header className="m-glass sticky top-0 z-10 flex items-center gap-3 px-4 py-3">
        <Link href="/m/home">←</Link>
        <div className="flex-1">
          <p className="text-sm font-bold">Đặt lịch — bước {step + 1}/3</p>
          <div className="mt-1 flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded ${i <= step ? "bg-[var(--m-primary)]" : "bg-gray-200"}`}
              />
            ))}
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 pt-4">
        {step === 0 && (
          <div className="space-y-4">
            <label className="text-sm font-semibold">Loại dịch vụ</label>
            <p className="text-xs text-[var(--m-muted)]">Chạm để chọn — chạm lại để bỏ chọn (có thể chọn nhiều)</p>
            <div className="grid grid-cols-2 gap-2">
              {quickServices.map((s) => {
                const isSelected = selectedIds.has(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleService(s.id)}
                    className={`m-card p-3 text-left text-sm transition active:scale-[0.98] ${
                      isSelected ? "m-service-chip-active" : ""
                    }`}
                  >
                    {s.icon} {s.title}
                  </button>
                );
              })}
            </div>
            {error && step === 0 ? <p className="text-sm text-red-600">{error}</p> : null}
            <label className="text-sm font-semibold">Diện tích (m²)</label>
            <select className="m-input" value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="40">Dưới 40m²</option>
              <option value="60">40–60m²</option>
              <option value="80">60–80m²</option>
              <option value="100">Trên 80m²</option>
            </select>
            <button type="button" onClick={goToStep1} className="m-btn-primary w-full py-3.5">
              Tiếp tục
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <label className="text-sm font-semibold">Ngày</label>
            <input
              className="m-input"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <label className="text-sm font-semibold">Giờ</label>
            <select className="m-input" value={time} onChange={(e) => setTime(e.target.value)}>
              {["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(0)} className="flex-1 rounded-xl border py-3">
                Quay lại
              </button>
              <button type="button" onClick={() => setStep(2)} className="m-btn-primary flex-1 py-3.5">
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="m-card p-4 text-sm">
              <p>
                <strong>{serviceTitles}</strong> — {area}m²
              </p>
              <p className="text-[var(--m-muted)]">
                {date} lúc {time}
              </p>
            </div>
            <input
              className="m-input"
              placeholder="Họ và tên *"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="m-input"
              type="tel"
              placeholder="Số điện thoại *"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="m-input"
              placeholder="Số nhà *"
              required
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
            <input
              className="m-input"
              placeholder="Tên đường / Ngõ hẻm *"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="m-input"
                placeholder="Phường/Xã *"
                required
                value={ward}
                onChange={(e) => setWard(e.target.value)}
              />
              <input
                className="m-input"
                placeholder="Quận/Huyện *"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
            <input
              className="m-input"
              placeholder="Thành phố *"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <p className="text-xs text-[var(--m-muted)]">Thanh toán: Momo / ZaloPay / COD (xác nhận sau)</p>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-xl border py-3">
                Quay lại
              </button>
              <button type="submit" disabled={loading} className="m-btn-primary flex-1 py-3.5 disabled:opacity-60">
                {loading ? "Đang gửi..." : "Xác nhận đặt lịch"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default function MobileBookPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Đang tải...</div>}>
      <MobileBookContent />
    </Suspense>
  );
}
