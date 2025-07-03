# Script PowerShell para iniciar Backend y Frontend
Write-Host "Iniciando el sistema ShopCart..." -ForegroundColor Green
Write-Host ""

# Obtener la ruta del directorio del script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Iniciando Backend (puerto 5000)..." -ForegroundColor Yellow
$backendPath = Join-Path $scriptPath "Backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev"

Write-Host ""
Write-Host "Esperando 3 segundos antes de iniciar el Frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Iniciando Frontend (puerto 3000)..." -ForegroundColor Yellow
$frontendPath = Join-Path $scriptPath "Frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host ""
Write-Host "Ambos servidores se están iniciando:" -ForegroundColor Green
Write-Host "- Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para detener los servidores, cierra las ventanas de PowerShell que se abrieron." -ForegroundColor Red
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
