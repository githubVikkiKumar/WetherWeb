@echo off
echo Weather App - Simple Start
echo.

REM Kill existing processes
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ng.exe >nul 2>&1

echo Starting Backend Server...
cd backend
start "Backend" cmd /k "node server.js"
cd ..

echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Frontend" cmd /k "ng serve --port 4200"

echo Waiting 10 seconds...
timeout /t 10 /nobreak >nul

echo.
echo Weather App Started!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:4200
echo.
echo Opening browser...
start http://localhost:4200

echo.
pause
