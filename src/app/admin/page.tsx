"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminKeyFromSession } from "@/lib/admin-session";
import type { JobRecord, StaffRecord } from "@/lib/ops-types";

export default function AdminDashboardPage() {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [staff, setStaff] = useState<StaffRecord[]>([]);

  useEffect(() => {
    const key = getAdminKeyFromSession();
    Promise.all([
      fetch("/api/ops/jobs").then((r) => r.json()),
      fetch("/api/ops/staff", { headers: { "x-admin-key": key } }).then((r) => r.json()),
    ]).then(([j, s]) => {
      if (j.ok) setJobs(j.jobs as JobRecord[]);
      if (s.ok) setStaff(s.staff as StaffRecord[]);
    });
  }, []);

  const newJobs = jobs.filter((j) => j.status === "new").length;
  const pendingStaff = staff.filter((s) => s.status === "pending").length;

  return (
    <AdminShell>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="admin-card">
          <p className="text-2xl font-bold text-[var(--a-primary)]">{jobs.length}</p>
          <p className="text-xs text-[var(--a-muted)]">Tổng công việc</p>
        </div>
        <div className="admin-card">
          <p className="text-2xl font-bold text-orange-600">{newJobs}</p>
          <p className="text-xs text-[var(--a-muted)]">Chờ phân công</p>
        </div>
        <div className="admin-card">
          <p className="text-2xl font-bold text-red-600">{pendingStaff}</p>
          <p className="text-xs text-[var(--a-muted)]">NV chờ duyệt</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/jobs" className="admin-btn">
          Phân công việc →
        </Link>
        <Link href="/admin/staff" className="admin-btn admin-btn-accent">
          Duyệt nhân viên →
        </Link>
      </div>

      <p className="mt-6 text-xs text-[var(--a-muted)]">
        Ví dụ: phân việc <strong>HC123</strong> cho nhân viên <strong>NV001</strong> tại mục Công việc.
      </p>
    </AdminShell>
  );
}
