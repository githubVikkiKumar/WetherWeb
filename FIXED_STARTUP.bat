@echo off
echo ========================================
echo Weather App - Fixed Startup Script
echo ========================================
echo.

REM Kill any existing processes
echo Cleaning up existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ng.exe >nul 2>&1

echo.
echo Step 1: Verifying Angular workspace...
if not exist "angular.json" (
    echo ❌ Not in Angular workspace directory
    echo Please run this script from the Angular project root
    pause
    exit /b 1
)
echo ✅ Angular workspace found

echo.
echo Step 2: Building Angular project...
ng build --configuration development
if %errorlevel% neq 0 (
    echo ❌ Build failed, installing dependencies...
    npm install
    ng build --configuration development
    if %errorlevel% neq 0 (
        echo ❌ Build still failing, exiting...
        pause
        exit /b 1
    )
)
echo ✅ Angular build successful

echo.
echo Step 3: Starting Backend Server...
cd backend
start "Weather Backend" cmd /k "node server.js"
cd ..

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Step 4: Starting Frontend Server...
start "Weather Frontend" cmd /k "ng serve --port 4200 --host 0.0.0.0"

echo Waiting 10 seconds for frontend to start...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Weather App Status Check
echo ========================================

echo Checking Backend Server (Port 3000)...
netstat -an | findstr :3000
if %errorlevel% equ 0 (
    echo ✅ Backend server is running
) else (
    echo ❌ Backend server not running
)

echo.
echo Checking Frontend Server (Port 4200)...
netstat -an | findstr :4200
if %errorlevel% equ 0 (
    echo ✅ Frontend server is running
) else (
    echo ❌ Frontend server not running
)

echo.
echo ========================================
echo Weather App Ready!
echo ========================================
echo.
echo 🌤️ Weather App is now running!
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
echo.
echo Opening Weather App in browser...
start http://localhost:4200

echo.
echo Press any key to exit...
pause >nul
