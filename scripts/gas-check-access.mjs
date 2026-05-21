/**
 * Kiểm tra quyền Apps Script API (dùng token clasp đã login)
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const SCRIPT_ID = "1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs";
const clasprc = JSON.parse(readFileSync(join(homedir(), ".clasprc.json"), "utf8"));
const token = clasprc.tokens?.default?.access_token;
const email = (() => {
  try {
    const id = clasprc.tokens?.default?.id_token;
    if (!id) return "?";
    const payload = JSON.parse(Buffer.from(id.split(".")[1], "base64url").toString());
    return payload.email;
  } catch {
    return "?";
  }
})();

if (!token) {
  console.log("FAIL: Chưa có access_token — chạy clasp login");
  process.exit(1);
}

console.log(`Tài khoản clasp: ${email}\n`);

const projectRes = await fetch(`https://script.googleapis.com/v1/projects/${SCRIPT_ID}`, {
  headers: { Authorization: `Bearer ${token}` },
});
const projectText = await projectRes.text();
console.log(`GET project → ${projectRes.status}`);
if (projectRes.ok) {
  console.log(JSON.stringify(JSON.parse(projectText), null, 2));
} else {
  console.log(projectText.slice(0, 500));
}

const contentRes = await fetch(
  `https://script.googleapis.com/v1/projects/${SCRIPT_ID}/content`,
  { headers: { Authorization: `Bearer ${token}` } },
);
console.log(`\nGET content → ${contentRes.status}`);
