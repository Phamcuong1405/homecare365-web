/**
 * HomeCare365 - Consultation form webhook -> Google Sheet
 * Vietnamese strings use \u escapes so paste into Apps Script editor stays correct.
 *
 * Script: https://script.google.com/home/projects/1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs/edit
 * Sheet:  https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/edit
 *
 * Setup: Save -> run setupHomeCare365Sheet -> Deploy Web app (Me, Anyone)
 *        -> copy /exec URL -> Vercel GOOGLE_SHEETS_WEB_APP_URL
 *        -> open ?action=fixHeaders once to fix row 1 on the sheet
 */

var SPREADSHEET_ID = "1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8";
var SHEET_GID = 0;
var SHEET_TAB_NAME = "Kh\u00e1ch h\u00e0ng";
var TRACKING_TAB_NAME = "Theo_doi";
var STAFF_TAB_NAME = "Nhan_vien";
var JOBS_TAB_NAME = "Cong_viec";

var HEADERS = [
  "Th\u1eddi gian",
  "H\u1ecd v\u00e0 t\u00ean",
  "S\u1ed1 \u0111i\u1ec7n tho\u1ea1i",
  "S\u1ed1 nh\u00e0",
  "Ng\u00f5/H\u1ebbm",
  "T\u00ean \u0111\u01b0\u1eddng",
  "Ph\u01b0\u1eddng/X\u00e3",
  "Qu\u1eadn/Huy\u1ec7n",
  "Th\u00e0nh ph\u1ed1",
  "Nhu c\u1ea7u d\u1ecdn d\u1eb9p",
  "\u0110\u1ecba ch\u1ec9 \u0111\u1ea7y \u0111\u1ee7",
];

var DEFAULT_STAFF_NAME = "Nh\u00e2n vi\u00ean HomeCare365";

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

/** Run once - create Theo_doi tab for GPS tracking */
function setupTrackingSheet() {
  getTrackingSheet_();
}

/** Run once - tabs Nhan_vien + Cong_viec (quan ly phan cong) */
function setupOpsSheets() {
  getStaffSheet_();
  getJobsSheet_();
}

function getStaffSheet_() {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(STAFF_TAB_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(STAFF_TAB_NAME);
    sheet.appendRow(["staffId", "name", "phone", "email", "pin", "status", "registeredAt"]);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#ff9800").setFontColor("#ffffff");
  }
  return sheet;
}

function getJobsSheet_() {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(JOBS_TAB_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(JOBS_TAB_NAME);
    sheet.appendRow([
      "jobId",
      "customerName",
      "phone",
      "address",
      "serviceNote",
      "status",
      "staffId",
      "staffName",
      "scheduledAt",
      "createdAt",
      "assignedAt",
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#673ab7").setFontColor("#ffffff");
  }
  return sheet;
}

function nextStaffId_() {
  var sheet = getStaffSheet_();
  var n = Math.max(0, sheet.getLastRow() - 1);
  return "NV" + String(n + 1).padStart(3, "0");
}

function staffRowToObj_(row) {
  return {
    staffId: String(row[0]),
    name: String(row[1]),
    phone: String(row[2]),
    email: String(row[3] || ""),
    status: String(row[5] || "pending"),
    registeredAt: String(row[6] || ""),
  };
}

function jobRowToObj_(row) {
  return {
    jobId: String(row[0]),
    customerName: String(row[1]),
    phone: String(row[2]),
    address: String(row[3]),
    serviceNote: String(row[4]),
    status: String(row[5] || "new"),
    staffId: String(row[6] || ""),
    staffName: String(row[7] || ""),
    scheduledAt: String(row[8] || ""),
    createdAt: String(row[9] || ""),
    assignedAt: String(row[10] || ""),
  };
}

function staffList_() {
  var sheet = getStaffSheet_();
  var data = sheet.getDataRange().getValues();
  var staff = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) staff.push(staffRowToObj_(data[i]));
  }
  return jsonResponse_({ ok: true, staff: staff });
}

function staffRegister_(data) {
  var sheet = getStaffSheet_();
  var phone = String(data.phone || "");
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][2]) === phone) {
      return jsonResponse_({ ok: false, error: "phone_exists" });
    }
  }
  var staffId = nextStaffId_();
  var registeredAt = new Date().toISOString();
  sheet.appendRow([
    staffId,
    data.name || "",
    phone,
    data.email || "",
    String(data.pin || ""),
    "pending",
    registeredAt,
  ]);
  return jsonResponse_({
    ok: true,
    staff: { staffId: staffId, name: data.name, phone: phone, email: data.email || "", status: "pending", registeredAt: registeredAt },
  });
}

function staffUpdate_(data) {
  var sheet = getStaffSheet_();
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.staffId)) {
      if (data.status) sheet.getRange(i + 1, 6).setValue(data.status);
      return jsonResponse_({ ok: true, staff: staffRowToObj_(sheet.getRange(i + 1, 1, i + 1, 7).getValues()[0]) });
    }
  }
  return jsonResponse_({ ok: false, error: "not_found" });
}

function staffLogin_(data) {
  var sheet = getStaffSheet_();
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.staffId)) {
      if (String(rows[i][4]) !== String(data.pin)) return jsonResponse_({ ok: false, error: "invalid_pin" });
      if (String(rows[i][5]) !== "active") return jsonResponse_({ ok: false, error: "not_active" });
      return jsonResponse_({ ok: true, staff: staffRowToObj_(rows[i]) });
    }
  }
  return jsonResponse_({ ok: false, error: "not_found" });
}

function jobList_(staffId) {
  var sheet = getJobsSheet_();
  var data = sheet.getDataRange().getValues();
  var jobs = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    if (staffId && String(data[i][6]) !== String(staffId)) continue;
    jobs.push(jobRowToObj_(data[i]));
  }
  return jsonResponse_({ ok: true, jobs: jobs });
}

function jobUpsert_(data) {
  var sheet = getJobsSheet_();
  var rows = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.jobId)) {
      rowIndex = i + 1;
      break;
    }
  }
  var createdAt = data.createdAt || new Date().toISOString();
  var row = [
    data.jobId,
    data.customerName || "",
    data.phone || "",
    data.address || "",
    data.serviceNote || "",
    rowIndex > 0 ? String(rows[rowIndex - 1][5] || "new") : "new",
    rowIndex > 0 ? String(rows[rowIndex - 1][6] || "") : "",
    rowIndex > 0 ? String(rows[rowIndex - 1][7] || "") : "",
    data.scheduledAt || (rowIndex > 0 ? String(rows[rowIndex - 1][8] || "") : ""),
    rowIndex > 0 ? String(rows[rowIndex - 1][9] || createdAt) : createdAt,
    rowIndex > 0 ? String(rows[rowIndex - 1][10] || "") : "",
  ];
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, rowIndex, 11).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
  return jsonResponse_({ ok: true, job: jobRowToObj_(row) });
}

function jobAssign_(data) {
  var sheet = getJobsSheet_();
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.jobId)) {
      var assignedAt = new Date().toISOString();
      sheet.getRange(i + 1, 6).setValue("assigned");
      sheet.getRange(i + 1, 7).setValue(data.staffId);
      sheet.getRange(i + 1, 8).setValue(data.staffName || "");
      sheet.getRange(i + 1, 11).setValue(assignedAt);
      var updated = sheet.getRange(i + 1, 1, i + 1, 11).getValues()[0];
      return jsonResponse_({ ok: true, job: jobRowToObj_(updated) });
    }
  }
  return jsonResponse_({ ok: false, error: "not_found" });
}

function jobStatus_(data) {
  var sheet = getJobsSheet_();
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.jobId)) {
      sheet.getRange(i + 1, 6).setValue(data.status);
      var updated = sheet.getRange(i + 1, 1, i + 1, 11).getValues()[0];
      return jsonResponse_({ ok: true, job: jobRowToObj_(updated) });
    }
  }
  return jsonResponse_({ ok: false, error: "not_found" });
}

/** Detect mojibake in header row (UTF-8 shown as Thá»i gian, etc.) */
function isHeaderBroken_(value) {
  var v = String(value || "");
  if (v === HEADERS[0]) return false;
  if (v.indexOf("\u00e1\u00bb") >= 0) return true;
  if (v.indexOf("\u00c3") >= 0) return true;
  if (v.indexOf("\u00c4") >= 0) return true;
  return v !== HEADERS[0];
}

/** Rewrite row 1 with correct Vietnamese headers */
function fixVietnameseHeaders() {
  setupHomeCare365Sheet();
  return { ok: true, message: "Da sua tieu de cot tieng Viet", columns: HEADERS };
}

/** Run once in Apps Script editor to create column headers */
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
  if (isHeaderBroken_(firstCell)) {
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
          staffName: String(data[i][2] || DEFAULT_STAFF_NAME),
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
    data.staffName || DEFAULT_STAFF_NAME,
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
  if (e && e.parameter && e.parameter.action === "fixHeaders") {
    return jsonResponse_(fixVietnameseHeaders());
  }
  if (e && e.parameter && e.parameter.action === "trackingGet" && e.parameter.jobId) {
    return trackingGet_(e.parameter.jobId);
  }
  if (e && e.parameter && e.parameter.action === "staffList") {
    return staffList_();
  }
  if (e && e.parameter && e.parameter.action === "jobList") {
    return jobList_(e.parameter.staffId || "");
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
    if (data.action === "fixHeaders") {
      return jsonResponse_(fixVietnameseHeaders());
    }
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
    if (data.action === "staffRegister") return staffRegister_(data);
    if (data.action === "staffUpdate") return staffUpdate_(data);
    if (data.action === "staffLogin") return staffLogin_(data);
    if (data.action === "jobUpsert") return jobUpsert_(data);
    if (data.action === "jobAssign") return jobAssign_(data);
    if (data.action === "jobStatus") return jobStatus_(data);
    if (data.action === "setupOps") {
      setupOpsSheets();
      return jsonResponse_({ ok: true, message: "ops_sheets_ready" });
    }
    if (data.fullName || data.phone) {
      appendRow_(data);
      return jsonResponse_({ ok: true });
    }
    return jsonResponse_({ ok: false, error: "unknown_action" });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

/** Run in editor to test append without website */
function testAppendSampleRow() {
  appendRow_({
    submittedAt: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    fullName: "Nguy\u1ec5n V\u0103n Test",
    phone: "0901234567",
    houseNumber: "12",
    alley: "Ng\u00f5 5",
    street: "Ph\u1ed1 Hu\u1ebf",
    ward: "Kim Li\u00ean",
    district: "\u0110\u1ed1ng \u0110a",
    city: "H\u00e0 N\u1ed9i",
    note: "D\u1ecdn 80m2, 1 l\u1ea7n/tu\u1ea7n",
    fullAddress:
      "S\u1ed1 nh\u00e0 12, Ng\u00f5/H\u1ebbm Ng\u00f5 5, \u0110\u01b0\u1eddng Ph\u1ed1 Hu\u1ebf, Ph\u01b0\u1eddng/X\u00e3 Kim Li\u00ean, Qu\u1eadn/Huy\u1ec7n \u0110\u1ed1ng \u0110a, Th\u00e0nh ph\u1ed1 H\u00e0 N\u1ed9i",
  });
}
