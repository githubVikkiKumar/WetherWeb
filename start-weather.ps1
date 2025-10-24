# Weather App PowerShell Startup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Weather App - PowerShell Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill existing processes
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "ng" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host ""
Write-Host "Step 1: Verifying Angular workspace..." -ForegroundColor Yellow
if (-not (Test-Path "angular.json")) {
    Write-Host "❌ Not in Angular workspace directory" -ForegroundColor Red
    Write-Host "Please run this script from the Angular project root" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Angular workspace found" -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Building Angular project..." -ForegroundColor Yellow
ng build --configuration development
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed, installing dependencies..." -ForegroundColor Red
    npm install
    ng build --configuration development
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build still failing, exiting..." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host "✅ Angular build successful" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Starting Backend Server..." -ForegroundColor Yellow
Set-Location backend
Start-Process -FilePath "cmd" -ArgumentList "/k", "node server.js" -WindowStyle Normal
Set-Location ..

Write-Host "Waiting 5 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Step 4: Starting Frontend Server..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k", "ng serve --port 4200 --host 0.0.0.0" -WindowStyle Normal

Write-Host "Waiting 10 seconds for frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Weather App Status Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Checking Backend Server (Port 3000)..." -ForegroundColor Yellow
$backendRunning = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($backendRunning) {
    Write-Host "✅ Backend server is running" -ForegroundColor Green
} else {
    Write-Host "❌ Backend server not running" -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking Frontend Server (Port 4200)..." -ForegroundColor Yellow
$frontendRunning = Get-NetTCPConnection -LocalPort 4200 -ErrorAction SilentlyContinue
if ($frontendRunning) {
    Write-Host "✅ Frontend server is running" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend server not running" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Weather App Ready!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌤️ Weather App is now running!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend API: http://localhost:3000" -ForegroundColor Yellow
Write-Host "🌐 Frontend App: http://localhost:4200" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔄 Real-time Features:" -ForegroundColor Cyan
Write-Host "✅ Auto-refresh every 30 seconds" -ForegroundColor Green
Write-Host "✅ Backend API integration" -ForegroundColor Green
Write-Host "✅ Enhanced search for Indian cities" -ForegroundColor Green
Write-Host "✅ Demo mode fallback" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 How to Test:" -ForegroundColor Cyan
Write-Host "1. Go to http://localhost:4200" -ForegroundColor White
Write-Host "2. Search for any Indian city (Mumbai, Delhi, Bangalore)" -ForegroundColor White
Write-Host "3. Watch weather data update automatically" -ForegroundColor White
Write-Host ""
Write-Host "Opening Weather App in browser..." -ForegroundColor Yellow
Start-Process "http://localhost:4200"

Write-Host ""
Read-Host "Press Enter to exit"
