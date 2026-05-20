import type { ConsultationFormPayload } from "@/lib/consultation-form-utils";
import {
  buildFullAddress,
  getMissingFieldKeys,
  getMissingFieldLabels,
  normalizeConsultationPayload,
} from "@/lib/consultation-form-utils";
import type { ConsultationSheetRow } from "@/lib/consultation-sheet";
import { submitViaHiddenForm } from "@/lib/submit-to-google-sheet";

const API_PATH = "/api/consultation";
const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 28000;

export type SubmitResult =
  | { ok: true }
  | { ok: false; type: "validation"; message: string }
  | { ok: false; type: "network"; message: string };

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toSheetRow(payload: ConsultationFormPayload): ConsultationSheetRow {
  return {
    submittedAt: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    fullName: payload.fullName,
    phone: payload.phone,
    houseNumber: payload.houseNumber,
    alley: payload.alley,
    street: payload.street,
    ward: payload.ward,
    district: payload.district,
    note: payload.note,
    fullAddress: buildFullAddress(payload),
  };
}

async function postToApi(payload: ConsultationFormPayload): Promise<{
  ok: boolean;
  status: number;
  error?: string;
}> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(API_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "same-origin",
      cache: "no-store",
      signal: controller.signal,
      keepalive: true,
    });

    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: res.ok, status: res.status, error: data.error };
  } catch {
    return { ok: false, status: 0, error: "network" };
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * Luồng gửi tối ưu đa nền tảng:
 * 1. API server (xác nhận được) — thử tối đa 3 lần
 * 2. Nếu vẫn lỗi: form ẩn tới Google Sheet + thử API lần cuối
 */
export async function submitConsultation(
  raw: ConsultationFormPayload,
): Promise<SubmitResult> {
  const payload = normalizeConsultationPayload(raw);
  const missing = getMissingFieldKeys(payload);

  if (missing.length > 0) {
    return {
      ok: false,
      type: "validation",
      message: `Vui lòng điền: ${getMissingFieldLabels(missing).join(", ")}.`,
    };
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const result = await postToApi(payload);

    if (result.ok) {
      return { ok: true };
    }

    if (result.status === 400) {
      return {
        ok: false,
        type: "validation",
        message: result.error ?? "Vui lòng kiểm tra lại thông tin.",
      };
    }

    if (attempt < MAX_ATTEMPTS - 1) {
      await sleep(900 * (attempt + 1));
    }
  }

  const sheetRow = toSheetRow(payload);
  submitViaHiddenForm(sheetRow);
  await sleep(1500);

  const lastTry = await postToApi(payload);
  if (lastTry.ok) {
    return { ok: true };
  }

  return {
    ok: false,
    type: "network",
    message:
      "Không gửi được yêu cầu lúc này. Vui lòng thử lại sau 1 phút hoặc gọi hotline.",
  };
}
