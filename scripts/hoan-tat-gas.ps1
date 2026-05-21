# Hoan tat: copy code + mo Apps Script + huong dan Vercel
$root = Split-Path $PSScriptRoot -Parent
$codePath = Join-Path $root "scripts\google-sheet-consultation.gs"

Get-Content $codePath -Raw | Set-Clipboard
Write-Host "DA COPY Code.gs vao clipboard!" -ForegroundColor Green

Start-Process "https://script.google.com/home/projects/1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs/edit"
Start-Sleep -Seconds 2
Start-Process "https://script.google.com/home/deployments?project=1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs"

Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.MessageBox]::Show(
@"

DA COPY CODE VAO CLIPBOARD!

Trong Apps Script (tab vua mo):
1. Code.gs -> Ctrl+A -> Ctrl+V -> Save
2. Ham: setupTrackingSheet -> Run -> Allow
3. Deploy -> Manage deployments -> Edit (web app)
   -> New version -> Deploy

VERCEL (bat buoc):
Settings -> Environment Variables
GOOGLE_SHEETS_WEB_APP_URL =
https://script.google.com/macros/s/AKfycbyPbkhEVW-5Mt4Dsn7WgCb-g9GySGlyYBoPdU5hJp54Zbot2MQq0owHa1q53mWMSMKkEg/exec

Redeploy Production

Xong bao: da xong gas

"@,
"HomeCare365 - Buoc cuoi",
"OK",
"Information"
) | Out-Null
