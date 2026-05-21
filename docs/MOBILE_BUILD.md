# HomeCare365 — App Android & iOS

App native bọc website production `https://www.homecare365.vn` (Capacitor). Form tư vấn, API và Google Sheet hoạt động như trên web.

## Đường dẫn lưu file — **không cần bạn cung cấp**

| Nội dung | Đường dẫn mặc định |
|----------|-------------------|
| Mã nguồn app | `mobile/` trong repo |
| Icon / splash | `mobile/resources/` |
| APK debug (sau build) | `mobile/android/app/build/outputs/apk/debug/app-debug.apk` |
| APK/AAB release | `mobile/android/app/build/outputs/` |
| iOS (Xcode) | `mobile/ios/` — build trên **macOS** |

Tùy chọn: biến môi trường `MOBILE_OUTPUT_DIR` khi copy artefact (CI).

## Yêu cầu

### Chung
- Node.js 20+
- `npm install` trong `mobile/`

### Android (Windows / macOS / Linux)
- [Android Studio](https://developer.android.com/studio) **hoặc** chạy `npm run setup:android` (tự cài JDK 21 + SDK vào `mobile/.tools/`)
- JDK **21** (Capacitor 7 yêu cầu)
- Biến `ANDROID_HOME` trỏ tới SDK (tự tạo khi chạy setup)

### iOS (chỉ macOS)
- Xcode 15+
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer (để đưa lên App Store)

## Quy trình tự động (local)

```bash
cd mobile
npm install
npm run check          # Kiểm tra web + API + file cấu hình
npm run icons          # Tạo icon/splash từ logo
npx cap add android    # Lần đầu
npx cap add ios        # Lần đầu (có thể tạo project trên Windows; build cần Mac)
npm run sync           # check + icons + assets + cap sync
```

### Chạy thử trên điện thoại Android

```bash
cd mobile
npm run test:android    # check + build APK + copy ra Desktop
```

File cài đặt:
- `mobile/build/homecare365-debug.apk`
- Desktop: `HomeCare365-debug.apk`

**Cài trên máy:** copy APK sang điện thoại → mở file → cho phép “Cài từ nguồn không xác định” → Cài đặt.

**Hoặc USB:** bật Gỡ lỗi USB → `adb install mobile\build\homecare365-debug.apk`

- **Android Studio:** `npm run open:android` → Run trên máy ảo/thật  
- **iOS:** trên Mac: `npm run open:ios` → Xcode → Run  

### Build file cài đặt

```bash
# Android APK debug (không cần ký release)
npm run build:android:debug

# Android release (cần keystore — xem bên dưới)
npm run build:android:release
```

**iOS:** Xcode → Product → Archive → Distribute.

## CI (GitHub Actions)

Workflow `.github/workflows/mobile-android.yml` tự động:
1. `npm run check`
2. `npm run sync`
3. Build APK debug
4. Upload artefact `homecare365-android-debug.apk`

## Ký bản phát hành (Play Store / App Store)

### Android
1. Tạo keystore (một lần):  
   `keytool -genkey -v -keystore homecare365-release.keystore -alias homecare365 -keyalg RSA -keysize 2048 -validity 10000`
2. Lưu keystore **ngoài git** (ví dụ `C:\Users\ADMIN\keys\homecare365-release.keystore`)
3. Tạo `mobile/android/keystore.properties` (không commit):

```properties
storeFile=C:/Users/ADMIN/keys/homecare365-release.keystore
storePassword=***
keyAlias=homecare365
keyPassword=***
```

### iOS
- Đăng ký Bundle ID `vn.homecare365.app` trên Apple Developer  
- Trong Xcode: Signing & Capabilities → Team  

## URL staging

```bash
set HOMECARE365_APP_URL=https://your-preview.vercel.app
npm run sync
```

## Liên hệ kỹ thuật

- Web: https://www.homecare365.vn  
- Test API: `npm run test:consultation` (thư mục gốc repo)
