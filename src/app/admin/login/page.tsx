"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { ADMIN_STORAGE_KEY } from "@/lib/admin-session";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/ops/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = (await res.json()) as { ok?: boolean; token?: string; error?: string };
    setLoading(false);
    if (!data.ok || !data.token) {
      setError(
        data.error === "invalid_credentials"
          ? "Tài khoản hoặc mật khẩu không đúng"
          : "Không đăng nhập được — liên hệ kỹ thuật",
      );
      return;
    }
    sessionStorage.setItem(ADMIN_STORAGE_KEY, data.token);
    sessionStorage.setItem("hc365_admin_user", username);
    router.replace("/admin");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
      <div className="admin-card">
        <h1 className="text-xl font-bold text-[var(--a-primary)]">HomeCare365 Quản lý</h1>
        <p className="mt-1 text-sm text-[var(--a-muted)]">Điều phối việc — phân công nhân viên</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--a-muted)]">Tài khoản</label>
            <input
              className="admin-input mt-1"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--a-muted)]">Mật khẩu</label>
            <input
              className="admin-input mt-1"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="admin-btn w-full py-3" disabled={loading}>
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-[var(--a-muted)]">
          <a href="/m/staff/login" className="underline">
            Cổng nhân viên
          </a>
          {" · "}
          <a href="/" className="underline">
            Website
          </a>
        </p>
      </div>
    </div>
  );
}
