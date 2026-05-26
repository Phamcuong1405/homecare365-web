/**
 * Cột Google Sheet — khớp form https://www.homecare365.vn/#dat-lich-tu-van
 * Sheet: https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/
 */
export const GOOGLE_SHEET_ID = "1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8";

/** Web App Deploy (Execute as: Me, Who has access: Anyone) */
export const GOOGLE_SHEETS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyo1UQaWaix0N-38hDPsvBiKxRBKdrmLsErvD7LPmm6aSTctKNm08bqnv48e8X5hVujfQ/exec";

export const CONSULTATION_SHEET_HEADERS = [
  "Thời gian",
  "Họ và tên",
  "Số điện thoại",
  "Số nhà",
  "Ngõ/Hẻm",
  "Tên đường",
  "Phường/Xã",
  "Quận/Huyện",
  "Thành phố",
  "Nhu cầu dọn dẹp",
  "Địa chỉ đầy đủ",
] as const;

/** Thứ tự trường gửi từ API → Apps Script (cùng thứ tự cột trên Sheet) */
export type ConsultationSheetRow = {
  submittedAt: string;
  fullName: string;
  phone: string;
  houseNumber: string;
  alley: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  note: string;
  fullAddress: string;
};
