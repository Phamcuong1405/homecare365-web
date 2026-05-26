import { getAdminKey } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { key?: string };
  const expected = getAdminKey();
  if (!expected) {
    return Response.json(
      { ok: false, error: "ADMIN_OPS_KEY not configured on server" },
      { status: 503 },
    );
  }
  if (body.key !== expected) {
    return Response.json({ ok: false, error: "invalid_key" }, { status: 401 });
  }
  return Response.json({ ok: true });
}
