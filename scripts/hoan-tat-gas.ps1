# Hoan tat: copy code + mo Apps Script + huong dan Vercel
$root = Split-Path $PSScriptRoot -Parent
$codePath = Join-Path $root "scripts\google-sheet-consultation.gs"

Get-Content $codePath -Raw | Set-Clipboard
Write-Host "DA COPY Code.gs vao clipboard!" -ForegroundColor Green

# Mo Sheet (cach chac chan) — Extensions → Apps Script
Start-Process "https://docs.google.com/spreadsheets/d/1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8/edit"
Start-Sleep -Seconds 2
Start-Process "https://script.google.com/home/projects/1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs/edit"

Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.MessageBox]::Show(
@"

DA COPY CODE VAO CLIPBOARD!

TAB 1 - Sheet: Tien ich mo rong → Apps Script
   (neu khong thay menu, dung TAB 2)

TAB 2 - Apps Script:
1. Code.gs -> Ctrl+A -> Ctrl+V -> Save
2. Ham: setupHomeCare365Sheet -> Run -> Allow
3. Nut Deploy (goc phai) -> Manage deployments
   -> Edit web app -> New version -> Deploy
4. Mo URL (sua tieu de cot Sheet):
   .../exec?action=fixHeaders
   Cot 1 phai la: Thoi gian, Ho va ten, So dien thoai...

VERCEL (bat buoc):
Settings -> Environment Variables
GOOGLE_SHEETS_WEB_APP_URL =
https://script.google.com/macros/s/AKfycbyo1UQaWaix0N-38hDPsvBiKxRBKdrmLsErvD7LPmm6aSTctKNm08bqnv48e8X5hVujfQ/exec

Redeploy Production

Xong bao: da xong gas

"@,
"HomeCare365 - Buoc cuoi",
"OK",
"Information"
) | Out-Null
