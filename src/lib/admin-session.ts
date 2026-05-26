export const ADMIN_STORAGE_KEY = "hc365_admin_key";

export function getAdminKeyFromSession(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(ADMIN_STORAGE_KEY) ?? "";
}
