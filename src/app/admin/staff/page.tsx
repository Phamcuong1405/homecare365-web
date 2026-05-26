"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminKeyFromSession } from "@/lib/admin-session";
import type { StaffRecord } from "@/lib/ops-types";

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ duyệt",
  active: "Đang hoạt động",
  inactive: "Ngưng",
};

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffRecord[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    const key = getAdminKeyFromSession();
    const res = await fetch("/api/ops/staff", { headers: { "x-admin-key": key } });
    const data = (await res.json()) as { ok: boolean; staff?: StaffRecord[] };
    if (data.ok && data.staff) setStaff(data.staff);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function approve(staffId: string) {
    setLoading(staffId);
    const key = getAdminKeyFromSession();
    await fetch("/api/ops/staff", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ staffId, status: "active" }),
    });
    setLoading(null);
    load();
  }

  return (
    <AdminShell>
      <h2 className="text-base font-bold">Nhân viên</h2>
      <p className="text-xs text-[var(--a-muted)]">
        Duyệt đăng ký từ app NV — sau khi duyệt họ đăng nhập bằng mã NV + PIN
      </p>

      <ul className="mt-4 space-y-3">
        {staff.map((s) => (
          <li key={s.staffId} className="admin-card flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-mono text-sm font-bold text-[var(--a-primary)]">{s.staffId}</p>
              <p className="font-semibold">{s.name}</p>
              <p className="text-xs text-[var(--a-muted)]">
                {s.phone} {s.email ? `· ${s.email}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`admin-badge ${
                  s.status === "pending" ? "admin-badge-pending" : "admin-badge-active"
                }`}
              >
                {STATUS_LABEL[s.status] ?? s.status}
              </span>
              {s.status === "pending" ? (
                <button
                  type="button"
                  className="admin-btn admin-btn-accent py-2 text-xs"
                  disabled={loading === s.staffId}
                  onClick={() => approve(s.staffId)}
                >
                  Duyệt
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {staff.length === 0 ? (
        <p className="admin-card mt-4 text-sm text-[var(--a-muted)]">
          Chưa có nhân viên. Hướng dẫn đăng ký tại{" "}
          <a href="/m/staff/register" className="underline">
            /m/staff/register
          </a>
        </p>
      ) : null}
    </AdminShell>
  );
}
