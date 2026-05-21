import { applyTrackingUpdate, getTrackingSession } from "@/lib/tracking-store";
import type { TrackingUpdatePayload } from "@/lib/tracking-types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteCtx = { params: Promise<{ jobId: string }> };

export async function GET(_req: Request, ctx: RouteCtx) {
  const { jobId } = await ctx.params;
  const session = await getTrackingSession(jobId);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Không tìm thấy đơn theo dõi" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, session });
}

export async function POST(req: Request, ctx: RouteCtx) {
  const { jobId } = await ctx.params;
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Body không hợp lệ" }, { status: 400 });
  }

  const action = body.action as TrackingUpdatePayload["action"];
  if (!action || !["trackingStart", "trackingUpdate", "trackingStop"].includes(action)) {
    return NextResponse.json({ ok: false, error: "action không hợp lệ" }, { status: 400 });
  }

  const payload: TrackingUpdatePayload = {
    action,
    jobId,
    staffName: typeof body.staffName === "string" ? body.staffName : undefined,
    staffLat: typeof body.staffLat === "number" ? body.staffLat : undefined,
    staffLng: typeof body.staffLng === "number" ? body.staffLng : undefined,
    destLat: typeof body.destLat === "number" ? body.destLat : undefined,
    destLng: typeof body.destLng === "number" ? body.destLng : undefined,
    destAddress: typeof body.destAddress === "string" ? body.destAddress : undefined,
    status:
      typeof body.status === "string"
        ? (body.status as TrackingUpdatePayload["status"])
        : undefined,
    sharing: typeof body.sharing === "boolean" ? body.sharing : undefined,
  };

  const session = await applyTrackingUpdate(payload);
  return NextResponse.json({ ok: true, session });
}
