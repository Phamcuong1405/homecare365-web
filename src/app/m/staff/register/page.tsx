"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerStaffClient } from "@/lib/ops-client";
import { mobileBrand } from "@/lib/mobile-app-data";

export default function StaffRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = (await registerStaffClient({ name, phone, email, pin })) as {
      ok?: boolean;
      staff?: { staffId: string };
      error?: string;
    };
    setLoading(false);
    if (!data.ok) {
      setError(data.error === "phone_exists" ? "Số điện thoại đã đăng ký" : "Đăng ký thất bại");
      return;
    }
    setSuccess(
      `Đăng ký thành công! Mã nhân viên: ${data.staff?.staffId}. Chờ quản trị duyệt rồi đăng nhập.`,
    );
    setTimeout(() => router.push("/m/staff/login"), 3000);
  }

  return (
    <div className="px-6 pb-10 pt-12">
      <h1 className="text-xl font-bold">Đăng ký nhân viên</h1>
      <p className="mt-1 text-sm text-[var(--m-muted)]">{mobileBrand.name}</p>

      <form onSubmit={handleSubmit} className="m-card mt-6 space-y-3 p-5">
        <input className="m-input" placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="m-input" type="tel" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input className="m-input" type="email" placeholder="Email (tuỳ chọn)" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          className="m-input"
          type="password"
          inputMode="numeric"
          placeholder="Mã PIN (4–6 số)"
          minLength={4}
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
        {success ? <p className="text-xs text-[var(--m-primary)]">{success}</p> : null}
        <button type="submit" className="m-btn-primary w-full py-3.5 text-sm" disabled={loading}>
          {loading ? "Đang gửi…" : "Gửi đăng ký"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        Đã có tài khoản?{" "}
        <Link href="/m/staff/login" className="font-semibold text-[var(--m-primary)]">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
