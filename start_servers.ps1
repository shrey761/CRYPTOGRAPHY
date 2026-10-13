# PowerShell Launcher for RSA Cryptosystem Full-Stack App
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  RSA Key Generation & Cryptographic Key Management System" -ForegroundColor Green
Write-Host "  Course Project: Cryptography and Network Security (CNS)" -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Write-Host "`n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Cyan
$BackendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$CurrentDir\backend'; python run.py" -PassThru

# Start Frontend
Write-Host "[2/2] Starting React Vite Frontend on http://localhost:5173..." -ForegroundColor Cyan
$FrontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$CurrentDir\frontend'; npm run dev" -PassThru

Write-Host "`n✓ System running!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:  http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  Swagger:  http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Cyan
