/**
 * Kiểm tra Apps Script đã có tracking API chưa
 * node scripts/test-tracking-gas.mjs [webAppUrl]
 */
const url =
  process.argv[2] ??
  process.env.GOOGLE_SHEETS_WEB_APP_URL ??
  "https://script.google.com/macros/s/AKfycby26ARqQtcfMdkUshQ47pnyUGFEOH947Phcn0uU9NwFEOonLUsQO6t3shcvA0YnauLHrw/exec";

const testUrl = `${url.replace(/\/$/, "")}?action=trackingGet&jobId=HC-DEMO01`;
console.log(`GET ${testUrl}\n`);

const res = await fetch(testUrl, { redirect: "follow" });
const text = await res.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  console.log("FAIL — không phải JSON:", text.slice(0, 200));
  process.exit(1);
}

if (json.session !== undefined || json.error === "not_found") {
  console.log("PASS — Apps Script tracking API đã bật");
  console.log(JSON.stringify(json, null, 2));
  process.exit(0);
}

if (json.message?.includes("webhook")) {
  console.log("FAIL — Apps Script chưa deploy bản tracking (vẫn webhook cũ)");
  console.log("Chạy: npm run deploy:apps-script (sau clasp login)");
  process.exit(1);
}

console.log("UNKNOWN", json);
process.exit(1);
