@echo off
echo Starting Weather App with Real-time Updates...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Angular CLI is installed
ng version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Angular CLI is not installed
    echo Please install Angular CLI: npm install -g @angular/cli
    pause
    exit /b 1
)

echo Starting Backend Server...
start "Weather Backend" cmd /k "cd backend && npm start"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Weather Frontend" cmd /k "ng serve"

echo.
echo Weather App is starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:4200
echo.
echo Press any key to exit...
pause >nul
