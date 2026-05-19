"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/lib/site";

const inputClass =
  "hc-input w-full rounded-lg border border-[var(--hc-card-border)] bg-white px-4 py-2.5 text-sm text-[var(--hc-text)] outline-none";

export function ConsultationForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const fullName = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const houseNumber = String(data.get("houseNumber") ?? "").trim();
    const alley = String(data.get("alley") ?? "").trim();
    const street = String(data.get("street") ?? "").trim();
    const ward = String(data.get("ward") ?? "").trim();
    const district = String(data.get("district") ?? "").trim();
    const note = String(data.get("note") ?? "").trim();

    const addressParts = [
      houseNumber && `Số nhà: ${houseNumber}`,
      alley && `Ngõ/Hẻm: ${alley}`,
      street && `Đường: ${street}`,
      ward && `Phường/Xã: ${ward}`,
      district && `Quận/Huyện: ${district}`,
    ].filter(Boolean);

    const fullAddress = addressParts.join("\n");

    const body = [
      "=== ĐĂNG KÝ TƯ VẤN HOMECARE365 ===",
      "",
      `Họ và tên: ${fullName}`,
      `Số điện thoại: ${phone}`,
      "",
      "--- Địa chỉ dọn dẹp ---",
      fullAddress || "(chưa nhập)",
      "",
      "--- Nhu cầu dọn dẹp ---",
      note || "(chưa ghi)",
    ].join("\n");

    const subject = encodeURIComponent(`[HomeCare365] Đăng ký tư vấn - ${fullName}`);
    const bodyEncoded = encodeURIComponent(body);
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${subject}&body=${bodyEncoded}`;

    setSent(true);
    form.reset();
  }

  return (
    <div className="hc-card rounded-3xl p-6">
      <div className="hc-form-board-head text-center">
        <h2 className="hc-form-board-title">ĐẶT LỊCH TƯ VẤN MIỄN PHÍ</h2>
        <p className="mt-2 text-sm text-[var(--hc-text-muted)]">Chúng tôi liên hệ trong vòng 24 giờ.</p>
      </div>

      {sent ? (
        <p className="mt-4 rounded-lg bg-[var(--hc-green-soft)] px-4 py-3 text-sm text-[var(--hc-deep)]">
          Đã mở ứng dụng email. Nếu không thấy, vui lòng gọi hotline hoặc nhắn Zalo.
        </p>
      ) : null}

      <form className="mt-5 space-y-4" onSubmit={onSubmit} id="dat-lich-tu-van">
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-[var(--hc-text)]">Thông tin liên hệ</legend>
          <input type="text" name="name" placeholder="Họ và tên *" required className={inputClass} />
          <input type="tel" name="phone" placeholder="Số điện thoại *" required className={inputClass} />
        </fieldset>

        <fieldset className="space-y-3">
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

        <fieldset className="space-y-3">
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
          className="w-full rounded-lg hc-btn-primary py-3 text-sm font-semibold text-white"
        >
          Gửi yêu cầu
        </button>
      </form>
    </div>
  );
}
