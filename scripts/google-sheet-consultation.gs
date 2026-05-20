/**
 * HomeCare365 — Ghi form Đặt lịch tư vấn vào Google Sheet
 *
 * Sheet: https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/edit
 *
 * CÀI ĐẶT:
 * 1. Mở Sheet trên → Extensions → Apps Script
 * 2. Dán file này → Save
 * 3. Chạy 1 lần: setupHomeCare365Sheet (cho phép quyền)
 * 4. Deploy → New deployment → Web app (Execute as: Me, Anyone)
 * 5. Copy URL → Vercel env GOOGLE_SHEETS_WEB_APP_URL
 */

var SPREADSHEET_ID = "1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8";
var SHEET_GID = 0;
var SHEET_TAB_NAME = "Khách hàng";

var HEADERS = [
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
];

function getSpreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet_() {
  var ss = getSpreadsheet_();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === SHEET_GID) {
      return sheets[i];
    }
  }
  return sheets[0];
}

/** Chạy 1 lần trong trình soạn Apps Script để tạo tiêu đề cột */
function setupHomeCare365Sheet() {
  var sheet = getSheet_();
  sheet.setName(SHEET_TAB_NAME);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight("bold")
    .setBackground("#0047ab")
    .setFontColor("#ffffff");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
}

function ensureHeaderRow_() {
  var sheet = getSheet_();
  var firstCell = sheet.getRange(1, 1).getValue();
  if (firstCell !== HEADERS[0]) {
    setupHomeCare365Sheet();
  }
}

function appendRow_(data) {
  ensureHeaderRow_();
  var sheet = getSheet_();
  sheet.appendRow([
    data.submittedAt || new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    data.fullName || "",
    data.phone || "",
    data.houseNumber || "",
    data.alley || "",
    data.street || "",
    data.ward || "",
    data.district || "",
    data.note || "",
    data.fullAddress || "",
  ]);
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: "HomeCare365 consultation webhook",
    spreadsheetId: SPREADSHEET_ID,
    columns: HEADERS,
  });
}

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    var data = JSON.parse(raw);
    appendRow_(data);
    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}
