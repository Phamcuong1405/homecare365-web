"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { staffLoginClient } from "@/lib/ops-client";
import { setStaffSession } from "@/lib/staff-session";
import { mobileBrand } from "@/lib/mobile-app-data";

export default function StaffLoginPage() {
  const router = useRouter();
  const [staffId, setStaffId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = (await staffLoginClient(staffId.trim().toUpperCase(), pin)) as {
      ok?: boolean;
      staff?: { staffId: string; name: string };
      error?: string;
    };
    setLoading(false);
    if (!data.ok || !data.staff) {
      const msg =
        data.error === "not_active"
          ? "Tài khoản chưa được duyệt"
          : data.error === "invalid_pin"
            ? "Mã PIN không đúng"
            : "Đăng nhập thất bại";
      setError(msg);
      return;
    }
    setStaffSession(data.staff.staffId, data.staff.name);
    router.replace("/m/staff/home");
  }

  return (
    <div className="px-6 pb-10 pt-12">
      <h1 className="text-xl font-bold">Cổng nhân viên</h1>
      <p className="mt-1 text-sm text-[var(--m-muted)]">{mobileBrand.name}</p>

      <form onSubmit={handleSubmit} className="m-card mt-6 space-y-3 p-5">
        <input
          className="m-input font-mono uppercase"
          placeholder="Mã NV (vd. NV001)"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          required
        />
        <input
          className="m-input"
          type="password"
          inputMode="numeric"
          placeholder="Mã PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
        <button type="submit" className="m-btn-primary w-full py-3.5 text-sm" disabled={loading}>
          {loading ? "…" : "Đăng nhập"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        <Link href="/m/staff/register" className="font-semibold text-[var(--m-primary)]">
          Đăng ký mới
        </Link>
        {" · "}
        <Link href="/admin/login" className="text-[var(--m-muted)] underline">
          Quản lý
        </Link>
      </p>
    </div>
  );
}
