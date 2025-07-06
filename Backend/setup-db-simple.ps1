# Script para configurar la base de datos PostgreSQL
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     Configuracion de Base de Datos PostgreSQL para ShopCart" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que PostgreSQL este corriendo
$service = Get-Service -Name "postgresql-x64-17" -ErrorAction SilentlyContinue
if ($service -eq $null) {
    Write-Host "Error: Servicio PostgreSQL 17 no encontrado" -ForegroundColor Red
    exit 1
}

if ($service.Status -ne "Running") {
    Write-Host "Iniciando servicio PostgreSQL..." -ForegroundColor Yellow
    Start-Service "postgresql-x64-17"
    Start-Sleep -Seconds 3
}

Write-Host "Servicio PostgreSQL esta corriendo" -ForegroundColor Green
Write-Host ""

$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
$setupScript = "setup-database.sql"

# Verificar que el archivo de script existe
if (-not (Test-Path $setupScript)) {
    Write-Host "Error: Archivo $setupScript no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "Ejecutando script de configuracion de base de datos..." -ForegroundColor Yellow
Write-Host "Se te pedira la contrasena del usuario 'postgres'" -ForegroundColor Yellow
Write-Host ""

try {
    & $psqlPath -U postgres -d postgres -f $setupScript
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Base de datos configurada exitosamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Detalles de conexion:" -ForegroundColor Cyan
        Write-Host "   Host: localhost" -ForegroundColor White
        Write-Host "   Puerto: 5432" -ForegroundColor White
        Write-Host "   Base de datos: shopcart_db" -ForegroundColor White
        Write-Host "   Usuario: shopcart_user" -ForegroundColor White
        Write-Host "   Contrasena: shopcart_password" -ForegroundColor White
    } else {
        Write-Host "Error al ejecutar el script de base de datos" -ForegroundColor Red
    }
} catch {
    Write-Host "Error al ejecutar psql: $_" -ForegroundColor Red
}

Write-Host ""
Read-Host "Presiona Enter para continuar"
