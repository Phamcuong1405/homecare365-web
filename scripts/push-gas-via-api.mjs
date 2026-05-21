/**
 * Đẩy Code.gs lên Apps Script qua REST API (cần clasp login + bật Apps Script API)
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const SCRIPT_ID = "1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs";
const NEW_DEPLOYMENT_ID =
  "AKfycbzhNkAT1_7UkqRWjRbSvAbm9aAbcBdt-7Mqc04ySvB6MzL05M2rnerIro1y3d6aAzGqqA";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const clasprc = JSON.parse(readFileSync(join(homedir(), ".clasprc.json"), "utf8"));
const creds = clasprc.tokens?.default;
if (!creds?.refresh_token) {
  console.error("FAIL: Chưa clasp login");
  process.exit(1);
}

const code = readFileSync(join(root, "scripts", "google-sheet-consultation.gs"), "utf8");
const manifest = readFileSync(join(root, "google-apps-script", "appsscript.json"), "utf8");

async function getAccessToken() {
  const body = new URLSearchParams({
    client_id: creds.client_id,
    client_secret: creds.client_secret,
    refresh_token: creds.refresh_token,
    grant_type: "refresh_token",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json();
  if (!json.access_token) {
    console.error("Token refresh failed:", json);
    process.exit(1);
  }
  return json.access_token;
}

async function api(token, path, opts = {}) {
  const res = await fetch(`https://script.googleapis.com/v1/projects/${SCRIPT_ID}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...opts.headers,
    },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
}

console.log("\n=== Push GAS via API ===\n");
const token = await getAccessToken();

const content = await api(token, "/content", {
  method: "PUT",
  body: JSON.stringify({
    files: [
      { name: "Code", type: "SERVER_JS", source: code },
      { name: "appsscript", type: "JSON", source: manifest },
    ],
  }),
});
console.log(`updateContent → ${content.status}`, content.ok ? "OK" : JSON.stringify(content.json).slice(0, 400));

if (!content.ok) {
  console.error("\nCần bật https://script.google.com/home/usersettings → Google Apps Script API");
  process.exit(1);
}

const ver = await api(token, "/versions", {
  method: "POST",
  body: JSON.stringify({ description: "HomeCare365 tracking + city column" }),
});
console.log(`createVersion → ${ver.status}`, ver.ok ? `v${ver.json.versionNumber}` : ver.json);

if (ver.ok && ver.json.versionNumber) {
  const dep = await api(token, `/deployments/${NEW_DEPLOYMENT_ID}`, {
    method: "PUT",
    body: JSON.stringify({
      deploymentConfig: {
        versionNumber: ver.json.versionNumber,
        description: "Web app tracking",
        manifestFileName: "appsscript",
      },
    }),
  });
  console.log(`updateDeployment → ${dep.status}`, dep.ok ? "OK" : JSON.stringify(dep.json).slice(0, 400));
}

console.log("\nXong. Chạy: npm run test:tracking-gas\n");
