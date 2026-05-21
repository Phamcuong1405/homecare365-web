# Cài JDK 17 + Android SDK vào mobile\.tools (không cần Android Studio)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$tools = Join-Path $root ".tools"
$jdkDir = Join-Path $tools "jdk-21"
$sdkDir = Join-Path $tools "android-sdk"
$zipJdk = Join-Path $tools "jdk.zip"
$zipSdk = Join-Path $tools "cmdline-tools.zip"

New-Item -ItemType Directory -Force -Path $tools | Out-Null

function Ensure-Jdk {
  $java = Join-Path $jdkDir "bin\java.exe"
  if (Test-Path $java) {
    Write-Host "JDK: $jdkDir"
    return
  }
  Write-Host "Downloading Microsoft JDK 17..."
  $jdkUrl = "https://aka.ms/download-jdk/microsoft-jdk-21.0.7-windows-x64.zip"
  Invoke-WebRequest -Uri $jdkUrl -OutFile $zipJdk -UseBasicParsing
  Expand-Archive -Path $zipJdk -DestinationPath $tools -Force
  $extracted = Get-ChildItem $tools -Directory | Where-Object { $_.Name -like "jdk-21*" } | Select-Object -First 1
  if ($extracted.FullName -ne $jdkDir) {
    if (Test-Path $jdkDir) { Remove-Item $jdkDir -Recurse -Force }
    Rename-Item $extracted.FullName $jdkDir
  }
  Remove-Item $zipJdk -Force -ErrorAction SilentlyContinue
}

function Ensure-AndroidSdk {
  $sdkmanager = Join-Path $sdkDir "cmdline-tools\latest\bin\sdkmanager.bat"
  if (-not (Test-Path $sdkmanager)) {
    Write-Host "Downloading Android command-line tools..."
    $sdkUrl = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
    Invoke-WebRequest -Uri $sdkUrl -OutFile $zipSdk -UseBasicParsing
    $cmdlineRoot = Join-Path $sdkDir "cmdline-tools"
    New-Item -ItemType Directory -Force -Path (Join-Path $cmdlineRoot "latest") | Out-Null
    Expand-Archive -Path $zipSdk -DestinationPath $tools -Force
    $extracted = Join-Path $tools "cmdline-tools"
    Copy-Item -Path (Join-Path $extracted "*") -Destination (Join-Path $cmdlineRoot "latest") -Recurse -Force
    Remove-Item $extracted -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item $zipSdk -Force -ErrorAction SilentlyContinue
  }

  $env:JAVA_HOME = $jdkDir
  $env:ANDROID_HOME = $sdkDir
  $env:ANDROID_SDK_ROOT = $sdkDir
  $env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;" + $env:Path

  Write-Host "Installing SDK packages (may take a few minutes)..."
  echo y | sdkmanager --licenses 2>&1 | Out-Null
  sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"
}

Ensure-Jdk
Ensure-AndroidSdk

$localProps = Join-Path $root "android\local.properties"
"sdk.dir=$($sdkDir -replace '\\','\\')" | Set-Content -Path $localProps -Encoding UTF8
Write-Host "Wrote $localProps"
Write-Host "Done. Run: npm run build:android:debug"
