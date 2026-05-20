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

/** Chuẩn hóa — nhiều khách chỉ điền ngõ/hẻm, bỏ trống tên đường */
export function normalizeConsultationPayload(
  raw: ConsultationFormPayload,
): ConsultationFormPayload {
  const payload = { ...raw };

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

export function getMissingFieldKeys(payload: ConsultationFormPayload): ConsultationFieldKey[] {
  const missing: ConsultationFieldKey[] = [];

  if (!payload.fullName) missing.push("name");
  if (!payload.phone) missing.push("phone");
  if (!payload.houseNumber) missing.push("houseNumber");
  if (!payload.street) missing.push("street");
  if (!payload.ward) missing.push("ward");
  if (!payload.district) missing.push("district");

  return missing;
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
