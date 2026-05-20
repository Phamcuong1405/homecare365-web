import {
  GOOGLE_SHEETS_WEB_APP_URL,
  type ConsultationSheetRow,
} from "@/lib/consultation-sheet";

/**
 * Gửi thẳng tới Apps Script (JSON POST, no-cors).
 * Không mở email / không bắt đăng nhập — khách chỉ thấy thông báo thành công trên web.
 */
export async function submitToGoogleSheetDirect(
  row: ConsultationSheetRow,
  webAppUrl: string = GOOGLE_SHEETS_WEB_APP_URL,
): Promise<void> {
  await fetch(webAppUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  });
}

export function getSheetWebhookUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL?.trim();
  if (
    fromEnv?.startsWith("https://script.google.com/macros/s/") &&
    fromEnv.endsWith("/exec")
  ) {
    return fromEnv;
  }
  return GOOGLE_SHEETS_WEB_APP_URL;
}
