"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearStaffSession, getStaffSession } from "@/lib/staff-session";
import type { JobRecord } from "@/lib/ops-types";

const STATUS_LABEL: Record<string, string> = {
  new: "Mới",
  assigned: "Đã giao cho bạn",
  in_progress: "Đang làm",
  done: "Xong",
};

export default function StaffHomePage() {
  const router = useRouter();
  const [session, setSession] = useState<{ staffId: string; name: string } | null>(null);
  const [jobs, setJobs] = useState<JobRecord[]>([]);

  useEffect(() => {
    const s = getStaffSession();
    if (!s) {
      router.replace("/m/staff/login");
      return;
    }
    setSession(s);
    fetch(`/api/ops/jobs?staffId=${encodeURIComponent(s.staffId)}`)
      .then((r) => r.json())
      .then((data: { ok: boolean; jobs?: JobRecord[] }) => {
        if (data.ok && data.jobs) setJobs(data.jobs);
      });
  }, [router]);

  function logout() {
    clearStaffSession();
    router.replace("/m/staff/login");
  }

  if (!session) return null;

  return (
    <div className="pb-8">
      <header className="m-glass px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--m-muted)]">Xin chào,</p>
            <p className="font-bold">{session.name}</p>
            <p className="font-mono text-xs text-[var(--m-trust)]">{session.staffId}</p>
          </div>
          <button type="button" onClick={logout} className="text-xs text-[var(--m-muted)] underline">
            Thoát
          </button>
        </div>
      </header>

      <div className="px-4 pt-4">
        <h2 className="text-sm font-bold">Việc được giao</h2>
        <p className="text-[10px] text-[var(--m-muted)]">Quản lý phân công từ bảng điều phối</p>

        <ul className="mt-3 space-y-3">
          {jobs.map((job) => (
            <li key={job.jobId} className="m-card p-4">
              <p className="font-mono text-xs font-bold text-[var(--m-trust)]">{job.jobId}</p>
              <p className="font-semibold">{job.customerName}</p>
              <p className="text-xs text-[var(--m-muted)]">{job.phone}</p>
              <p className="mt-1 text-xs line-clamp-2">{job.address}</p>
              <p className="mt-2 text-[10px]">{job.serviceNote}</p>
              <span className="mt-2 inline-block rounded-full bg-[var(--m-warm)] px-2 py-0.5 text-[10px] font-semibold">
                {STATUS_LABEL[job.status] ?? job.status}
              </span>
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/m/staff/track?job=${encodeURIComponent(job.jobId)}`}
                  className="m-btn-primary flex-1 py-2.5 text-center text-xs"
                >
                  Chia sẻ GPS
                </Link>
                <a href={`tel:${job.phone}`} className="rounded-xl border border-[var(--m-primary)] px-3 py-2.5 text-xs font-semibold text-[var(--m-primary-dark)]">
                  Gọi KH
                </a>
              </div>
            </li>
          ))}
        </ul>

        {jobs.length === 0 ? (
          <div className="m-card mt-4 p-4 text-center text-sm text-[var(--m-muted)]">
            Chưa có việc được giao. Liên hệ quản lý khi có đơn mới.
          </div>
        ) : null}
      </div>
    </div>
  );
}
