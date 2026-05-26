import { NextRequest } from "next/server";
import { adminUnauthorizedResponse, isAdminAuthorized } from "@/lib/admin-auth";
import { assignJob } from "@/lib/ops-store";
import { applyTrackingUpdate } from "@/lib/tracking-store";

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) return adminUnauthorizedResponse();
  const body = (await request.json()) as { jobId?: string; staffId?: string; staffName?: string };
  if (!body.jobId || !body.staffId || !body.staffName) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  const result = await assignJob({
    jobId: body.jobId,
    staffId: body.staffId,
    staffName: body.staffName,
  });
  if (!result.ok) return Response.json(result, { status: 404 });

  await applyTrackingUpdate({
    action: "trackingUpdate",
    jobId: body.jobId,
    staffName: body.staffName,
    status: "waiting",
  });

  return Response.json(result);
}
