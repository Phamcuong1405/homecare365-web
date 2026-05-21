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

## Cập nhật Apps Script (tự động)

```bash
cd google-apps-script && npx clasp login   # một lần
npm run deploy:apps-script                 # mỗi lần đổi .gs
npm run test:tracking-gas                  # kiểm tra
```

Chi tiết: [DEPLOY_APPS_SCRIPT.md](./DEPLOY_APPS_SCRIPT.md)

## Kiểm tra

- Khách: https://www.homecare365.vn/m/tracking?job=HC-DEMO01
- NV: https://www.homecare365.vn/m/staff/track?job=HC-DEMO01 → bật GPS
