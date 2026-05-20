# Google Sheet — Form tư vấn HomeCare365

**Bảng dữ liệu:** [HomeCare365 — Khách hàng](https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/edit?gid=0#gid=0)

**Form trên web:** [homecare365.vn — Đặt lịch tư vấn](https://www.homecare365.vn/#dat-lich-tu-van)

## Ánh xạ trường (Form → Sheet)

| Cột (dòng 1) | Trường form trên web | Bắt buộc |
|--------------|----------------------|----------|
| Thời gian | Tự động khi gửi | — |
| Họ và tên | Họ và tên * | Có |
| Số điện thoại | Số điện thoại * | Có |
| Số nhà | Số nhà * | Có |
| Ngõ/Hẻm | Ngõ / Hẻm | Không |
| Tên đường | Tên đường * | Có |
| Phường/Xã | Phường / Xã * | Có |
| Quận/Huyện | Quận / Huyện * | Có |
| Nhu cầu dọn dẹp | Diện tích, tần suất, yêu cầu… | Không |
| Địa chỉ đầy đủ | Gộp từ các ô địa chỉ | Tự động |

## Bước 1 — Cài Apps Script trên Sheet

1. Mở [Google Sheet](https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/edit?gid=0#gid=0).
2. **Extensions** → **Apps Script**.
3. Xóa code mặc định, dán nội dung file `scripts/google-sheet-consultation.gs` trong repo.
4. **Save** (Ctrl+S).

## Bước 2 — Tạo tiêu đề cột (chạy 1 lần)

1. Trong Apps Script, chọn hàm **`setupHomeCare365Sheet`** → **Run**.
2. Cho phép quyền truy cập Sheet (tài khoản Google sở hữu file).
3. Quay lại Sheet: dòng 1 có đủ 10 cột như bảng trên, tab đổi tên **Khách hàng**.

## Bước 3 — Deploy Web App

1. **Deploy** → **New deployment** → loại **Web app**.
2. **Execute as:** Me  
3. **Who has access:** Anyone  
4. **Deploy** → copy URL dạng `https://script.google.com/macros/s/.../exec`.

## Bước 4 — Gắn vào website (Vercel)

1. Vercel → project **homecare365-web** → **Settings** → **Environment Variables**.
2. Thêm:

```env
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/XXXX/exec
```

3. **Redeploy** (Production).

### Local (`.env.local`)

```env
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/XXXX/exec
```

## Kiểm tra

1. Mở [form trên site](https://www.homecare365.vn/#dat-lich-tu-van), điền thử → **Gửi yêu cầu**.
2. Mở Sheet → dòng mới với đủ 10 cột.
3. Nếu lỗi trên site: kiểm tra biến `GOOGLE_SHEETS_WEB_APP_URL` trên Vercel đã redeploy chưa.

## Sheet ID (tham khảo)

```
1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8
```

Đã cấu hình sẵn trong `scripts/google-sheet-consultation.gs` và `src/lib/consultation-sheet.ts`.
