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
var TRACKING_TAB_NAME = "Theo_doi";

var HEADERS = [
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

/** Chạy 1 lần — tạo tab Theo_doi cho GPS tracking */
function setupTrackingSheet() {
  getTrackingSheet_();
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
    data.city || "",
    data.note || "",
    data.fullAddress || "",
  ]);
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function getTrackingSheet_() {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(TRACKING_TAB_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(TRACKING_TAB_NAME);
    sheet.appendRow([
      "jobId",
      "status",
      "staffName",
      "sharing",
      "staffLat",
      "staffLng",
      "destLat",
      "destLng",
      "destAddress",
      "pathJson",
      "updatedAt",
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#4caf50").setFontColor("#ffffff");
  }
  return sheet;
}

function trackingGet_(jobId) {
  var sheet = getTrackingSheet_();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(jobId)) {
      var pathJson = data[i][9] || "[]";
      var path = [];
      try {
        path = JSON.parse(pathJson);
      } catch (e) {
        path = [];
      }
      return jsonResponse_({
        ok: true,
        session: {
          jobId: String(data[i][0]),
          status: String(data[i][1] || "waiting"),
          staffName: String(data[i][2] || "Nhân viên HomeCare365"),
          sharing: data[i][3] === true || data[i][3] === "TRUE",
          staffLat: Number(data[i][4]) || 21.02,
          staffLng: Number(data[i][5]) || 105.82,
          destLat: Number(data[i][6]) || 21.0285,
          destLng: Number(data[i][7]) || 105.8542,
          destAddress: String(data[i][8] || ""),
          path: path,
          updatedAt: Number(data[i][10]) || Date.now(),
        },
      });
    }
  }
  return jsonResponse_({ ok: false, error: "not_found" });
}

function trackingUpsert_(data) {
  var sheet = getTrackingSheet_();
  var rows = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.jobId)) {
      rowIndex = i + 1;
      break;
    }
  }

  var existing = rowIndex > 0 ? rows[rowIndex - 1] : null;
  var path = [];
  if (existing && existing[9]) {
    try {
      path = JSON.parse(existing[9]);
    } catch (e2) {
      path = [];
    }
  }
  if (data.pathJson) {
    path = JSON.parse(data.pathJson);
  }

  var row = [
    data.jobId,
    data.status || "waiting",
    data.staffName || "Nhân viên HomeCare365",
    data.sharing === true,
    Number(data.staffLat) || 21.02,
    Number(data.staffLng) || 105.82,
    Number(data.destLat) || 21.0285,
    Number(data.destLng) || 105.8542,
    data.destAddress || "",
    JSON.stringify(path),
    data.updatedAt || Date.now(),
  ];

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, rowIndex, 11).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
  return jsonResponse_({ ok: true });
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "trackingGet" && e.parameter.jobId) {
    return trackingGet_(e.parameter.jobId);
  }
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
    if (data.action === "trackingStart" || data.action === "trackingUpdate" || data.action === "trackingStop") {
      return trackingUpsert_({
        jobId: data.jobId,
        status: data.status,
        staffName: data.staffName,
        sharing: data.sharing,
        staffLat: data.staffLat,
        staffLng: data.staffLng,
        destLat: data.destLat,
        destLng: data.destLng,
        destAddress: data.destAddress,
        pathJson: data.pathJson,
        updatedAt: data.updatedAt || Date.now(),
      });
    }
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
    city: "Hà Nội",
    note: "Dọn 80m2, 1 lần/tuần",
    fullAddress: "Số nhà 12, Ngõ/Hẻm Ngõ 5, Đường Phố Huế, Phường/Xã Kim Liên, Quận/Huyện Đống Đa, Thành phố Hà Nội",
  });
}
