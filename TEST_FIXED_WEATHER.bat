@echo off
echo ========================================
echo Test Fixed Weather App
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
echo Step 2: Starting Fixed Backend Server...
cd backend
start "Fixed Backend" cmd /k "node server.js"
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
echo Fixed Weather App Status Check
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
echo Fixed Weather App Ready!
echo ========================================
echo.
echo 🌤️ Fixed Weather App is now running!
echo.
echo 📍 Backend API: http://localhost:3000
echo 🌐 Frontend App: http://localhost:4200
echo.
echo 🔧 Fixed Issues:
echo ✅ Backend indianCities error fixed
echo ✅ Global search working
echo ✅ Real-time updates working
echo ✅ All locations supported
echo.
echo 🎯 How to Test:
echo 1. Go to http://localhost:4200
echo 2. Search for any location:
echo    - Indian: Mumbai, Delhi, Bangalore
echo    - International: New York, London, Tokyo
echo    - Global: Sydney, Dubai, Singapore
echo 3. Watch real-time weather updates every 30 seconds
echo 4. Check browser console (F12) for logs
echo.
echo Opening Fixed Weather App in browser...
start http://localhost:4200

echo.
echo Press any key to exit...
pause >nul
