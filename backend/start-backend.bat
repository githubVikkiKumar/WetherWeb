@echo off
echo Starting Weather API Backend Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist package.json (
    echo Error: package.json not found
    echo Please run this script from the backend directory
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy env.example .env
    echo.
    echo Please edit .env file and add your OpenWeatherMap API key
    echo Get your API key from: https://openweathermap.org/api
    echo.
)

REM Start the server
echo Starting Weather API Server...
echo Backend will be available at: http://localhost:3000
echo WebSocket server ready for real-time updates
echo.
echo Press Ctrl+C to stop the server
echo.

npm start

