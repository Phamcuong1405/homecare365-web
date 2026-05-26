import { getWebhookUrl } from "@/lib/google-sheet-upstream";
import type {
  JobAssignInput,
  JobCreateInput,
  JobRecord,
  JobStatus,
  StaffRecord,
  StaffRegisterInput,
  StaffStatus,
} from "@/lib/ops-types";

const STAFF_MEM = "__hc365_staff__";
const JOBS_MEM = "__hc365_jobs__";

function staffMap(): Map<string, StaffRecord & { pin: string }> {
  const g = globalThis as typeof globalThis & { [STAFF_MEM]?: Map<string, StaffRecord & { pin: string }> };
  if (!g[STAFF_MEM]) g[STAFF_MEM] = new Map();
  return g[STAFF_MEM];
}

function jobsMap(): Map<string, JobRecord> {
  const g = globalThis as typeof globalThis & { [JOBS_MEM]?: Map<string, JobRecord> };
  if (!g[JOBS_MEM]) g[JOBS_MEM] = new Map();
  return g[JOBS_MEM];
}

async function gasPost(payload: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const base = getWebhookUrl();
  if (!base.includes("script.google.com")) return null;
  try {
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function gasGet(params: Record<string, string>): Promise<Record<string, unknown> | null> {
  const base = getWebhookUrl();
  if (!base.includes("script.google.com")) return null;
  const qs = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`${base}?${qs}`, { cache: "no-store" });
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function stripPin(s: StaffRecord & { pin?: string }): StaffRecord {
  const { pin: _p, ...rest } = s;
  return rest as StaffRecord;
}

export async function listStaff(): Promise<StaffRecord[]> {
  const fromGas = await gasGet({ action: "staffList" });
  if (fromGas?.ok && Array.isArray(fromGas.staff)) {
    const list = fromGas.staff as StaffRecord[];
    list.forEach((s) => staffMap().set(s.staffId, { ...s, pin: "" }));
    return list;
  }
  return [...staffMap().values()].map(stripPin);
}

export async function registerStaff(input: StaffRegisterInput): Promise<{ ok: boolean; staff?: StaffRecord; error?: string }> {
  const fromGas = await gasPost({ action: "staffRegister", ...input });
  if (fromGas?.ok && fromGas.staff) {
    const staff = fromGas.staff as StaffRecord;
    staffMap().set(staff.staffId, { ...staff, pin: input.pin });
    return { ok: true, staff };
  }

  const id = `NV${String(staffMap().size + 1).padStart(3, "0")}`;
  const staff: StaffRecord = {
    staffId: id,
    name: input.name,
    phone: input.phone,
    email: input.email ?? "",
    status: "pending",
    registeredAt: new Date().toISOString(),
  };
  staffMap().set(id, { ...staff, pin: input.pin });
  return { ok: true, staff };
}

export async function updateStaffStatus(
  staffId: string,
  status: StaffStatus,
): Promise<{ ok: boolean; staff?: StaffRecord }> {
  const fromGas = await gasPost({ action: "staffUpdate", staffId, status });
  if (fromGas?.ok && fromGas.staff) {
    const staff = fromGas.staff as StaffRecord;
    const prev = staffMap().get(staffId);
    staffMap().set(staffId, { ...staff, pin: prev?.pin ?? "" });
    return { ok: true, staff };
  }

  const prev = staffMap().get(staffId);
  if (!prev) return { ok: false };
  const staff = stripPin({ ...prev, status });
  staffMap().set(staffId, { ...staff, pin: prev.pin });
  return { ok: true, staff };
}

export async function staffLogin(
  staffId: string,
  pin: string,
): Promise<{ ok: boolean; staff?: StaffRecord; error?: string }> {
  const fromGas = await gasPost({ action: "staffLogin", staffId, pin });
  if (fromGas?.ok && fromGas.staff) {
    return { ok: true, staff: fromGas.staff as StaffRecord };
  }

  const s = staffMap().get(staffId);
  if (!s) return { ok: false, error: "not_found" };
  if (s.pin !== pin) return { ok: false, error: "invalid_pin" };
  if (s.status !== "active") return { ok: false, error: "not_active" };
  return { ok: true, staff: stripPin(s) };
}

export async function listJobs(staffId?: string): Promise<JobRecord[]> {
  const params: Record<string, string> = { action: "jobList" };
  if (staffId) params.staffId = staffId;
  const fromGas = await gasGet(params);
  if (fromGas?.ok && Array.isArray(fromGas.jobs)) {
    const jobs = fromGas.jobs as JobRecord[];
    jobs.forEach((j) => jobsMap().set(j.jobId, j));
    return staffId ? jobs.filter((j) => j.staffId === staffId) : jobs;
  }
  const all = [...jobsMap().values()];
  return staffId ? all.filter((j) => j.staffId === staffId) : all;
}

export async function upsertJob(input: JobCreateInput): Promise<{ ok: boolean; job?: JobRecord }> {
  const fromGas = await gasPost({ action: "jobUpsert", ...input });
  if (fromGas?.ok && fromGas.job) {
    const job = fromGas.job as JobRecord;
    jobsMap().set(job.jobId, job);
    return { ok: true, job };
  }

  const existing = jobsMap().get(input.jobId);
  const job: JobRecord = existing ?? {
    jobId: input.jobId,
    customerName: input.customerName,
    phone: input.phone,
    address: input.address,
    serviceNote: input.serviceNote,
    status: "new",
    staffId: "",
    staffName: "",
    scheduledAt: input.scheduledAt ?? "",
    createdAt: new Date().toISOString(),
    assignedAt: "",
  };
  if (!existing) {
    job.customerName = input.customerName;
    job.phone = input.phone;
    job.address = input.address;
    job.serviceNote = input.serviceNote;
    job.scheduledAt = input.scheduledAt ?? "";
  }
  jobsMap().set(job.jobId, job);
  return { ok: true, job };
}

export async function assignJob(input: JobAssignInput): Promise<{ ok: boolean; job?: JobRecord }> {
  const fromGas = await gasPost({ action: "jobAssign", ...input });
  if (fromGas?.ok && fromGas.job) {
    const job = fromGas.job as JobRecord;
    jobsMap().set(job.jobId, job);
    return { ok: true, job };
  }

  const job = jobsMap().get(input.jobId);
  if (!job) return { ok: false };
  job.staffId = input.staffId;
  job.staffName = input.staffName;
  job.status = "assigned" as JobStatus;
  job.assignedAt = new Date().toISOString();
  jobsMap().set(job.jobId, job);
  return { ok: true, job };
}

export async function updateJobStatus(jobId: string, status: JobStatus): Promise<{ ok: boolean; job?: JobRecord }> {
  const fromGas = await gasPost({ action: "jobStatus", jobId, status });
  if (fromGas?.ok && fromGas.job) {
    const job = fromGas.job as JobRecord;
    jobsMap().set(job.jobId, job);
    return { ok: true, job };
  }
  const job = jobsMap().get(jobId);
  if (!job) return { ok: false };
  job.status = status;
  jobsMap().set(jobId, job);
  return { ok: true, job };
}
