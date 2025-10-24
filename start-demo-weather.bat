@echo off
echo Starting Weather App in Demo Mode...
echo.

REM Kill any existing processes
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ng.exe >nul 2>&1

echo Starting Frontend Server (Demo Mode)...
echo The app will use demo weather data.
echo.

start "Weather App Demo" cmd /k "ng serve --open"

echo.
echo Weather App Demo is starting...
echo Frontend: http://localhost:4200
echo.
echo The app will work with demo weather data.
echo You can search for any Indian city and see demo weather.
echo.
pause
