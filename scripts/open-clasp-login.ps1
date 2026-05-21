# Mở trình duyệt đăng nhập clasp (chạy 1 lần)
Set-Location "$PSScriptRoot\..\google-apps-script"
Write-Host "Chay: npx clasp login" -ForegroundColor Cyan
npx clasp login
