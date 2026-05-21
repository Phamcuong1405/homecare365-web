"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mobileBrand } from "@/lib/mobile-app-data";

export default function AccountPage() {
  const router = useRouter();
  const [name, setName] = useState("Khách");

  useEffect(() => {
    setName(localStorage.getItem("hc365_user_name") ?? "Khách");
  }, []);

  function logout() {
    localStorage.removeItem("hc365_logged_in");
    router.replace("/m/login");
  }

  return (
    <div className="px-4 pt-4 pb-8">
      <div className="m-card flex items-center gap-4 p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--m-primary)] text-2xl text-white">
          👤
        </div>
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-xs text-[var(--m-muted)]">Silver Member · 120 điểm</p>
        </div>
      </div>

      <div className="m-card mt-4 divide-y text-sm">
        {[
          ["📋", "Lịch sử booking", "/m/bookings"],
          ["🎫", "Ví voucher", "/m/membership"],
          ["⭐", "Điểm thưởng", "/m/membership"],
          ["🔄", "Gói định kỳ", "/m/book"],
        ].map(([icon, label, href]) => (
          <Link key={label} href={href} className="flex items-center gap-3 px-4 py-3.5">
            <span>{icon}</span>
            <span className="flex-1">{label}</span>
            <span className="text-[var(--m-muted)]">›</span>
          </Link>
        ))}
      </div>

      <div className="m-card mt-4 p-4 text-sm">
        <p className="font-semibold">Hỗ trợ</p>
        <p className="mt-2 text-[var(--m-muted)]">{mobileBrand.phone}</p>
        <p className="text-[var(--m-muted)]">{mobileBrand.email}</p>
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-6 w-full rounded-xl border border-red-200 py-3 text-sm font-medium text-red-600"
      >
        Đăng xuất
      </button>
    </div>
  );
}
