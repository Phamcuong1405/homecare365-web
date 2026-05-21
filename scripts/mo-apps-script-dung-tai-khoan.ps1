# Mo Apps Script voi dung tai khoan Google (tranh loi nhieu account)
$sheetId = "1G84ZEO31bvWJGxdaaQHSGcF_z0SGTvWuOL3zVpw1Kg8"
$scriptId = "1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs"

$codePath = Join-Path (Split-Path $PSScriptRoot -Parent) "scripts\google-sheet-consultation.gs"
Get-Content $codePath -Raw | Set-Clipboard
Write-Host "Da copy Code.gs vao clipboard." -ForegroundColor Green

Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.MessageBox]::Show(
@"
LOI NHIEU TAI KHOAN GOOGLE (authuser=2)

LAM THEO THU TU:

1) Trong tab Sheet, goc PHAI anh dai dien Google
   -> Chon tai khoan CHU Sheet (homecare365.vn hoac Gmail tao Sheet)

2) Mo lai Sheet (tab moi):
   https://docs.google.com/spreadsheets/d/$sheetId/edit

3) Thu lan luot 3 link (tab moi), link nao MO DUOC editor thi DUNG link do:

   Tai khoan 1: ?authuser=0
   Tai khoan 2: ?authuser=1
   Tai khoan 3: ?authuser=2

4) Hoac: Ctrl+Shift+N (Chrome an danh)
   -> Chi dang nhap 1 Gmail chu Sheet
   -> Mo Sheet -> Extensions -> Apps Script

Code da copy san — Ctrl+V vao Code.gs
"@,
"HomeCare365 - Sua loi Apps Script",
"OK",
"Warning"
) | Out-Null

# Mo Sheet + 3 link script voi authuser 0,1,2
Start-Process "https://docs.google.com/spreadsheets/d/$sheetId/edit"
Start-Sleep -Seconds 1
foreach ($i in 0, 1, 2) {
  Start-Process "https://script.google.com/home/projects/$scriptId/edit?authuser=$i"
  Start-Sleep -Milliseconds 800
}

Write-Host "Da mo Sheet + 3 tab Apps Script (authuser 0,1,2). Dung tab nao mo duoc editor." -ForegroundColor Cyan
