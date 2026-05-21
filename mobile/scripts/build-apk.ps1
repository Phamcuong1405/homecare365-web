$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$jdkDir = Join-Path $root ".tools\jdk-21"
if (-not (Test-Path (Join-Path $jdkDir "bin\java.exe"))) {
  $jdkDir = Join-Path $root ".tools\jdk-17"
}
$sdkDir = Join-Path $root ".tools\android-sdk"
$java = Join-Path $jdkDir "bin\java.exe"

if (-not (Test-Path $java)) {
  Write-Host "Chua co JDK/SDK. Dang cai dat..."
  & "$PSScriptRoot\setup-android-build.ps1"
}

$env:JAVA_HOME = $jdkDir
$env:ANDROID_HOME = $sdkDir
$env:ANDROID_SDK_ROOT = $sdkDir
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\cmdline-tools\latest\bin;" + $env:Path

Push-Location $root
npm run sync:android
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Push-Location android
& .\gradlew.bat assembleDebug --no-daemon
$code = $LASTEXITCODE
Pop-Location
Pop-Location
exit $code
