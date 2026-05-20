/**
 * HomeCare365 — Nhận form tư vấn từ website → ghi Google Sheet
 *
 * Apps Script (dán code vào đây):
 * https://script.google.com/home/projects/1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs/edit
 *
 * Google Sheet:
 * https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/edit
 *
 * CÀI: Save → chạy setupHomeCare365Sheet → Deploy Web app (Me, Anyone)
 *      → copy URL /exec → Vercel GOOGLE_SHEETS_WEB_APP_URL
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

function parseIncoming_(e) {
  if (e && e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload);
  }
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }
  var raw = e.postData.contents;
  if (e.postData.type === "application/x-www-form-urlencoded") {
    var pairs = raw.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i].split("=");
      if (decodeURIComponent(kv[0]) === "payload" && kv[1]) {
        return JSON.parse(decodeURIComponent(kv[1].replace(/\+/g, " ")));
      }
    }
  }
  return JSON.parse(raw);
}

function doPost(e) {
  try {
    var data = parseIncoming_(e);
    appendRow_(data);
    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

/** Chạy thử trong editor — kiểm tra ghi Sheet (không cần website) */
function testAppendSampleRow() {
  appendRow_({
    submittedAt: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    fullName: "Nguyễn Văn Test",
    phone: "0901234567",
    houseNumber: "12",
    alley: "Ngõ 5",
    street: "Phố Huế",
    ward: "Kim Liên",
    district: "Đống Đa",
    note: "Dọn 80m2, 1 lần/tuần",
    fullAddress: "Số nhà 12, Ngõ/Hẻm Ngõ 5, Đường Phố Huế, Phường/Xã Kim Liên, Quận/Huyện Đống Đa",
  });
}
