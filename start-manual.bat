@echo off
echo Manual Weather App Startup...
echo.

echo Step 1: Starting Backend Server...
start "Backend" cmd /k "cd backend && node server.js"

echo.
echo Step 2: Wait for backend to start (5 seconds)...
timeout /t 5 /nobreak >nul

echo.
echo Step 3: Starting Frontend Server...
start "Frontend" cmd /k "ng serve --port 4200"

echo.
echo Step 4: Wait for frontend to start (10 seconds)...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Weather App Started Successfully!
echo ========================================
echo.
echo Backend Server: http://localhost:3000
echo Frontend Server: http://localhost:4200
echo.
echo Opening Weather App...
start http://localhost:4200

echo.
echo Real-time Weather Features:
echo ✅ Auto-refresh every 30 seconds
echo ✅ Backend API integration
echo ✅ Enhanced search for Indian cities
echo ✅ Demo mode fallback
echo.
echo To test:
echo 1. Search for "Mumbai" or any Indian city
echo 2. Watch weather data update automatically
echo 3. Check browser console (F12) for logs
echo.
pause
