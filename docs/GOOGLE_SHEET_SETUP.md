# Ghi form tư vấn vào Google Sheet

Khi khách gửi form **Đặt lịch tư vấn miễn phí**, mỗi lần gửi sẽ thêm **một dòng** vào Google Sheet với các cột:

| Cột | Nội dung |
|-----|----------|
| Thời gian | Lúc khách gửi (giờ Việt Nam) |
| Họ và tên | Họ tên khách |
| Số điện thoại | SĐT liên hệ |
| Số nhà | Số nhà |
| Ngõ/Hẻm | Ngõ, hẻm (nếu có) |
| Tên đường | Tên đường |
| Phường/Xã | Phường / xã |
| Quận/Huyện | Quận / huyện |
| Nhu cầu dọn dẹp | Diện tích, tần suất, yêu cầu… |
| Địa chỉ đầy đủ | Gộp tự động từ các ô địa chỉ |

## Bước 1 — Tạo Google Sheet

1. Mở [Google Sheets](https://sheets.google.com) → **Tạo bảng tính mới**.
2. Đổi tên sheet (tab dưới) thành **Khách hàng** (hoặc giữ sheet mặc định).
3. Dòng 1, nhập tiêu đề (tùy chọn — script có thể tự thêm nếu sheet trống):

```
Thời gian | Họ và tên | Số điện thoại | Số nhà | Ngõ/Hẻm | Tên đường | Phường/Xã | Quận/Huyện | Nhu cầu dọn dẹp | Địa chỉ đầy đủ
```

## Bước 2 — Cài Apps Script

1. Trong Sheet: **Extensions** → **Apps Script**.
2. Xóa code mặc định, dán nội dung file `scripts/google-sheet-consultation.gs` trong repo.
3. **Save** (Ctrl+S).

## Bước 3 — Deploy Web App

1. **Deploy** → **New deployment**.
2. Loại: **Web app**.
3. **Execute as:** Me  
4. **Who has access:** Anyone  
5. **Deploy** → cho phép quyền → **Copy URL** (dạng `https://script.google.com/macros/s/.../exec`).

## Bước 4 — Cấu hình website

### Trên máy local (`.env.local`)

```env
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/XXXX/exec
```

### Trên Vercel

1. Project **homecare365-web** → **Settings** → **Environment Variables**
2. Thêm biến:
   - **Name:** `GOOGLE_SHEETS_WEB_APP_URL`
   - **Value:** URL Web App vừa copy
3. **Redeploy** project.

## Kiểm tra

1. Chạy `npm run dev`, mở form, điền thử và **Gửi yêu cầu**.
2. Mở Google Sheet → dòng mới xuất hiện.
3. Nếu lỗi: kiểm tra URL env, quyền deploy **Anyone**, và xem **Executions** trong Apps Script.

## Lưu ý bảo mật

- Không chia sẻ URL Web App công khai trên mạng xã hội; chỉ đặt trong biến môi trường server (Vercel).
- Website gọi qua API `/api/consultation` (server), không gọi trực tiếp từ trình duyệt.
