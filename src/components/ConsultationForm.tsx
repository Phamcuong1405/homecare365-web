"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/lib/site";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500";

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
      "--- Địa chỉ chăm sóc ---",
      fullAddress || "(chưa nhập)",
      "",
      "--- Nhu cầu chăm sóc ---",
      note || "(chưa ghi)",
    ].join("\n");

    const subject = encodeURIComponent(`[HomeCare365] Đăng ký tư vấn - ${fullName}`);
    const bodyEncoded = encodeURIComponent(body);
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${subject}&body=${bodyEncoded}`;

    setSent(true);
    form.reset();
  }

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5">
      <h2 className="text-lg font-semibold text-slate-900">Đặt lịch tư vấn miễn phí</h2>
      <p className="mt-1 text-sm text-slate-500">Chúng tôi liên hệ trong vòng 24 giờ.</p>

      {sent ? (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Đã mở ứng dụng email. Nếu không thấy, vui lòng gọi hotline hoặc nhắn Zalo.
        </p>
      ) : null}

      <form className="mt-5 space-y-4" onSubmit={onSubmit} id="dat-lich-tu-van">
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-slate-700">Thông tin liên hệ</legend>
          <input type="text" name="name" placeholder="Họ và tên *" required className={inputClass} />
          <input type="tel" name="phone" placeholder="Số điện thoại *" required className={inputClass} />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-slate-700">Địa chỉ chăm sóc tại nhà</legend>
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
          <legend className="text-sm font-semibold text-slate-700">Nhu cầu chăm sóc</legend>
          <textarea
            name="note"
            placeholder="Tuổi, tình trạng sức khỏe, thời gian cần chăm sóc..."
            rows={3}
            className={inputClass}
          />
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Gửi yêu cầu
        </button>
      </form>
    </div>
  );
}
