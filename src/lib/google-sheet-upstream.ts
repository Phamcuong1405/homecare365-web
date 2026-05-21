import { GOOGLE_SHEETS_WEB_APP_URL } from "@/lib/consultation-sheet";
import type { ConsultationSheetRow } from "@/lib/consultation-sheet";

export function getWebhookUrl(): string {
  const raw = process.env.GOOGLE_SHEETS_WEB_APP_URL?.trim().replace(/^['"]|['"]$/g, "");
  if (raw?.startsWith("https://script.google.com/macros/s/") && raw.endsWith("/exec")) {
    return raw;
  }
  return GOOGLE_SHEETS_WEB_APP_URL;
}

function isLoginHtml(text: string): boolean {
  return (
    text.includes("accounts.google.com") ||
    text.includes("Sign in") ||
    text.trimStart().startsWith("<!")
  );
}

export async function appendRowToGoogleSheet(
  sheetRow: ConsultationSheetRow,
  webhookUrl = getWebhookUrl(),
): Promise<{ ok: boolean; error?: string }> {
  const attempts = 2;

  for (let i = 0; i < attempts; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 22000);

    try {
      const upstream = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(sheetRow),
        cache: "no-store",
        redirect: "follow",
        signal: controller.signal,
      });

      const text = await upstream.text();

      if (isLoginHtml(text)) {
        return {
          ok: false,
          error: "Google Apps Script chưa mở công khai (Anyone).",
        };
      }

      let parsed: { ok?: boolean; error?: string } = {};
      try {
        parsed = JSON.parse(text) as { ok?: boolean; error?: string };
      } catch {
        parsed = { ok: upstream.ok };
      }

      if (upstream.ok && parsed.ok !== false) {
        return { ok: true };
      }

      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 1200));
        continue;
      }

      return { ok: false, error: parsed.error ?? "Không ghi được vào Google Sheet." };
    } catch {
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 1200));
        continue;
      }
      return { ok: false, error: "Không kết nối Google Sheet." };
    } finally {
      clearTimeout(timer);
    }
  }

  return { ok: false, error: "Không ghi được vào Google Sheet." };
}
