# Deploy tự động Apps Script (HomeCare365)

## Một lần — đăng nhập Google

Trong terminal (tài khoản Google **sở hữu** Sheet & Apps Script):

```bash
cd google-apps-script
npx clasp login
```

Cho phép quyền **Apps Script** + **Drive**. File `~/.clasprc.json` được lưu trên máy.

## Mỗi lần đổi code GAS

Từ thư mục gốc repo:

```bash
npm run deploy:apps-script
```

Script sẽ:

1. Copy `scripts/google-sheet-consultation.gs` → `google-apps-script/Code.gs`
2. `clasp push` lên project `1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs`
3. `clasp deploy` **cùng deployment ID** → **URL `/exec` không đổi**
4. Chạy `setupTrackingSheet` (tạo tab `Theo_doi`)

## Kiểm tra sau deploy

Mở (ẩn danh):

```
https://script.google.com/macros/s/AKfycbzhNkAT1_7UkqRWjRbSvAbm9aAbcBdt-7Mqc04ySvB6MzL05M2rnerIro1y3d6aAzGqqA/exec?action=trackingGet&jobId=HC-DEMO01
```

- **Đúng:** `{"ok":true,"session":{...}}` hoặc `{"ok":false,"error":"not_found"}`
- **Sai (chưa deploy):** `{"ok":true,"message":"HomeCare365 webhook OK",...}`

## Project

- Apps Script: https://script.google.com/home/projects/1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs/edit
- Sheet: https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/edit
