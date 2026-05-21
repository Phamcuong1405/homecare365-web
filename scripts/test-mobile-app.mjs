/**
 * Test mobile app routes
 * node scripts/test-mobile-app.mjs [baseUrl]
 */
const BASE = process.argv[2] ?? "https://www.homecare365.vn";

const routes = [
  "/m/splash",
  "/m/onboarding",
  "/m/login",
  "/m/home",
  "/m/service/hourly",
  "/m/book",
  "/m/membership",
  "/m/tracking",
];

let pass = 0;
let fail = 0;

console.log(`\n=== Mobile App @ ${BASE} ===\n`);

for (const route of routes) {
  try {
    const res = await fetch(`${BASE}${route}`, { redirect: "follow" });
    const ok = res.ok;
    console.log(`${ok ? "PASS" : "FAIL"} ${route} → ${res.status}`);
    if (ok) pass++;
    else fail++;
  } catch (e) {
    console.log(`FAIL ${route} → ${e.message}`);
    fail++;
  }
}

console.log(`\n${pass} pass, ${fail} fail\n`);
process.exit(fail > 0 ? 1 : 0);
