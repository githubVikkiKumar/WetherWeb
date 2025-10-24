@echo off
echo Starting Real-Time Weather App...
echo.

echo Killing existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ng.exe >nul 2>&1

echo.
echo Starting Backend Server...
cd backend
start "Backend" cmd /k "node server.js"
cd ..

echo Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server...
start "Frontend" cmd /k "ng serve --port 4200"

echo Waiting 10 seconds...
timeout /t 10 /nobreak >nul

echo.
echo Real-Time Weather App Started!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:4200
echo.
echo Opening browser...
start http://localhost:4200

echo.
echo Real-time updates every 5 seconds!
echo Search for any location to see live weather updates.
echo.
pause
