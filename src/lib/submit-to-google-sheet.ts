import type { ConsultationSheetRow } from "@/lib/consultation-sheet";

/** Gửi qua form ẩn — tránh CORS, không mở hộp thoại đăng nhập Windows Mail */
export function submitToGoogleSheetDirect(webAppUrl: string, row: ConsultationSheetRow): void {
  const frameName = `hc-sheet-${Date.now()}`;
  const iframe = document.createElement("iframe");
  iframe.name = frameName;
  iframe.style.display = "none";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  const form = document.createElement("form");
  form.method = "POST";
  form.action = webAppUrl;
  form.target = frameName;
  form.style.display = "none";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "payload";
  input.value = JSON.stringify(row);
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();

  window.setTimeout(() => {
    form.remove();
    iframe.remove();
  }, 4000);
}

export function getPublicSheetWebhookUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL?.trim();
  if (!raw?.startsWith("https://script.google.com/macros/s/") || !raw.endsWith("/exec")) {
    return null;
  }
  return raw;
}
