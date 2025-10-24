@echo off
echo ========================================
echo Global Weather App Test
echo ========================================
echo.

REM Kill any existing processes
echo Cleaning up existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ng.exe >nul 2>&1

echo.
echo Step 1: Building Angular project...
ng build --configuration development
if %errorlevel% neq 0 (
    echo ❌ Build failed, installing dependencies...
    npm install
    ng build --configuration development
    if %errorlevel% neq 0 (
        echo ❌ Build still failing
        pause
        exit /b 1
    )
)
echo ✅ Angular build successful

echo.
echo Step 2: Starting Backend Server...
cd backend
start "Weather Backend" cmd /k "node server.js"
cd ..

echo Waiting 8 seconds for backend to start...
timeout /t 8 /nobreak >nul

echo.
echo Step 3: Starting Frontend Server...
start "Weather Frontend" cmd /k "ng serve --port 4200 --host 0.0.0.0"

echo Waiting 15 seconds for frontend to start...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo Global Weather App Status Check
echo ========================================

echo Checking Backend Server (Port 3000)...
netstat -an | findstr :3000
if %errorlevel% equ 0 (
    echo ✅ Backend server is running on port 3000
) else (
    echo ❌ Backend server is not running
)

echo.
echo Checking Frontend Server (Port 4200)...
netstat -an | findstr :4200
if %errorlevel% equ 0 (
    echo ✅ Frontend server is running on port 4200
) else (
    echo ❌ Frontend server is not running
)

echo.
echo ========================================
echo Global Weather App Ready!
echo ========================================
echo.
echo 🌍 Global Weather App is now running!
echo.
echo 📍 Backend API: http://localhost:3000
echo 🌐 Frontend App: http://localhost:4200
echo.
echo 🔄 Real-time Features:
echo ✅ Auto-refresh every 30 seconds
echo ✅ Global location search (India + International)
echo ✅ Enhanced search for all countries
echo ✅ Real-time weather updates
echo ✅ Demo mode fallback
echo.
echo 🎯 How to Test Global Search:
echo 1. Go to http://localhost:4200
echo 2. Search for any location:
echo    - Indian cities: Mumbai, Delhi, Bangalore, Chennai
echo    - International: New York, London, Tokyo, Paris
echo    - Global cities: Sydney, Dubai, Singapore, Hong Kong
echo 3. Watch weather data update automatically every 30 seconds
echo 4. Check browser console (F12) for real-time logs
echo.
echo 🌍 Supported Global Locations:
echo - India: Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad
echo - USA: New York, Los Angeles, Chicago, Houston
echo - Europe: London, Paris, Berlin, Rome, Madrid
echo - Asia: Tokyo, Beijing, Seoul, Bangkok, Singapore
echo - Others: Sydney, Dubai, Toronto, Cairo, Nairobi
echo.
echo Opening Global Weather App in browser...
start http://localhost:4200

echo.
echo Press any key to exit...
pause >nul
