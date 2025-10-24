@echo off
title Weather App - Fixed Card Display

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js to run the backend.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if Angular CLI is installed
where ng >nul 2>&1
if %errorlevel% neq 0 (
    echo Angular CLI is not installed. Please install it using: npm install -g @angular/cli
    pause
    exit /b 1
)

echo Starting Weather App with Fixed Card Display...

:: Step 1: Navigate to backend and install dependencies if needed
echo.
echo [Backend] Installing backend dependencies (if not already installed)...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [Backend] Failed to install backend dependencies. Exiting.
    pause
    exit /b 1
)
cd ..

:: Step 2: Start backend server in a new window
echo.
echo [Backend] Starting backend server on port 3000...
start cmd /k "cd backend && node server.js"
if %errorlevel% neq 0 (
    echo [Backend] Failed to start backend server. Exiting.
    pause
    exit /b 1
)
timeout /t 5 >nul

:: Step 3: Navigate to frontend and install dependencies if needed
echo.
echo [Frontend] Installing frontend dependencies (if not already installed)...
call npm install
if %errorlevel% neq 0 (
    echo [Frontend] Failed to install frontend dependencies. Exiting.
    pause
    exit /b 1
)

:: Step 4: Build Angular project
echo.
echo [Frontend] Building Angular project...
call ng build
if %errorlevel% neq 0 (
    echo [Frontend] Angular build failed. Exiting.
    pause
    exit /b 1
)

:: Step 5: Start Angular frontend in a new window
echo.
echo [Frontend] Starting Angular frontend on port 4200...
start cmd /k "ng serve --port 4200 --host 0.0.0.0"
if %errorlevel% neq 0 (
    echo [Frontend] Failed to start Angular frontend. Exiting.
    pause
    exit /b 1
)
timeout /t 10 >nul

echo.
echo ========================================
echo Weather App with Fixed Card Display is now running!
echo ========================================
echo.
echo Frontend: http://localhost:4200
echo Backend: http://localhost:3000
echo.
echo Card Display Fixes Applied:
echo - Fixed image binding in HTML templates
echo - Improved card layout and spacing
echo - Enhanced card hover effects
echo - Better scrollbar styling
echo - Responsive card sizing
echo.
echo Press any key to close this window and keep servers running...
pause >nul
exit /b 0
