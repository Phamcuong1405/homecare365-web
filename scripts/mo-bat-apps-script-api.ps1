# Mo trang bat Apps Script API + copy code + mo editor
$root = Split-Path $PSScriptRoot -Parent
$src = Join-Path $root "scripts\google-sheet-consultation.gs"
Get-Content $src -Raw | Set-Clipboard
Write-Host "DA COPY Code.gs vao clipboard!" -ForegroundColor Green
Start-Process "https://script.google.com/home/usersettings"
Start-Sleep -Seconds 2
Start-Process "https://script.google.com/home/projects/1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs/edit"
Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.MessageBox]::Show(
@"
BUOC 1 — Bat API (BAT BUOC):
https://script.google.com/home/usersettings
→ Bat ON ""Google Apps Script API"" → Save
→ Doi 2-3 phut

BUOC 2A — Tu dong (sau khi bat API):
cd C:\Users\ADMIN\navtools-web
npm run deploy:apps-script

BUOC 2B — Hoac dan tay (luon duoc):
Tab Apps Script da mo:
1. Code.gs → Ctrl+A → Ctrl+V (da copy) → Save
2. Ham setupOpsSheets → Run → Allow
3. Deploy → Manage deployments → Edit → New version → Deploy

BUOC 3 — Kiem tra:
npm run gas:post-setup
→ staffList OK, jobList OK
"@,
"HomeCare365 - Bat Apps Script API",
"OK",
"Information"
) | Out-Null
