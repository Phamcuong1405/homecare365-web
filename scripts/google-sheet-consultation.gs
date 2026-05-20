/**
 * HomeCare365 — Ghi form tư vấn vào Google Sheet
 *
 * CÁCH CÀI:
 * 1. Tạo Google Sheet mới, dòng 1 (tiêu đề):
 *    Thời gian | Họ và tên | Số điện thoại | Số nhà | Ngõ/Hẻm | Tên đường | Phường/Xã | Quận/Huyện | Nhu cầu dọn dẹp | Địa chỉ đầy đủ
 * 2. Extensions → Apps Script → dán toàn bộ file này → Save
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy URL deployment → dán vào Vercel/local:
 *    GOOGLE_SHEETS_WEB_APP_URL=<url>
 */

var SHEET_NAME = "Khách hàng";

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getActiveSheet();
  }
  return sheet;
}

function ensureHeaderRow_() {
  var sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
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
    ]);
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
  return jsonResponse_({ ok: true, message: "HomeCare365 consultation webhook" });
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
