import { NextRequest } from "next/server";
import { adminUnauthorizedResponse, isAdminAuthorized } from "@/lib/admin-auth";
import { listJobs, upsertJob } from "@/lib/ops-store";

export async function GET(request: NextRequest) {
  const staffId = request.nextUrl.searchParams.get("staffId") ?? undefined;
  const jobs = await listJobs(staffId);
  return Response.json({ ok: true, jobs });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    jobId?: string;
    customerName?: string;
    phone?: string;
    address?: string;
    serviceNote?: string;
    scheduledAt?: string;
  };
  if (!body.jobId || !body.customerName || !body.phone) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  const result = await upsertJob({
    jobId: body.jobId,
    customerName: body.customerName,
    phone: body.phone,
    address: body.address ?? "",
    serviceNote: body.serviceNote ?? "",
    scheduledAt: body.scheduledAt,
  });
  return Response.json(result);
}
