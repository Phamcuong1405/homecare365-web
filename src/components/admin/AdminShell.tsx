"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_STORAGE_KEY } from "@/lib/admin-session";

const nav = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/jobs", label: "Công việc" },
  { href: "/admin/staff", label: "Nhân viên" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  useEffect(() => {
    const key = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (!key) {
      router.replace("/admin/login");
      return;
    }
    setAdminKey(key);
    setReady(true);
  }, [router]);

  function logout() {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    router.replace("/admin/login");
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-[var(--a-muted)]">
        Đang tải…
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-4xl">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--a-accent)]">
              HomeCare365
            </p>
            <h1 className="text-lg font-bold text-[var(--a-primary)]">Bảng quản lý</h1>
          </div>
          <button type="button" onClick={logout} className="text-xs text-[var(--a-muted)] underline">
            Đăng xuất
          </button>
        </div>
        <nav className="mt-3 flex gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                pathname === item.href
                  ? "bg-[var(--a-primary)] text-white"
                  : "bg-black/5 text-[var(--a-text)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="p-4" data-admin-key={adminKey ? "set" : ""}>
        {children}
      </main>
    </div>
  );
}
