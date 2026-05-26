import type { JobAssignInput, JobCreateInput, StaffRegisterInput } from "@/lib/ops-types";

async function opsFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  return res.json() as Promise<Record<string, unknown>>;
}

export async function registerStaffClient(input: StaffRegisterInput) {
  return opsFetch("/api/ops/staff", { method: "POST", body: JSON.stringify(input) });
}

export async function staffLoginClient(staffId: string, pin: string) {
  return opsFetch("/api/ops/staff/login", {
    method: "POST",
    body: JSON.stringify({ staffId, pin }),
  });
}

export async function createJobClient(input: JobCreateInput) {
  return opsFetch("/api/ops/jobs", { method: "POST", body: JSON.stringify(input) });
}

export async function assignJobClient(input: JobAssignInput, adminKey: string) {
  return opsFetch("/api/ops/jobs/assign", {
    method: "POST",
    headers: { "x-admin-key": adminKey },
    body: JSON.stringify(input),
  });
}

export async function listJobsClient(staffId?: string) {
  const q = staffId ? `?staffId=${encodeURIComponent(staffId)}` : "";
  return opsFetch(`/api/ops/jobs${q}`);
}

export async function listStaffClient(adminKey: string) {
  return opsFetch("/api/ops/staff", { headers: { "x-admin-key": adminKey } });
}

export async function approveStaffClient(staffId: string, adminKey: string) {
  return opsFetch("/api/ops/staff", {
    method: "PATCH",
    headers: { "x-admin-key": adminKey },
    body: JSON.stringify({ staffId, status: "active" }),
  });
}
