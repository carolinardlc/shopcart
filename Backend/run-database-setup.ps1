# Script para configurar la base de datos PostgreSQL
# Este script solicita la contraseña del usuario postgres

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     Configuración de Base de Datos PostgreSQL para ShopCart" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que PostgreSQL esté corriendo
$service = Get-Service -Name "postgresql-x64-17" -ErrorAction SilentlyContinue
if ($service -eq $null) {
    Write-Host "❌ Servicio PostgreSQL 17 no encontrado" -ForegroundColor Red
    exit 1
}

if ($service.Status -ne "Running") {
    Write-Host "⚠️  Iniciando servicio PostgreSQL..." -ForegroundColor Yellow
    Start-Service "postgresql-x64-17"
    Start-Sleep -Seconds 3
}

Write-Host "✅ Servicio PostgreSQL está corriendo" -ForegroundColor Green
Write-Host ""

$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
$setupScript = "setup-database.sql"

# Verificar que el archivo de script existe
if (-not (Test-Path $setupScript)) {
    Write-Host "❌ Archivo $setupScript no encontrado en el directorio actual" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Ejecutando script de configuración de base de datos..." -ForegroundColor Yellow
Write-Host "   Ubicación de psql: $psqlPath" -ForegroundColor Gray
Write-Host "   Script a ejecutar: $setupScript" -ForegroundColor Gray
Write-Host ""
Write-Host "🔐 Se te pedirá la contraseña del usuario 'postgres'" -ForegroundColor Yellow
Write-Host ""

try {
    & $psqlPath -U postgres -d postgres -f $setupScript
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "================================================================" -ForegroundColor Green
        Write-Host "✅ ¡Base de datos configurada exitosamente!" -ForegroundColor Green
        Write-Host "================================================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔧 Detalles de conexión:" -ForegroundColor Cyan
        Write-Host "   • Host: localhost" -ForegroundColor White
        Write-Host "   • Puerto: 5432" -ForegroundColor White
        Write-Host "   • Base de datos: shopcart_db" -ForegroundColor White
        Write-Host "   • Usuario: shopcart_user" -ForegroundColor White
        Write-Host "   • Contraseña: shopcart_password" -ForegroundColor White
        Write-Host ""
        Write-Host "🧪 Para probar la conexión:" -ForegroundColor Cyan
        Write-Host "   psql -U shopcart_user -d shopcart_db -h localhost" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Error al ejecutar el script de base de datos" -ForegroundColor Red
        Write-Host "   Código de salida: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error al ejecutar psql: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
