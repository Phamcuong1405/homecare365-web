# App quản lý & cổng nhân viên

## Hai ứng dụng

| Vai trò | URL | Mô tả |
|---------|-----|--------|
| **Khách** | `/m/home`, `/m/book` | Đặt lịch, theo dõi GPS |
| **Nhân viên** | `/m/staff/register`, `/m/staff/login`, `/m/staff/home` | Đăng ký, nhận việc được giao, chia sẻ GPS |
| **Quản lý** | `/admin/login`, `/admin/jobs`, `/admin/staff` | Duyệt NV, phân công việc (vd. việc HC… → NV001) |

## Luồng phân công

1. Khách đặt lịch → tạo mã việc `HC…` + dòng tab **Cong_viec** trên Google Sheet.
2. Nhân viên đăng ký → tab **Nhan_vien**, trạng thái `pending`.
3. Quản lý đăng nhập `/admin` → **Duyệt** nhân viên → `active`.
4. Quản lý mở **Công việc** → chọn `NV001` → **Giao việc**.
5. Nhân viên đăng nhập → thấy việc → **Chia sẻ GPS** (`/m/staff/track?job=…`).

## Cấu hình

**Vercel** — thêm biến:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<mật-khẩu-quản-lý>
ADMIN_OPS_KEY=<mã-api-nội-bộ>
```

Đăng nhập tại `/admin/login` bằng **tài khoản + mật khẩu** (không hiển thị mã API trên form).

**Apps Script** — sau khi dán code mới, chạy một lần trong editor:

- `setupOpsSheets` — tạo tab `Nhan_vien`, `Cong_viec`
- Deploy → **New version** Web app

Hoặc POST: `{ "action": "setupOps" }` tới URL `/exec`.

## Sheet

- `Nhan_vien`: staffId, name, phone, email, pin, status, registeredAt
- `Cong_viec`: jobId, customerName, phone, address, serviceNote, status, staffId, staffName, …

## Bảo mật (MVP)

- PIN nhân viên lưu trên Sheet (nên nâng cấp hash + OTP sau).
- API admin yêu cầu header `x-admin-key` = `ADMIN_OPS_KEY`.
