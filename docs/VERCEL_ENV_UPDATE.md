# Cập nhật Vercel — URL Web App mới (bắt buộc)

Form website production lấy URL từ biến môi trường Vercel.

## Biến cần đổi

| Tên | Giá trị mới |
|-----|-------------|
| `GOOGLE_SHEETS_WEB_APP_URL` | `https://script.google.com/macros/s/AKfycbyPbkhEVW-5Mt4Dsn7WgCb-g9GySGlyYBoPdU5hJp54Zbot2MQq0owHa1q53mWMSMKkEg/exec` |
| `NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL` | (cùng URL trên) |

## Các bước

1. https://vercel.com → project **homecare365-web**
2. **Settings** → **Environment Variables**
3. Sửa 2 biến trên → **Save**
4. **Deployments** → **Redeploy** bản Production mới nhất

Sau redeploy, form tại https://www.homecare365.vn ghi đúng Sheet qua deployment mới.
