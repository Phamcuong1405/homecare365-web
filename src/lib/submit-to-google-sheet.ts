import {
  GOOGLE_SHEETS_WEB_APP_URL,
  type ConsultationSheetRow,
} from "@/lib/consultation-sheet";

/**
 * Dự phòng khi API server lỗi — POST form ẩn (iframe).
 * Tương thích Safari iOS / Chrome Android, không mở email hay đăng nhập Google.
 */
export function submitViaHiddenForm(
  row: ConsultationSheetRow,
  webAppUrl: string = GOOGLE_SHEETS_WEB_APP_URL,
): void {
  const frameName = `hc-sheet-${Date.now()}`;
  const iframe = document.createElement("iframe");
  iframe.name = frameName;
  iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
  iframe.setAttribute("aria-hidden", "true");
  iframe.setAttribute("tabindex", "-1");
  document.body.appendChild(iframe);

  const form = document.createElement("form");
  form.method = "POST";
  form.action = webAppUrl;
  form.target = frameName;
  form.acceptCharset = "UTF-8";
  form.style.cssText = "position:absolute;width:0;height:0;visibility:hidden";
  form.setAttribute("aria-hidden", "true");

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
  }, 5000);
}
