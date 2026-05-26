/**
 * Sau deploy GAS — tạo tab Nhan_vien + Cong_viec và kiểm tra API ops
 */
const url =
  process.env.GOOGLE_SHEETS_WEB_APP_URL ??
  "https://script.google.com/macros/s/AKfycbyo1UQaWaix0N-38hDPsvBiKxRBKdrmLsErvD7LPmm6aSTctKNm08bqnv48e8X5hVujfQ/exec";

const base = url.replace(/\/$/, "");

async function post(action, extra = {}) {
  const res = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json();
}

async function get(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${base}?${qs}`, { cache: "no-store" });
  return res.json();
}

console.log("\n=== GAS post-setup ===\n");

const setup = await post("setupOps");
console.log("setupOps:", JSON.stringify(setup));

const staff = await get({ action: "staffList" });
const hasStaffApi = staff.ok && Array.isArray(staff.staff);
console.log("staffList:", hasStaffApi ? `OK (${staff.staff.length} rows)` : JSON.stringify(staff).slice(0, 200));

const jobs = await get({ action: "jobList" });
const hasJobsApi = jobs.ok && Array.isArray(jobs.jobs);
console.log("jobList:", hasJobsApi ? `OK (${jobs.jobs.length} rows)` : JSON.stringify(jobs).slice(0, 200));

if (hasStaffApi && hasJobsApi) {
  console.log("\nPASS — Ops API đã sẵn sàng trên deployment hiện tại.\n");
  process.exit(0);
}

console.log("\nFAIL — Deployment chưa có code ops mới. Cần push + New version trên Apps Script.\n");
process.exit(1);
