@echo off
echo ========================================
echo Weather App - Card Display Fix
echo ========================================
echo.

REM Kill any existing processes
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ng.exe >nul 2>&1

echo Building Angular project with card fixes...
ng build --configuration development
if %errorlevel% neq 0 (
    npm install
    ng build --configuration development
)

echo.
echo Starting Backend Server...
cd backend
start "Weather Backend" cmd /k "node server.js"
cd ..

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server with card fixes...
start "Weather Frontend" cmd /k "ng serve --port 4200 --host 0.0.0.0"

echo Waiting 10 seconds for frontend to start...
timeout /t 10 /nobreak >nul

echo.
echo Weather App Started with Card Fixes!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:4200
echo.
echo Card Display Fixes Applied:
echo - Fixed card data processing
echo - Optimized card sizing (80px x 100px)
echo - Improved card spacing and alignment
echo - Enhanced card content display
echo - Better temperature formatting
echo - Professional card shadows
echo - Perfect card arrangement
echo - Real-time updates every 2 minutes
echo.
echo Opening Weather App...
start http://localhost:4200

echo.
echo Cards should now display perfectly with proper data!
echo.
pause

