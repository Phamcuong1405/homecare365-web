# Theo dõi nhân viên (GPS) — HomeCare365

Giống Grab / Zalo: khách xem bản đồ khi nhân viên **bật chia sẻ vị trí** trên app.

## Luồng

1. Khách đặt lịch → nhận **mã đơn** (ví dụ `HC1ABC2`) → trang `/m/tracking?job=...`
2. Nhân viên mở `/m/staff/track?job=...` → **Bật chia sẻ vị trí (GPS)**
3. Khách thấy bản đồ, lộ trình, ETA cập nhật ~5 giây/lần

## API

| Method | URL | Mô tả |
|--------|-----|--------|
| GET | `/api/tracking/[jobId]` | Lấy phiên theo dõi |
| POST | `/api/tracking/[jobId]` | `trackingStart` / `trackingUpdate` / `trackingStop` |

Dữ liệu lưu **bộ nhớ server** (MVP) và đồng bộ **Google Sheet tab `Theo_doi`** nếu Apps Script đã cập nhật.

## Cập nhật Apps Script (khuyến nghị production)

1. Mở Apps Script của Sheet HomeCare365
2. Dán lại `scripts/google-sheet-consultation.gs` (đã có `trackingGet`, tab `Theo_doi`)
3. **Deploy** → New version Web app (Anyone)
4. Redeploy Vercel (biến `GOOGLE_SHEETS_WEB_APP_URL` giữ nguyên)

## Kiểm tra

- Khách: https://www.homecare365.vn/m/tracking?job=HC-DEMO01
- NV: https://www.homecare365.vn/m/staff/track?job=HC-DEMO01 → bật GPS
