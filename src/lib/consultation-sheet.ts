/**
 * Cột Google Sheet — khớp form https://www.homecare365.vn/#dat-lich-tu-van
 * Sheet: https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/
 */
export const GOOGLE_SHEET_ID = "1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8";

export const CONSULTATION_SHEET_HEADERS = [
  "Thời gian",
  "Họ và tên",
  "Số điện thoại",
  "Số nhà",
  "Ngõ/Hẻm",
  "Tên đường",
  "Phường/Xã",
  "Quận/Huyện",
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
  note: string;
  fullAddress: string;
};
