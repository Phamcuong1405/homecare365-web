import { getAdminKey, getAdminPassword, verifyAdminLogin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    username?: string;
    password?: string;
    key?: string;
  };

  const adminKey = getAdminKey();
  if (!adminKey && !getAdminPassword()) {
    return Response.json(
      { ok: false, error: "admin_not_configured" },
      { status: 503 },
    );
  }

  if (!verifyAdminLogin(body)) {
    return Response.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  return Response.json({
    ok: true,
    token: adminKey,
    username: body.username?.trim() || "admin",
  });
}
