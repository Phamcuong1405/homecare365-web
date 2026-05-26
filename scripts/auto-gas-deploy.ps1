# Tự động tối đa: sync code -> clasp push -> deploy -> setupOps
# Lần đầu cần clasp login (trình duyệt mở, bấm Allow một lần)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$gasDir = Join-Path $root "google-apps-script"
$src = Join-Path $root "scripts\google-sheet-consultation.gs"
$dst = Join-Path $gasDir "Code.gs"

Write-Host "`n=== HomeCare365 — Auto GAS Deploy ===`n" -ForegroundColor Cyan

Copy-Item $src $dst -Force
Get-Content $src -Raw | Set-Clipboard
Write-Host "[OK] Da copy Code.gs vao clipboard" -ForegroundColor Green

$clasprc = Join-Path $env:USERPROFILE ".clasprc.json"
if (-not (Test-Path $clasprc)) {
    Write-Host "[!] Chua clasp login — mo trinh duyet..." -ForegroundColor Yellow
    Start-Process "https://script.google.com/home/usersettings"
    Start-Process "https://script.google.com/home/projects/1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs/edit"
    Push-Location $gasDir
    npx clasp login
    Pop-Location
}

Push-Location $gasDir
try {
    Write-Host "`n> clasp push..." -ForegroundColor Gray
    npx clasp push -f
    if ($LASTEXITCODE -ne 0) { throw "clasp push failed" }

    $depId = Get-Content (Join-Path $gasDir "deployment-id.txt") -Raw
    $depId = $depId.Trim()
    Write-Host "`n> clasp deploy (giu URL cu)..." -ForegroundColor Gray
    npx clasp deploy -i $depId --description "HomeCare365 ops+tracking"

    Write-Host "`n> clasp run setupOpsSheets..." -ForegroundColor Gray
    npx clasp run setupOpsSheets 2>$null
    npx clasp run setupTrackingSheet 2>$null
}
catch {
    Write-Host "`n[LOI] $($_.Exception.Message)" -ForegroundColor Red
    Write-Host @"

Khong push duoc tu may nay. Lam thu cong (code da trong clipboard):

1. Tab Apps Script -> Code.gs -> Ctrl+A -> Ctrl+V -> Save
2. Chon ham setupOpsSheets -> Run -> Allow
3. Deploy -> Manage deployments -> Edit -> New version -> Deploy

"@ -ForegroundColor Yellow
    Start-Process "https://script.google.com/home/projects/1_lj5DMji92EOynZitTdrT1sSovzwyNMKWHjxJiexYTkqtZhjr_vFkJvs/edit"
    Pop-Location
    exit 1
}
Pop-Location

Push-Location $root
node scripts/gas-post-setup.mjs
$code = $LASTEXITCODE
Pop-Location

if ($code -eq 0) {
    Write-Host "`nHOAN TAT — GAS ops da san sang.`n" -ForegroundColor Green
} else {
    Write-Host "`nChay lai sau khi Deploy New version: node scripts/gas-post-setup.mjs`n" -ForegroundColor Yellow
}
exit $code
