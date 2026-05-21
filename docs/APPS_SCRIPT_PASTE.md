# Dán code vào Apps Script (project HomeCare365)

**Apps Script:** https://script.google.com/home/projects/1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs/edit  

**Google Sheet:** https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/edit  

## Bước 1 — Dán code

1. Mở link Apps Script trên.
2. File **Code.gs** → chọn hết (Ctrl+A) → xóa.
3. Copy toàn bộ nội dung file `scripts/google-sheet-consultation.gs` trong repo → dán vào.
4. **Save** (Ctrl+S).

## Bước 2 — Cấp quyền + tạo cột

1. Menu hàm chọn **`setupHomeCare365Sheet`** → **Run**.
2. **Review permissions** → Allow (tài khoản Google sở hữu Sheet).
3. Mở Sheet → kiểm tra dòng 1 có 10 cột tiêu đề.

## Bước 3 — Deploy Web App

1. **Deploy** → **New deployment**.
2. Type: **Web app**.
3. Execute as: **Me** | Who has access: **Anyone**.
4. **Deploy** → copy URL `https://script.google.com/macros/s/.../exec`.

## Bước 4 — Vercel

Thêm biến môi trường (Production + Preview):

```
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/AKfycbyPbkhEVW-5Mt4Dsn7WgCb-g9GySGlyYBoPdU5hJp54Zbot2MQq0owHa1q53mWMSMKkEg/exec
```

Redeploy project **homecare365-web**.

### Quan trọng: URL phải mở được không cần đăng nhập

Mở URL `/exec` trên trình duyệt **ẩn danh**:

- Đúng: thấy JSON `{"ok":true,...}`
- Sai: trang **Sign in** Google → vào **Deploy → Manage deployments → Edit** → **Who has access: Anyone** → Deploy lại → copy URL mới nếu đổi.

## Bước 5 — Test

- Mở URL `/exec` trên trình duyệt → thấy JSON `"ok":true`.
- Gửi form tại https://www.homecare365.vn/#dat-lich-tu-van → dòng mới trên Sheet.

## Test thủ công trong Apps Script

Chạy hàm **`testAppendSampleRow`** → Sheet thêm 1 dòng mẫu.
