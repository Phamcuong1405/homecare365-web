# Deploy thủ công (không cần clasp) — 3 phút

Dùng khi bạn đã mở được Apps Script từ Sheet (Extensions → Apps Script).

## Bước 1 — Dán code

1. Trong Apps Script, file **Code.gs** → Ctrl+A → Delete  
2. Mở file trên máy: `C:\Users\ADMIN\navtools-web\scripts\google-sheet-consultation.gs`  
3. Copy toàn bộ → dán vào Code.gs → **Save** (Ctrl+S)

## Bước 2 — Tạo tab tracking (chạy 1 lần)

1. Menu hàm (dropdown trên) → chọn **`setupTrackingSheet`**  
2. **Run** ▶  
3. **Review permissions** → chọn tài khoản → **Allow**

## Bước 3 — Deploy Web App (giữ URL cũ)

1. **Deploy** → **Manage deployments**  
2. Biểu tượng **✏️** (Edit) hàng Web app hiện tại  
3. **Version** → **New version**  
4. **Deploy**  
5. **Không đổi** URL `/exec`

## Bước 4 — Kiểm tra

Mở link (ẩn danh):

```
https://script.google.com/macros/s/AKfycbzbZ7QEFIjXGOTAQbLKgidW9VL_Fg87XHUzCY7RcYfAWXr-eofqwDgF9ep8mS2fLmjEug/exec?action=trackingGet&jobId=HC-DEMO01
```

Đúng: `"session"` hoặc `"error":"not_found"`  
Sai: `"message":"HomeCare365 webhook OK"`

Báo AI: **đã deploy thủ công**
