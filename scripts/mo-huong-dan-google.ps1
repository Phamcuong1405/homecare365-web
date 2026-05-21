# Mở đúng trang Google — bạn chỉ cần bấm vài nút (không gõ lệnh)
$ErrorActionPreference = "SilentlyContinue"

Add-Type -AssemblyName System.Windows.Forms

$msg = @"
HOME CARE 365 — Làm lần lượt 3 bước (mỗi bước ~30 giây)

BƯỚC 1 (tab vừa mở):
  • Bật công tắc "Google Apps Script API" → ON
  • Bấm SAVE

BƯỚC 2 (tab Sheet):
  • Menu: Tiện ích mở rộng (Extensions) → Apps Script
  • Nếu mở được trình soạn code → bạn đã có quyền (bỏ qua bước 3)

BƯỚC 3 (chỉ khi KHÔNG mở được Apps Script):
  • Nhờ chủ Gmail khác chia sẻ Sheet cho homecare365.vn@gmail.com quyền Chỉnh sửa

Xong hết → quay Cursor, gõ: da xong google
"@

[System.Windows.Forms.MessageBox]::Show($msg, "HomeCare365 - 3 buoc cap quyen", "OK", "Information") | Out-Null

Start-Process "https://script.google.com/home/usersettings"
Start-Sleep -Seconds 2
Start-Process "https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/edit"
Start-Sleep -Seconds 1
Start-Process "https://script.google.com/home/projects/1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs/edit"

Write-Host ""
Write-Host "Da mo 3 tab Chrome. Lam theo huong dan trong hop thoai." -ForegroundColor Green
Write-Host "Xong thi bao AI: da xong google" -ForegroundColor Cyan
Write-Host ""
