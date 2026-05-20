"use client";

import { FormEvent, useState } from "react";
import type { ConsultationSheetRow } from "@/lib/consultation-sheet";
import {
  buildFullAddress,
  getMissingFieldKeys,
  getMissingFieldLabels,
  normalizeConsultationPayload,
  type ConsultationFieldKey,
  type ConsultationFormPayload,
} from "@/lib/consultation-form-utils";
import { submitToGoogleSheetDirect } from "@/lib/submit-to-google-sheet";
import { phoneTelHref, siteConfig } from "@/lib/site";

const inputClass =
  "hc-input w-full rounded-lg border border-[var(--hc-card-border)] bg-white px-4 py-2.5 text-sm text-[var(--hc-text)] outline-none";

const inputErrorClass =
  "hc-input w-full rounded-lg border-2 border-red-400 bg-white px-4 py-2.5 text-sm text-[var(--hc-text)] outline-none";

type FormStatus = "idle" | "loading" | "success" | "error";

function readPayload(form: HTMLFormElement): ConsultationFormPayload {
  const data = new FormData(form);
  return normalizeConsultationPayload({
    fullName: String(data.get("name") ?? "").trim(),
    phone: String(data.get("phone") ?? "").trim(),
    houseNumber: String(data.get("houseNumber") ?? "").trim(),
    alley: String(data.get("alley") ?? "").trim(),
    street: String(data.get("street") ?? "").trim(),
    ward: String(data.get("ward") ?? "").trim(),
    district: String(data.get("district") ?? "").trim(),
    note: String(data.get("note") ?? "").trim(),
  });
}

function toSheetRow(payload: ConsultationFormPayload): ConsultationSheetRow {
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
    fullAddress: buildFullAddress(payload),
  };
}

export function ConsultationForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [invalidFields, setInvalidFields] = useState<ConsultationFieldKey[]>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = readPayload(form);
    const missingKeys = getMissingFieldKeys(payload);

    if (missingKeys.length > 0) {
      setStatus("error");
      setInvalidFields(missingKeys);
      setErrorMessage(`Vui lòng điền: ${getMissingFieldLabels(missingKeys).join(", ")}.`);
      return;
    }

    setInvalidFields([]);
    setStatus("loading");
    setErrorMessage("");

    const sheetRow = toSheetRow(payload);

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await res.json().catch(() => ({}))) as { error?: string };

      if (res.ok) {
        setStatus("success");
        form.reset();
        return;
      }

      await submitToGoogleSheetDirect(sheetRow);

      if (res.status >= 500) {
        setStatus("success");
        form.reset();
        return;
      }

      setStatus("error");
      setErrorMessage(result.error ?? "Gửi thất bại. Vui lòng thử lại hoặc gọi hotline.");
    } catch {
      try {
        await submitToGoogleSheetDirect(sheetRow);
        setStatus("success");
        form.reset();
      } catch {
        setStatus("error");
        setErrorMessage("Không kết nối được máy chủ. Vui lòng gọi hotline.");
      }
    }
  }

  const fieldClass = (key: ConsultationFieldKey) =>
    invalidFields.includes(key) ? inputErrorClass : inputClass;

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
          <input
            type="text"
            name="name"
            placeholder="Họ và tên *"
            className={fieldClass("name")}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại *"
            className={fieldClass("phone")}
            autoComplete="tel"
          />
        </fieldset>

        <fieldset className="space-y-3" disabled={status === "loading"}>
          <legend className="text-sm font-semibold text-[var(--hc-text)]">Địa chỉ cần dọn dẹp</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="houseNumber"
              placeholder="Số nhà *"
              className={fieldClass("houseNumber")}
            />
            <input
              type="text"
              name="alley"
              placeholder="Ngõ / Hẻm (nếu có)"
              className={inputClass}
            />
          </div>
          <input
            type="text"
            name="street"
            placeholder="Tên đường * (hoặc điền ở Ngõ/Hẻm phía trên)"
            className={fieldClass("street")}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="ward"
              placeholder="Phường / Xã *"
              className={fieldClass("ward")}
            />
            <input
              type="text"
              name="district"
              placeholder="Quận / Huyện *"
              className={fieldClass("district")}
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
