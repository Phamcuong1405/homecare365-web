# HomeCare365 Mobile App — Bản test duyệt (MVP Giai đoạn 1)

## Phạm vi MVP (đã build)

| Màn hình | Trạng thái |
|----------|------------|
| Splash + loading | ✅ |
| Onboarding 3 slide | ✅ |
| Login (Google/Apple/FB/OTP demo) | ✅ UI |
| Home — 8 dịch vụ, promo, trust, USP | ✅ |
| Chi tiết dịch vụ + CTA | ✅ |
| Đặt lịch 3 bước | ✅ → API Google Sheet |
| Tracking (demo Grab-style) | ✅ |
| Tab: Booking, Membership, Notifications, Account | ✅ |
| Hotline + Zalo floating | ✅ |

## Chưa có (Giai đoạn 2–3)

- Thanh toán Momo/ZaloPay thật
- Maps / GPS realtime
- Push notification
- Admin / Seller dashboard trong app
- AI estimate ảnh, chatbot

## Cách duyệt

### Trên trình duyệt (nhanh)

https://www.homecare365.vn/m/splash

### Trên APK Android

1. Cài `HomeCare365-debug.apk` (Desktop hoặc `mobile/build/`)
2. Mở app → Splash → Onboarding → Login (chọn **demo không đăng nhập**)
3. Test flow: Home → Dịch vụ → Đặt lịch 3 bước → Tracking

### Test tự động

```bash
npm run test:mobile
npm run test:consultation
```

## Brand UI

- Primary: xanh lá #4caf50
- Trust: xanh dương #0047ab
- Warm: vàng nhạt #fff8e1
- Bo góc lớn, card shadow mềm
- Slogan app: *Nhà sạch mỗi ngày – Sống khỏe mỗi phút*

## Ghi chú kỹ thuật

- App native (Capacitor) load route `/m/*` trên web production
- Flutter có thể thay thế ở Giai đoạn 2 nếu cần performance tối đa
- Đặt lịch ghi vào Google Sheet qua API hiện có
