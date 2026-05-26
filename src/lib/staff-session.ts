export const STAFF_ID_KEY = "hc365_staff_id";
export const STAFF_NAME_KEY = "hc365_staff_name";

export function getStaffSession(): { staffId: string; name: string } | null {
  if (typeof window === "undefined") return null;
  const staffId = localStorage.getItem(STAFF_ID_KEY);
  const name = localStorage.getItem(STAFF_NAME_KEY);
  if (!staffId || !name) return null;
  return { staffId, name };
}

export function setStaffSession(staffId: string, name: string) {
  localStorage.setItem(STAFF_ID_KEY, staffId);
  localStorage.setItem(STAFF_NAME_KEY, name);
}

export function clearStaffSession() {
  localStorage.removeItem(STAFF_ID_KEY);
  localStorage.removeItem(STAFF_NAME_KEY);
}
