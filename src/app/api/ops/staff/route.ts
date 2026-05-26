import { NextRequest } from "next/server";
import { adminUnauthorizedResponse, isAdminAuthorized } from "@/lib/admin-auth";
import { listStaff, registerStaff, updateStaffStatus } from "@/lib/ops-store";
import type { StaffStatus } from "@/lib/ops-types";

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) return adminUnauthorizedResponse();
  const staff = await listStaff();
  return Response.json({ ok: true, staff });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name?: string;
    phone?: string;
    email?: string;
    pin?: string;
  };
  if (!body.name?.trim() || !body.phone?.trim() || !body.pin?.trim()) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  const result = await registerStaff({
    name: body.name.trim(),
    phone: body.phone.trim(),
    email: body.email?.trim(),
    pin: body.pin.trim(),
  });
  if (!result.ok) {
    return Response.json(result, { status: 400 });
  }
  return Response.json(result);
}

export async function PATCH(request: NextRequest) {
  if (!isAdminAuthorized(request)) return adminUnauthorizedResponse();
  const body = (await request.json()) as { staffId?: string; status?: StaffStatus };
  if (!body.staffId || !body.status) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  const result = await updateStaffStatus(body.staffId, body.status);
  if (!result.ok) return Response.json(result, { status: 404 });
  return Response.json(result);
}
