$root = Split-Path $PSScriptRoot -Parent
$apk = Join-Path $root "android\app\build\outputs\apk\debug\app-debug.apk"
$outDir = Join-Path $root "build"
$outApk = Join-Path $outDir "homecare365-debug.apk"
$desktop = [Environment]::GetFolderPath("Desktop")
$desktopApk = Join-Path $desktop "HomeCare365-debug.apk"

if (-not (Test-Path $apk)) {
  Write-Error "Chua co APK. Chay: npm run build:android:debug"
  exit 1
}

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
Copy-Item $apk $outApk -Force
Copy-Item $apk $desktopApk -Force
Write-Host "APK test:"
Write-Host "  $outApk"
Write-Host "  $desktopApk"
explorer.exe "/select,$outApk"
