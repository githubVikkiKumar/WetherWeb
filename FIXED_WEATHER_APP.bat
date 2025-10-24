@echo off
echo ========================================
echo Weather App - Fixed Version
echo ========================================
echo.

REM Kill any existing processes
echo Cleaning up existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ng.exe >nul 2>&1

echo.
echo Starting Backend Server...
start "Weather Backend" cmd /k "cd backend && node server.js"

echo Waiting 8 seconds for backend to start...
timeout /t 8 /nobreak >nul

echo.
echo Starting Frontend Server...
start "Weather Frontend" cmd /k "ng serve --port 4200 --host 0.0.0.0"

echo Waiting 15 seconds for frontend to start...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo Weather App Status Check
echo ========================================

echo Checking Backend Server...
netstat -an | findstr :3000
if %errorlevel% equ 0 (
    echo ✅ Backend server is running on port 3000
) else (
    echo ❌ Backend server failed to start
)

echo.
echo Checking Frontend Server...
netstat -an | findstr :4200
if %errorlevel% equ 0 (
    echo ✅ Frontend server is running on port 4200
) else (
    echo ❌ Frontend server failed to start
)

echo.
echo ========================================
echo Weather App Ready!
echo ========================================
echo.
echo 🌤️ Weather App is now running with real-time updates!
echo.
echo 📍 Backend API: http://localhost:3000
echo 🌐 Frontend App: http://localhost:4200
echo.
echo 🔄 Real-time Features:
echo ✅ Auto-refresh every 30 seconds
echo ✅ Backend API integration
echo ✅ Enhanced search for Indian cities
echo ✅ Demo mode fallback
echo.
echo 🎯 How to Test:
echo 1. Go to http://localhost:4200
echo 2. Search for any Indian city (Mumbai, Delhi, Bangalore)
echo 3. Watch weather data update automatically
echo 4. Check browser console (F12) for real-time logs
echo.
echo Opening Weather App in browser...
start http://localhost:4200

echo.
echo Press any key to exit...
pause >nul
