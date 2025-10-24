@echo off
echo Testing Weather App - Error Free Version
echo.

echo Step 1: Testing Angular build...
ng build --configuration development
if %errorlevel% equ 0 (
    echo ✅ Angular build successful
) else (
    echo ❌ Angular build failed
    exit /b 1
)

echo.
echo Step 2: Testing backend server...
cd backend
node server.js &
cd ..

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo Step 3: Testing frontend server...
ng serve --port 4200 &
echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Weather App Test Results
echo ========================================

echo Checking servers...
netstat -an | findstr :3000
if %errorlevel% equ 0 (
    echo ✅ Backend server is running
) else (
    echo ❌ Backend server not running
)

netstat -an | findstr :4200
if %errorlevel% equ 0 (
    echo ✅ Frontend server is running
) else (
    echo ❌ Frontend server not running
)

echo.
echo ========================================
echo Test Complete!
echo ========================================
echo.
echo If both servers are running:
echo - Go to http://localhost:4200
echo - Search for any Indian city
echo - Watch real-time weather updates
echo.
echo Press any key to continue...
pause >nul
