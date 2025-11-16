@echo off
echo Stopping backend server...
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul
echo Starting backend server...
cd backend
start npm run dev
echo Backend restarted!
