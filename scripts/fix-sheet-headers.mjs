/**
 * Sửa tiêu đề Sheet (sau khi deploy GAS có action fixHeaders)
 * node scripts/fix-sheet-headers.mjs [webAppUrl]
 */
const url =
  process.argv[2] ??
  process.env.GOOGLE_SHEETS_WEB_APP_URL ??
  "https://script.google.com/macros/s/AKfycbyo1UQaWaix0N-38hDPsvBiKxRBKdrmLsErvD7LPmm6aSTctKNm08bqnv48e8X5hVujfQ/exec";

const fixUrl = `${url.replace(/\/$/, "")}?action=fixHeaders`;
console.log(`GET ${fixUrl}\n`);

const res = await fetch(fixUrl, { redirect: "follow" });
const json = await res.json();
console.log(JSON.stringify(json, null, 2));

const cols = json.columns || [];
const ok =
  json.ok &&
  cols[0] === "Thời gian" &&
  cols[8] === "Thành phố";

if (ok) {
  console.log("\nPASS — Tiêu đề tiếng Việt đã đúng trên Sheet.");
  process.exit(0);
}
console.log("\nFAIL — Cần deploy GAS mới (có fixVietnameseHeaders) rồi chạy lại.");
process.exit(1);
