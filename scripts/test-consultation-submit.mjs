/**
 * Kiểm tra luồng gửi form → API → Google Sheet
 * Chạy: node scripts/test-consultation-submit.mjs [baseUrl]
 */
const BASE = process.argv[2] ?? "https://www.homecare365.vn";

const cases = [
  {
    name: "Đủ trường — desktop",
    body: {
      fullName: "Test Desktop",
      phone: "0901234567",
      houseNumber: "10",
      alley: "",
      street: "Le Loi",
      ward: "Ben Thanh",
      district: "Quan 1",
      note: "test desktop",
    },
    expectOk: true,
  },
  {
    name: "Chỉ điền ngõ/hẻm — mobile pattern",
    body: {
      fullName: "Test Mobile iOS",
      phone: "+84867050558",
      houseNumber: "1",
      alley: "ngo 1 tan khai",
      street: "",
      ward: "vinh tuy",
      district: "hoang mai",
      note: "test mobile",
    },
    expectOk: true,
  },
  {
    name: "Thiếu họ tên — validation",
    body: {
      fullName: "",
      phone: "0901234567",
      houseNumber: "1",
      alley: "",
      street: "A",
      ward: "B",
      district: "C",
      note: "",
    },
    expectOk: false,
    expectStatus: 400,
  },
  {
    name: "Thiếu số nhà + phường — validation",
    body: {
      fullName: "Nguyen Van A",
      phone: "0901234567",
      houseNumber: "",
      alley: "",
      street: "Le Loi",
      ward: "",
      district: "Quan 1",
      note: "",
    },
    expectOk: false,
    expectStatus: 400,
  },
  {
    name: "Thiếu đường và ngõ — validation",
    body: {
      fullName: "Nguyen Van A",
      phone: "0901234567",
      houseNumber: "10",
      alley: "",
      street: "",
      ward: "Ben Thanh",
      district: "Quan 1",
      note: "",
    },
    expectOk: false,
    expectStatus: 400,
  },
  {
    name: "SĐT quá ngắn — validation",
    body: {
      fullName: "Nguyen Van A",
      phone: "090",
      houseNumber: "10",
      alley: "",
      street: "Le Loi",
      ward: "Ben Thanh",
      district: "Quan 1",
      note: "",
    },
    expectOk: false,
    expectStatus: 400,
  },
];

async function run() {
  console.log(`\n=== Test consultation @ ${BASE} ===\n`);

  const health = await fetch(`${BASE}/api/consultation`);
  const healthJson = await health.json().catch(() => ({}));
  console.log(`GET /api/consultation → ${health.status}`, healthJson);

  let passed = 0;
  let failed = 0;

  for (const c of cases) {
    const res = await fetch(`${BASE}/api/consultation`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(c.body),
    });
    const json = await res.json().catch(() => ({}));
    const ok = c.expectOk ? res.ok && json.ok : res.status === (c.expectStatus ?? 400);

    console.log(`${ok ? "PASS" : "FAIL"} | ${c.name} → ${res.status}`, json);
    if (ok) passed++;
    else failed++;
  }

  console.log(`\nKết quả: ${passed} pass, ${failed} fail\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
