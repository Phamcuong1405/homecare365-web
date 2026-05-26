"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminKeyFromSession } from "@/lib/admin-session";
import type { JobRecord, StaffRecord } from "@/lib/ops-types";

const STATUS_LABEL: Record<string, string> = {
  new: "Mới",
  assigned: "Đã giao",
  in_progress: "Đang làm",
  done: "Hoàn thành",
  cancelled: "Hủy",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [staff, setStaff] = useState<StaffRecord[]>([]);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const key = getAdminKeyFromSession();
    const [jRes, sRes] = await Promise.all([
      fetch("/api/ops/jobs"),
      fetch("/api/ops/staff", { headers: { "x-admin-key": key } }),
    ]);
    const j = (await jRes.json()) as { ok: boolean; jobs?: JobRecord[] };
    const s = (await sRes.json()) as { ok: boolean; staff?: StaffRecord[] };
    if (j.ok && j.jobs) setJobs(j.jobs);
    if (s.ok && s.staff) setStaff(s.staff.filter((x) => x.status === "active"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAssign(jobId: string) {
    const staffId = selectedStaff[jobId];
    if (!staffId) {
      setMsg("Chọn nhân viên trước");
      return;
    }
    const person = staff.find((s) => s.staffId === staffId);
    if (!person) return;

    setAssigning(jobId);
    setMsg("");
    const key = getAdminKeyFromSession();
    const res = await fetch("/api/ops/jobs/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ jobId, staffId, staffName: person.name }),
    });
    const data = (await res.json()) as { ok: boolean };
    setAssigning(null);
    if (data.ok) {
      setMsg(`Đã giao ${jobId} → ${staffId} (${person.name})`);
      load();
    } else {
      setMsg("Phân công thất bại");
    }
  }

  const activeStaff = staff;

  return (
    <AdminShell>
      <h2 className="text-base font-bold">Công việc — phân công</h2>
      <p className="text-xs text-[var(--a-muted)]">Chọn NV (vd. NV001) rồi bấm Giao việc</p>
      {msg ? <p className="mt-2 text-sm text-[var(--a-accent)]">{msg}</p> : null}

      <ul className="mt-4 space-y-3">
        {[...jobs].reverse().map((job) => (
          <li key={job.jobId} className="admin-card">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs font-bold text-[var(--a-primary)]">{job.jobId}</p>
                <p className="font-semibold">{job.customerName}</p>
                <p className="text-xs text-[var(--a-muted)]">{job.phone}</p>
                <p className="mt-1 line-clamp-2 text-xs">{job.address}</p>
                <p className="mt-1 text-xs">{job.serviceNote}</p>
              </div>
              <span
                className={`admin-badge ${
                  job.status === "new" ? "admin-badge-new" : "admin-badge-assigned"
                }`}
              >
                {STATUS_LABEL[job.status] ?? job.status}
              </span>
            </div>

            {job.staffId ? (
              <p className="mt-2 text-xs">
                NV: <strong>{job.staffId}</strong> — {job.staffName}
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                <select
                  className="admin-input max-w-[140px] py-2 text-xs"
                  value={selectedStaff[job.jobId] ?? ""}
                  onChange={(e) =>
                    setSelectedStaff((prev) => ({ ...prev, [job.jobId]: e.target.value }))
                  }
                >
                  <option value="">— Chọn NV —</option>
                  {activeStaff.map((s) => (
                    <option key={s.staffId} value={s.staffId}>
                      {s.staffId} — {s.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="admin-btn py-2 text-xs"
                  disabled={assigning === job.jobId}
                  onClick={() => handleAssign(job.jobId)}
                >
                  {assigning === job.jobId ? "…" : "Giao việc"}
                </button>
              </div>
            )}

            <Link
              href={`/m/tracking?job=${encodeURIComponent(job.jobId)}`}
              className="mt-2 inline-block text-xs text-[var(--a-primary)] underline"
            >
              Xem theo dõi GPS
            </Link>
          </li>
        ))}
      </ul>

      {jobs.length === 0 ? (
        <p className="admin-card mt-4 text-sm text-[var(--a-muted)]">
          Chưa có việc. Khách đặt lịch trên app sẽ tự tạo mã việc (HC…).
        </p>
      ) : null}
    </AdminShell>
  );
}
