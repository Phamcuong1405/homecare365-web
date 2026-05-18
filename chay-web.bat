@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Dang cai dat npm...
  call npm install
)
echo Mo http://localhost:3000
call npm run dev
