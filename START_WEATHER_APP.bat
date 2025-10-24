@echo off
echo Starting Weather App with Real-Time Updates...
echo.

REM Kill any existing processes
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ng.exe >nul 2>&1

echo Building Angular project...
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
echo Starting Frontend Server...
start "Weather Frontend" cmd /k "ng serve --port 4200"

echo Waiting 10 seconds for frontend to start...
timeout /t 10 /nobreak >nul

echo.
echo Weather App Started Successfully!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:4200
echo.
echo Real-time updates every 2 minutes
echo Manual refresh button available
echo.
echo Opening Weather App...
start http://localhost:4200

echo.
pause
