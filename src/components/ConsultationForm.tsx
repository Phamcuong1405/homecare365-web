"use client";

import { FormEvent, useState } from "react";
import type { ConsultationSheetRow } from "@/lib/consultation-sheet";
import { submitToGoogleSheetDirect } from "@/lib/submit-to-google-sheet";
import { phoneTelHref, siteConfig } from "@/lib/site";

const inputClass =
  "hc-input w-full rounded-lg border border-[var(--hc-card-border)] bg-white px-4 py-2.5 text-sm text-[var(--hc-text)] outline-none";

type FormStatus = "idle" | "loading" | "success" | "error";

function buildSheetRow(payload: {
  fullName: string;
  phone: string;
  houseNumber: string;
  alley: string;
  street: string;
  ward: string;
  district: string;
  note: string;
}): ConsultationSheetRow {
  return {
    submittedAt: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    fullName: payload.fullName,
    phone: payload.phone,
    houseNumber: payload.houseNumber,
    alley: payload.alley,
    street: payload.street,
    ward: payload.ward,
    district: payload.district,
    note: payload.note,
    fullAddress: [
      payload.houseNumber && `Số nhà ${payload.houseNumber}`,
      payload.alley && `Ngõ/Hẻm ${payload.alley}`,
      payload.street && `Đường ${payload.street}`,
      payload.ward && `Phường/Xã ${payload.ward}`,
      payload.district && `Quận/Huyện ${payload.district}`,
    ]
      .filter(Boolean)
      .join(", "),
  };
}

export function ConsultationForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      fullName: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      houseNumber: String(data.get("houseNumber") ?? "").trim(),
      alley: String(data.get("alley") ?? "").trim(),
      street: String(data.get("street") ?? "").trim(),
      ward: String(data.get("ward") ?? "").trim(),
      district: String(data.get("district") ?? "").trim(),
      note: String(data.get("note") ?? "").trim(),
    };

    if (!payload.fullName || !payload.phone || !payload.houseNumber || !payload.street || !payload.ward || !payload.district) {
      setStatus("error");
      setErrorMessage("Vui lòng điền đầy đủ các trường bắt buộc (*).");
      return;
    }

    const sheetRow = buildSheetRow(payload);

    setStatus("loading");
    setErrorMessage("");

    try {
      submitToGoogleSheetDirect(sheetRow);

      void fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => undefined);

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Gửi thất bại. Vui lòng gọi hotline.");
    }
  }

  return (
    <div className="hc-card rounded-3xl p-6">
      <div className="hc-form-board-head text-center">
        <h2 className="hc-form-board-title">ĐẶT LỊCH TƯ VẤN MIỄN PHÍ</h2>
        <p className="mt-2 text-sm text-[var(--hc-text-muted)]">Chúng tôi liên hệ trong vòng 24 giờ.</p>
      </div>

      {status === "success" ? (
        <p className="mt-4 rounded-lg bg-[var(--hc-blue-soft)] px-4 py-3 text-sm text-[var(--hc-brand-blue)]">
          Cảm ơn bạn! Yêu cầu đã được ghi nhận. HomeCare365 sẽ liên hệ trong vòng 24 giờ.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="mt-4 rounded-lg border border-red-300/50 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}{" "}
          <a href={phoneTelHref(siteConfig.contact.phone)} className="font-semibold underline">
            Gọi {siteConfig.contact.phone}
          </a>
        </p>
      ) : null}

      <form className="mt-5 space-y-4" onSubmit={onSubmit} noValidate>
        <fieldset className="space-y-3" disabled={status === "loading"}>
          <legend className="text-sm font-semibold text-[var(--hc-text)]">Thông tin liên hệ</legend>
          <input type="text" name="name" placeholder="Họ và tên *" required className={inputClass} />
          <input type="tel" name="phone" placeholder="Số điện thoại *" required className={inputClass} autoComplete="tel" />
        </fieldset>

        <fieldset className="space-y-3" disabled={status === "loading"}>
          <legend className="text-sm font-semibold text-[var(--hc-text)]">Địa chỉ cần dọn dẹp</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="houseNumber"
              placeholder="Số nhà *"
              required
              className={inputClass}
            />
            <input type="text" name="alley" placeholder="Ngõ / Hẻm" className={inputClass} />
          </div>
          <input type="text" name="street" placeholder="Tên đường *" required className={inputClass} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input type="text" name="ward" placeholder="Phường / Xã *" required className={inputClass} />
            <input
              type="text"
              name="district"
              placeholder="Quận / Huyện *"
              required
              className={inputClass}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-3" disabled={status === "loading"}>
          <legend className="text-sm font-semibold text-[var(--hc-text)]">Nhu cầu dọn dẹp</legend>
          <textarea
            name="note"
            placeholder="Diện tích nhà, tần suất (1 lần/tuần), yêu cầu đặc biệt..."
            rows={3}
            className={inputClass}
          />
        </fieldset>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg hc-btn-primary py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
      </form>
    </div>
  );
}
