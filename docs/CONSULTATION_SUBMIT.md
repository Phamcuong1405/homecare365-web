# Gửi form tư vấn — kiến trúc tối ưu

## Phương án (đã triển khai)

| Bước | Kênh | Mục đích |
|------|------|----------|
| 1 | `POST /api/consultation` | Chính — server xác nhận `{ ok: true }` |
| 2 | Retry 3 lần (900ms, 1800ms) | Mạng chập chờn / 4G / WiFi yếu |
| 3 | Form ẩn → Google Apps Script | Dự phòng Safari iOS, Chrome Android |
| 4 | API lần cuối | Xác nhận sau dự phòng |

**Không dùng:** `mailto:`, `no-cors` (không xác nhận được), đăng nhập Google.

## Tương thích

| Nền tảng | Trạng thái |
|----------|------------|
| Chrome / Edge desktop | OK |
| Firefox desktop | OK |
| Safari macOS | OK |
| Safari iOS | OK — `text-base` input (tránh zoom), `inputMode=tel` |
| Chrome Android | OK |
| Cốc Cốc | OK |

## Kiểm tra

```bash
npm run test:consultation
npm run test:consultation http://localhost:3000
```

## Health check (sau deploy)

`GET https://www.homecare365.vn/api/consultation` → `{ ok: true, channel: "google-sheet" }`
