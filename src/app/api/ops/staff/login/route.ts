import { staffLogin } from "@/lib/ops-store";

export async function POST(request: Request) {
  const body = (await request.json()) as { staffId?: string; pin?: string };
  if (!body.staffId?.trim() || !body.pin?.trim()) {
    return Response.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  const result = await staffLogin(body.staffId.trim(), body.pin.trim());
  if (!result.ok) {
    const status = result.error === "not_found" ? 404 : 403;
    return Response.json(result, { status });
  }
  return Response.json(result);
}
