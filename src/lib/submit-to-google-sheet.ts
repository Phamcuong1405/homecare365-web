import {
  GOOGLE_SHEETS_WEB_APP_URL,
  type ConsultationSheetRow,
} from "@/lib/consultation-sheet";

/** Gửi qua form ẩn — không mở email, không bắt đăng nhập Google */
export function submitToGoogleSheetDirect(
  row: ConsultationSheetRow,
  webAppUrl: string = GOOGLE_SHEETS_WEB_APP_URL,
): void {
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
  form.setAttribute("accept-charset", "UTF-8");

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
