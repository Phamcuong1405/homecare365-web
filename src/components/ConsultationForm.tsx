"use client";

import { FormEvent, useRef, useState } from "react";
import {
  getMissingFieldKeys,
  getMissingFieldLabels,
  normalizeConsultationPayload,
  type ConsultationFieldKey,
} from "@/lib/consultation-form-utils";
import { submitConsultation } from "@/lib/submit-consultation";
import { phoneTelHref, siteConfig } from "@/lib/site";

const inputClass =
  "hc-input w-full rounded-lg border border-[var(--hc-card-border)] bg-white px-4 py-2.5 text-base text-[var(--hc-text)] outline-none sm:text-sm";

const inputErrorClass =
  "hc-input w-full rounded-lg border-2 border-red-400 bg-white px-4 py-2.5 text-base text-[var(--hc-text)] outline-none sm:text-sm";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ConsultationForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [invalidFields, setInvalidFields] = useState<ConsultationFieldKey[]>([]);
  const submittingRef = useRef(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) return;
    submittingRef.current = true;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = normalizeConsultationPayload({
      fullName: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      houseNumber: String(data.get("houseNumber") ?? "").trim(),
      alley: String(data.get("alley") ?? "").trim(),
      street: String(data.get("street") ?? "").trim(),
      ward: String(data.get("ward") ?? "").trim(),
      district: String(data.get("district") ?? "").trim(),
      note: String(data.get("note") ?? "").trim(),
    });

    const missingKeys = getMissingFieldKeys(payload);
    if (missingKeys.length > 0) {
      setStatus("error");
      setInvalidFields(missingKeys);
      setErrorMessage(`Vui lòng điền: ${getMissingFieldLabels(missingKeys).join(", ")}.`);
      submittingRef.current = false;
      return;
    }

    setInvalidFields([]);
    setStatus("loading");
    setErrorMessage("");

    const result = await submitConsultation(payload);

    if (result.ok) {
      setStatus("success");
      form.reset();
    } else if (result.type === "validation") {
      setStatus("error");
      setErrorMessage(result.message);
      setInvalidFields(getMissingFieldKeys(payload));
    } else {
      setStatus("error");
      setErrorMessage(result.message);
    }

    submittingRef.current = false;
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
            autoComplete="name"
            enterKeyHint="next"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại *"
            className={fieldClass("phone")}
            autoComplete="tel"
            inputMode="tel"
            enterKeyHint="next"
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
              enterKeyHint="next"
            />
            <input
              type="text"
              name="alley"
              placeholder="Ngõ / Hẻm (nếu có)"
              className={inputClass}
              enterKeyHint="next"
            />
          </div>
          <input
            type="text"
            name="street"
            placeholder="Tên đường * (hoặc điền ở Ngõ/Hẻm phía trên)"
            className={fieldClass("street")}
            enterKeyHint="next"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="ward"
              placeholder="Phường / Xã *"
              className={fieldClass("ward")}
              enterKeyHint="next"
            />
            <input
              type="text"
              name="district"
              placeholder="Quận / Huyện *"
              className={fieldClass("district")}
              enterKeyHint="done"
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
          className="w-full rounded-lg hc-btn-primary py-3.5 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 sm:py-3 sm:text-sm"
        >
          {status === "loading" ? "Đang gửi, vui lòng đợi..." : "Gửi yêu cầu"}
        </button>
      </form>
    </div>
  );
}
