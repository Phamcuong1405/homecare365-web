export type ConsultationFormPayload = {
  fullName: string;
  phone: string;
  houseNumber: string;
  alley: string;
  street: string;
  ward: string;
  district: string;
  note: string;
};

const FIELD_LABELS: Record<keyof ConsultationFormPayload, string> = {
  fullName: "Họ và tên",
  phone: "Số điện thoại",
  houseNumber: "Số nhà",
  alley: "Ngõ / Hẻm",
  street: "Tên đường",
  ward: "Phường / Xã",
  district: "Quận / Huyện",
  note: "Nhu cầu dọn dẹp",
};

function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").trim();
}

/** Số VN: 9–11 chữ số sau khi bỏ ký tự thừa */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length >= 11) {
    return digits.length <= 12;
  }
  if (digits.startsWith("0")) {
    return digits.length >= 10 && digits.length <= 11;
  }
  return digits.length >= 9 && digits.length <= 11;
}

/** Chuẩn hóa — nhiều khách chỉ điền ngõ/hẻm, bỏ trống tên đường */
export function normalizeConsultationPayload(
  raw: ConsultationFormPayload,
): ConsultationFormPayload {
  const payload = { ...raw, phone: normalizePhone(raw.phone) };

  if (!payload.street && payload.alley) {
    payload.street = payload.alley;
  }

  if (!payload.alley && payload.street) {
    payload.alley = "";
  }

  return payload;
}

export type ConsultationFieldKey =
  | "name"
  | "phone"
  | "houseNumber"
  | "street"
  | "ward"
  | "district";

/** Kiểm tra trước normalize — không coi ngõ/hẻm là đã điền tên đường khi còn trống */
export function getMissingFieldKeys(payload: ConsultationFormPayload): ConsultationFieldKey[] {
  const missing: ConsultationFieldKey[] = [];

  if (!payload.fullName.trim() || payload.fullName.trim().length < 2) {
    missing.push("name");
  }
  if (!payload.phone.trim() || !isValidPhone(normalizePhone(payload.phone))) {
    missing.push("phone");
  }
  if (!payload.houseNumber.trim()) missing.push("houseNumber");
  if (!payload.street.trim() && !payload.alley.trim()) missing.push("street");
  if (!payload.ward.trim()) missing.push("ward");
  if (!payload.district.trim()) missing.push("district");

  return missing;
}

export function validateConsultationPayload(
  raw: ConsultationFormPayload,
): { ok: true; payload: ConsultationFormPayload } | { ok: false; missingKeys: ConsultationFieldKey[]; message: string } {
  const missingKeys = getMissingFieldKeys(raw);
  if (missingKeys.length > 0) {
    return {
      ok: false,
      missingKeys,
      message: `Vui lòng điền đầy đủ: ${getMissingFieldLabels(missingKeys).join(", ")}.`,
    };
  }
  return { ok: true, payload: normalizeConsultationPayload(raw) };
}

export function getMissingFieldLabels(keys: ConsultationFieldKey[]): string[] {
  const labelMap: Record<ConsultationFieldKey, string> = {
    name: FIELD_LABELS.fullName,
    phone: FIELD_LABELS.phone,
    houseNumber: FIELD_LABELS.houseNumber,
    street: "Tên đường (hoặc Ngõ / Hẻm)",
    ward: FIELD_LABELS.ward,
    district: FIELD_LABELS.district,
  };
  return keys.map((k) => labelMap[k]);
}

export function buildFullAddress(payload: ConsultationFormPayload): string {
  const parts = [
    payload.houseNumber && `Số nhà ${payload.houseNumber}`,
    payload.alley && payload.alley !== payload.street && `Ngõ/Hẻm ${payload.alley}`,
    payload.street && `Đường ${payload.street}`,
    payload.ward && `Phường/Xã ${payload.ward}`,
    payload.district && `Quận/Huyện ${payload.district}`,
  ].filter(Boolean);

  return parts.join(", ");
}
