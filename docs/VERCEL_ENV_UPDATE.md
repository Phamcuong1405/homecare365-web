# Cập nhật Vercel — URL Web App mới (bắt buộc)

Form website production lấy URL từ biến môi trường Vercel.

## Biến cần đổi

| Tên | Giá trị mới |
|-----|-------------|
| `GOOGLE_SHEETS_WEB_APP_URL` | `https://script.google.com/macros/s/AKfycbzbZ7QEFIjXGOTAQbLKgidW9VL_Fg87XHUzCY7RcYfAWXr-eofqwDgF9ep8mS2fLmjEug/exec` |
| `NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL` | (cùng URL trên) |

## Các bước

1. https://vercel.com → project **homecare365-web**
2. **Settings** → **Environment Variables**
3. Sửa 2 biến trên → **Save**
4. **Deployments** → **Redeploy** bản Production mới nhất

Sau redeploy, form tại https://www.homecare365.vn ghi đúng Sheet qua deployment mới.
