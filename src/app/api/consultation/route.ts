import { buildFullAddress, normalizeConsultationPayload } from "@/lib/consultation-form-utils";
import {
  GOOGLE_SHEETS_WEB_APP_URL,
  type ConsultationSheetRow,
} from "@/lib/consultation-sheet";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

function getWebhookUrl(): string {
  const raw = process.env.GOOGLE_SHEETS_WEB_APP_URL?.trim().replace(/^['"]|['"]$/g, "");
  if (raw?.startsWith("https://script.google.com/macros/s/") && raw.endsWith("/exec")) {
    return raw;
  }
  return GOOGLE_SHEETS_WEB_APP_URL;
}

export type ConsultationPayload = {
  fullName: string;
  phone: string;
  houseNumber: string;
  alley: string;
  street: string;
  ward: string;
  district: string;
  note: string;
};

function parseBody(body: unknown): ConsultationPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const normalized = normalizeConsultationPayload({
    fullName: String(b.fullName ?? "").trim(),
    phone: String(b.phone ?? "").trim(),
    houseNumber: String(b.houseNumber ?? "").trim(),
    alley: String(b.alley ?? "").trim(),
    street: String(b.street ?? "").trim(),
    ward: String(b.ward ?? "").trim(),
    district: String(b.district ?? "").trim(),
    note: String(b.note ?? "").trim(),
  });

  if (
    !normalized.fullName ||
    !normalized.phone ||
    !normalized.houseNumber ||
    !normalized.street ||
    !normalized.ward ||
    !normalized.district
  ) {
    return null;
  }

  return normalized;
}

export async function POST(request: Request) {
  const webhookUrl = getWebhookUrl();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const data = parseBody(body);
  if (!data) {
    return NextResponse.json(
      { error: "Vui lòng điền đầy đủ các trường bắt buộc (*)." },
      { status: 400 },
    );
  }

  const sheetRow: ConsultationSheetRow = {
    submittedAt: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    fullName: data.fullName,
    phone: data.phone,
    houseNumber: data.houseNumber,
    alley: data.alley,
    street: data.street,
    ward: data.ward,
    district: data.district,
    note: data.note,
    fullAddress: buildFullAddress(data),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sheetRow),
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await upstream.text();

    if (
      text.includes("accounts.google.com") ||
      text.includes("Sign in") ||
      text.trimStart().startsWith("<!")
    ) {
      return NextResponse.json(
        {
          error:
            "Google Apps Script chưa mở công khai. Deploy lại Web app với Who has access: Anyone.",
        },
        { status: 502 },
      );
    }

    let result: { ok?: boolean; error?: string } = {};
    try {
      result = JSON.parse(text) as { ok?: boolean; error?: string };
    } catch {
      result = { ok: upstream.ok };
    }

    if (!upstream.ok || result.ok === false) {
      return NextResponse.json(
        { error: result.error ?? "Không ghi được dữ liệu vào Google Sheet." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Không kết nối được Google Sheet. Thử lại sau vài phút." },
      { status: 502 },
    );
  }
}
