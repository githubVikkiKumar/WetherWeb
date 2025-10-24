@echo off
echo Starting Weather App...
echo.

REM Kill any existing processes
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ng.exe >nul 2>&1

echo Starting Backend Server...
start "Weather Backend" cmd /k "cd backend && node server.js"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Weather Frontend" cmd /k "ng serve --open"

echo.
echo Weather App is starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:4200
echo.
echo Both servers are starting in separate windows.
echo Wait for the frontend to open in your browser.
echo.
pause
