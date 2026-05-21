# Cấp quyền để deploy Apps Script (HomeCare365)

Deploy tự động cần **một lần** đăng nhập Google trên máy bạn. AI không thể thay bạn bấm Allow trên tài khoản Google.

## 1. Tài khoản Google cần dùng

Đăng nhập bằng tài khoản **sở hữu** (hoặc được cấp **Quản trị viên**):

| Tài nguyên | Link |
|------------|------|
| Google Sheet khách hàng | https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/edit |
| Apps Script HomeCare365 | https://script.google.com/home/projects/1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs/edit |

Nếu dùng email khác → vào Sheet + Apps Script → **Chia sẻ** → thêm email đó quyền **Chỉnh sửa**.

## 2. Đăng nhập clasp (bắt buộc, ~2 phút)

Mở **PowerShell** hoặc terminal trong Cursor:

```powershell
cd C:\Users\ADMIN\navtools-web\google-apps-script
npx clasp login
```

- Trình duyệt mở → chọn **đúng** tài khoản Google ở mục 1  
- Bấm **Cho phép / Allow** toàn bộ quyền clasp yêu cầu (Apps Script, Deploy, Drive đọc metadata)  
- Thấy `Logged in!` hoặc `Authorization successful` → xong  

**Lưu ý:** Không đóng cửa sổ terminal khi đang chờ paste URL (nếu dùng `--no-localhost`).

## 3. Bật Apps Script API (khuyến nghị — cho `setupTrackingSheet`)

1. Mở https://script.google.com/home/usersettings  
2. Bật **Google Apps Script API** → Save  

Hoặc: https://console.cloud.google.com/apis/library/script.googleapis.com → **Enable** (cùng project Google Cloud gắn với tài khoản).

## 4. Deploy code (sau khi bước 2 xong)

```powershell
cd C:\Users\ADMIN\navtools-web
npm run deploy:apps-script
npm run test:tracking-gas
```

- `deploy:apps-script` → push code + deploy Web App (**URL `/exec` giữ nguyên**)  
- `test:tracking-gas` → phải báo **PASS**  

## 5. Web App — quyền truy cập công khai (kiểm tra lại)

Trong Apps Script: **Deploy** → **Manage deployments** → Web app:

| Mục | Giá trị |
|-----|--------|
| Execute as | **Me** |
| Who has access | **Anyone** |

Mở URL ẩn danh → JSON `ok:true`, **không** phải trang Sign in Google.

## 6. Báo lại cho AI / dev

Sau khi xong bước 2 + 4, gửi tin:

> Đã clasp login xong, chạy deploy giúp

Hoặc tự chạy `npm run test:tracking-gas` — nếu **PASS** là production đã có tracking GPS trên Sheet tab **Theo_doi**.

## Quyền clasp yêu cầu (tham khảo)

- Triển khai & quản lý Apps Script  
- Đọc metadata Drive (gắn project script)  
- Email / profile (xác định tài khoản)  

Không cần cấp mật khẩu Google cho bên thứ ba — chỉ OAuth một lần trên máy bạn.
