@echo off
echo ========================================
echo Fixed Backend Server
echo ========================================
echo.

echo Killing any existing Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo.
echo Starting Fixed Backend Server...
cd backend
start "Fixed Backend" cmd /k "node server.js"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Testing Backend Server...
netstat -an | findstr :3000
if %errorlevel% equ 0 (
    echo ✅ Backend server is running on port 3000
) else (
    echo ❌ Backend server is not running
)

echo.
echo Backend server started!
echo Go to http://localhost:3000/api/health to test
echo.
pause
