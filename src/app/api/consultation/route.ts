import {
  buildFullAddress,
  validateConsultationPayload,
  type ConsultationFormPayload,
} from "@/lib/consultation-form-utils";
import { appendRowToGoogleSheet, getWebhookUrl } from "@/lib/google-sheet-upstream";
import type { ConsultationSheetRow } from "@/lib/consultation-sheet";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export type ConsultationPayload = {
  fullName: string;
  phone: string;
  houseNumber: string;
  alley: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  note: string;
};

function parseBody(body: unknown): ConsultationPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const raw: ConsultationFormPayload = {
    fullName: String(b.fullName ?? "").trim(),
    phone: String(b.phone ?? "").trim(),
    houseNumber: String(b.houseNumber ?? "").trim(),
    alley: String(b.alley ?? "").trim(),
    street: String(b.street ?? "").trim(),
    ward: String(b.ward ?? "").trim(),
    district: String(b.district ?? "").trim(),
    city: String(b.city ?? "").trim(),
    note: String(b.note ?? "").trim(),
  };

  const result = validateConsultationPayload(raw);
  return result.ok ? result.payload : null;
}

export async function GET() {
  try {
    const res = await fetch(getWebhookUrl(), { cache: "no-store" });
    const text = await res.text();
    const data = JSON.parse(text) as { ok?: boolean };
    if (data.ok) {
      return NextResponse.json({ ok: true, channel: "google-sheet" });
    }
    return NextResponse.json({ ok: false }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}

export async function POST(request: Request) {
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
    city: data.city,
    note: data.note,
    fullAddress: buildFullAddress(data),
  };

  const result = await appendRowToGoogleSheet(sheetRow);

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Ghi Sheet thất bại." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
