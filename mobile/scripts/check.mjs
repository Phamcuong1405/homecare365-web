/**
 * Kiểm tra tự động trước khi sync/build app
 * Chạy: npm run check (trong thư mục mobile)
 */
import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = join(root, "..");
const APP_URL = process.env.HOMECARE365_APP_URL ?? "https://www.homecare365.vn";

const requiredFiles = [
  join(root, "capacitor.config.ts"),
  join(root, "www", "index.html"),
  join(root, "package.json"),
];

let failed = 0;

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  failed++;
}

async function fileExists(path) {
  try {
    await access(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

console.log("\n=== HomeCare365 Mobile — kiểm tra ===\n");

for (const f of requiredFiles) {
  if (await fileExists(f)) pass(f.replace(root + "\\", "").replace(root + "/", ""));
  else fail(`Thiếu file: ${f}`);
}

const brandPng = join(webRoot, "public", "brand", "homecare365-logo.png");
const brandSvg = join(webRoot, "public", "brand", "homecare365-logo.svg");
if ((await fileExists(brandPng)) || (await fileExists(brandSvg))) {
  pass("Logo thương hiệu (web/public/brand)");
} else {
  fail("Không tìm thấy logo trong public/brand");
}

try {
  const res = await fetch(APP_URL, { method: "HEAD", redirect: "follow" });
  if (res.ok) pass(`Website ${APP_URL} — HTTP ${res.status}`);
  else fail(`Website ${APP_URL} — HTTP ${res.status}`);
} catch (e) {
  fail(`Không kết nối ${APP_URL}: ${e.message}`);
}

try {
  const res = await fetch(`${APP_URL}/api/consultation`);
  const json = await res.json().catch(() => ({}));
  if (res.ok && json.ok) pass("API consultation (health)");
  else fail(`API consultation — ${res.status}`);
} catch (e) {
  fail(`API consultation: ${e.message}`);
}

try {
  const cfg = await readFile(join(root, "capacitor.config.ts"), "utf8");
  if (cfg.includes("vn.homecare365.app")) pass("appId vn.homecare365.app");
  else fail("appId không khớp");
  if (cfg.includes("homecare365.vn")) pass("allowNavigation homecare365.vn");
} catch {
  fail("Đọc capacitor.config.ts");
}

const icon = join(root, "www", "icon.png");
if (await fileExists(icon)) pass("www/icon.png");
else console.log("  … www/icon.png — chạy npm run icons để tạo");

if (await fileExists(join(root, "android"))) pass("Nền tảng Android");
else console.log("  … android — chạy: npx cap add android");

if (await fileExists(join(root, "ios"))) pass("Nền tảng iOS");
else console.log("  … ios — chạy: npx cap add ios");

console.log(failed === 0 ? "\nKết quả: Sẵn sàng sync/build\n" : `\nKết quả: ${failed} lỗi — sửa trước khi build\n`);
process.exit(failed > 0 ? 1 : 0);
