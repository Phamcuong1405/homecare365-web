/**
 * Đồng bộ Code.gs → Google Apps Script → push → deploy (giữ URL /exec cũ).
 *
 * Lần đầu: npx clasp login  (đăng nhập Google sở hữu Sheet)
 * Sau đó:  npm run deploy:apps-script
 */
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const gasDir = join(root, "google-apps-script");
const srcGs = join(root, "scripts", "google-sheet-consultation.gs");
const codeGs = join(gasDir, "Code.gs");
const deployIdFile = join(gasDir, "deployment-id.txt");
function readWebAppUrl() {
  if (process.env.GOOGLE_SHEETS_WEB_APP_URL?.trim()) {
    return process.env.GOOGLE_SHEETS_WEB_APP_URL.trim();
  }
  const envLocal = join(root, ".env.local");
  if (!existsSync(envLocal)) return "";
  return (
    readFileSync(envLocal, "utf8")
      .split("\n")
      .find((l) => l.startsWith("GOOGLE_SHEETS_WEB_APP_URL="))
      ?.replace(/^GOOGLE_SHEETS_WEB_APP_URL=/, "")
      .trim() ?? ""
  );
}

const webAppUrl = readWebAppUrl();

function deploymentIdFromUrl(url) {
  const m = url.match(/\/macros\/s\/([^/]+)\/exec/);
  return m?.[1] ?? "";
}

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: gasDir, ...opts });
}

console.log("\n=== HomeCare365 — Deploy Apps Script ===\n");

const clasprc = join(process.env.USERPROFILE || "", ".clasprc.json");
if (!existsSync(clasprc)) {
  console.error(`
╔══════════════════════════════════════════════════════════════╗
║  CẦN BẠN CẤP QUYỀN GOOGLE (một lần)                        ║
╚══════════════════════════════════════════════════════════════╝

1) Tài khoản: chủ Sheet + Apps Script HomeCare365
   Sheet:  https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/edit
   Script: https://script.google.com/home/projects/1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs/edit

2) Terminal:
   cd google-apps-script
   npx clasp login
   → Trình duyệt → Allow toàn bộ quyền

3) (Khuyến nghị) Bật Apps Script API:
   https://script.google.com/home/usersettings

4) Quay lại:
   npm run deploy:apps-script
   npm run test:tracking-gas

Chi tiết: docs/CAP_QUYEN_APPS_SCRIPT.md

Sau khi xong bước 2, báo lại: "đã clasp login"
`);
  try {
    if (process.platform === "win32") {
      execSync("start https://script.google.com/home/usersettings", { shell: true });
    }
  } catch {
    /* ignore */
  }
  process.exit(1);
}

copyFileSync(srcGs, codeGs);
console.log("Đã đồng bộ scripts/google-sheet-consultation.gs → google-apps-script/Code.gs\n");

run("npx clasp push -f");

let deploymentId =
  process.env.APPS_SCRIPT_DEPLOYMENT_ID?.trim() ||
  deploymentIdFromUrl(webAppUrl) ||
  (existsSync(deployIdFile) ? readFileSync(deployIdFile, "utf8").trim() : "");

if (deploymentId) {
  writeFileSync(deployIdFile, deploymentId, "utf8");
  console.log(`Deployment ID (giữ URL /exec): ${deploymentId.slice(0, 20)}…\n`);
}

if (!deploymentId) {
  console.log("Tạo deployment Web App mới…");
  run('npx clasp deploy --description "HomeCare365 web"');
} else {
  run(`npx clasp deploy -i ${deploymentId} --description "HomeCare365 web+tracking"`);
}

console.log("\nChạy setupTrackingSheet trên Google…");
try {
  run("npx clasp run setupTrackingSheet");
} catch {
  console.warn("(Bỏ qua nếu chưa bật Apps Script API — tab Theo_doi sẽ tạo khi có request tracking)");
}

if (webAppUrl) {
  console.log(`\nKiểm tra: ${webAppUrl}?action=trackingGet&jobId=HC-DEMO01`);
  console.log("Kỳ vọng JSON có session hoặc error not_found (không phải message webhook cũ).\n");
}

console.log("Xong.\n");
