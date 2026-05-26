import { NextRequest } from "next/server";

const HEADER = "x-admin-key";

export function getAdminKey(): string {
  return (process.env.ADMIN_OPS_KEY ?? process.env.ADMIN_API_KEY ?? "").trim();
}

export function isAdminAuthorized(request: NextRequest): boolean {
  const key = getAdminKey();
  if (!key) return false;
  const header = request.headers.get(HEADER);
  const auth = request.headers.get("authorization");
  if (header === key) return true;
  if (auth === `Bearer ${key}`) return true;
  return false;
}

export function adminUnauthorizedResponse() {
  return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
}
