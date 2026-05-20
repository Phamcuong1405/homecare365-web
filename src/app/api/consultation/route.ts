import type { ConsultationSheetRow } from "@/lib/consultation-sheet";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

function getWebhookUrl(): string | null {
  const raw = process.env.GOOGLE_SHEETS_WEB_APP_URL?.trim().replace(/^['"]|['"]$/g, "");
  if (!raw?.startsWith("https://script.google.com/macros/s/") || !raw.endsWith("/exec")) {
    return null;
  }
  return raw;
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

function buildFullAddress(data: ConsultationPayload): string {
  const parts = [
    data.houseNumber && `Số nhà ${data.houseNumber}`,
    data.alley && `Ngõ/Hẻm ${data.alley}`,
    data.street && `Đường ${data.street}`,
    data.ward && `Phường/Xã ${data.ward}`,
    data.district && `Quận/Huyện ${data.district}`,
  ].filter(Boolean);
  return parts.join(", ");
}

function parseBody(body: unknown): ConsultationPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const fullName = String(b.fullName ?? "").trim();
  const phone = String(b.phone ?? "").trim();
  const houseNumber = String(b.houseNumber ?? "").trim();
  const alley = String(b.alley ?? "").trim();
  const street = String(b.street ?? "").trim();
  const ward = String(b.ward ?? "").trim();
  const district = String(b.district ?? "").trim();
  const note = String(b.note ?? "").trim();

  if (!fullName || !phone || !houseNumber || !street || !ward || !district) {
    return null;
  }

  return { fullName, phone, houseNumber, alley, street, ward, district, note };
}

export async function POST(request: Request) {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Hệ thống chưa kết nối Google Sheet. Vui lòng liên hệ quản trị viên." },
      { status: 503 },
    );
  }

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
