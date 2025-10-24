@echo off
echo Starting Weather App with Real-time Backend...
echo.

REM Kill any existing processes
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ng.exe >nul 2>&1

echo Starting Backend Server...
start "Weather Backend" cmd /k "cd backend && node server.js"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Weather Frontend" cmd /k "ng serve --port 4200 --host 0.0.0.0"

echo Waiting 10 seconds for frontend to start...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Weather App Status
echo ========================================
echo Backend: http://localhost:3000
echo Frontend: http://localhost:4200
echo.
echo Opening Weather App in browser...
start http://localhost:4200

echo.
echo Real-time weather updates are now active!
echo - Backend server running on port 3000
echo - Frontend server running on port 4200
echo - Auto-refresh every 30 seconds
echo - Demo mode enabled for testing
echo.
echo To test real-time updates:
echo 1. Search for any Indian city (Mumbai, Delhi, Bangalore)
echo 2. Watch the weather data update automatically
echo 3. Check browser console (F12) for update logs
echo.
pause
