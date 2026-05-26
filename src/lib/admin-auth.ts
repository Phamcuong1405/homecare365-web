import { NextRequest } from "next/server";

const HEADER = "x-admin-key";

export function getAdminKey(): string {
  return (process.env.ADMIN_OPS_KEY ?? process.env.ADMIN_API_KEY ?? "").trim();
}

export function getAdminUsername(): string {
  return (process.env.ADMIN_USERNAME ?? "admin").trim();
}

export function getAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD ?? "").trim();
}

/** Đăng nhập bằng tài khoản + mật khẩu hoặc mã ADMIN_OPS_KEY (legacy) */
export function verifyAdminLogin(input: {
  username?: string;
  password?: string;
  key?: string;
}): boolean {
  const adminKey = getAdminKey();
  if (input.key && adminKey && input.key === adminKey) return true;

  const expectedUser = getAdminUsername();
  const expectedPass = getAdminPassword();
  if (!expectedPass) return false;
  if (!input.username?.trim() || !input.password) return false;
  return input.username.trim() === expectedUser && input.password === expectedPass;
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
