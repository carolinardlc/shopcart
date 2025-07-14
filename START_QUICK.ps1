# Inicio rápido del sistema ShopCart
# Solo para desarrollo - asume que ya tienes PostgreSQL y dependencias instaladas

Write-Host "[>>] INICIO RAPIDO SHOPCART" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Verificar que PostgreSQL esté corriendo
Write-Host "[CHECK] Verificando PostgreSQL..." -ForegroundColor Cyan
try {
    $pg17Service = Get-Service "postgresql-x64-17" -ErrorAction SilentlyContinue
    if ($pg17Service -and $pg17Service.Status -eq "Running") {
        Write-Host "   [OK] PostgreSQL 17 corriendo" -ForegroundColor Green
    } else {
        Write-Host "   [!] Iniciando PostgreSQL 17..." -ForegroundColor Yellow
        Start-Service "postgresql-x64-17" -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 5
        Write-Host "   [OK] PostgreSQL 17 iniciado" -ForegroundColor Green
    }
} catch {
    Write-Host "   [X] PostgreSQL 17 no encontrado - usar INICIAR_TODO.ps1 para instalación completa" -ForegroundColor Red
    exit 1
}

# Iniciar Backend (todos los microservicios)
Write-Host ""
Write-Host "[BACKEND] Iniciando microservicios..." -ForegroundColor Cyan
$backendPath = Join-Path $scriptPath "Backend"

Write-Host "   [>>] Iniciando todos los microservicios..." -ForegroundColor Gray
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command", 
    "cd '$backendPath'; Write-Host 'BACKEND - Todos los microservicios' -ForegroundColor Green; npm run start-all"
)

# Esperar a que los servicios se inicien
Write-Host "   [WAIT] Esperando servicios backend..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# Iniciar Frontend
Write-Host ""
Write-Host "[FRONTEND] Iniciando Next.js..." -ForegroundColor Cyan
$frontendPath = Join-Path $scriptPath "Frontend"

Write-Host "   [>>] Iniciando Next.js..." -ForegroundColor Gray
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command", 
    "cd '$frontendPath'; Write-Host 'FRONTEND - Next.js App' -ForegroundColor Green; npm run dev"
)

Write-Host ""
Write-Host "[DONE] SISTEMA INICIADO" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host ""
Write-Host "[URL] Aplicación: http://localhost:3000" -ForegroundColor White
Write-Host "[API] Backend:    http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "[STOP] Para detener: Cierra las 2 ventanas de PowerShell" -ForegroundColor Red
Write-Host ""

# Abrir navegador automáticamente en 10 segundos
Write-Host "[AUTO] Abriendo navegador en 10 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
