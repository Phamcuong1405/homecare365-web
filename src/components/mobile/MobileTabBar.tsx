"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/m/home", label: "Trang chủ", icon: "🏠" },
  { href: "/m/bookings", label: "Đặt lịch", icon: "📅" },
  { href: "/m/membership", label: "Hội viên", icon: "⭐" },
  { href: "/m/notifications", label: "Thông báo", icon: "🔔" },
  { href: "/m/account", label: "Tài khoản", icon: "👤" },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="m-tab-bar m-glass fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 px-1 pt-2">
      <div className="mx-auto flex max-w-lg justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-1 text-[10px] font-medium ${
                active ? "text-[var(--m-primary)]" : "text-[var(--m-muted)]"
              }`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
