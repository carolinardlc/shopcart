# Script simple para acceder a pgAdmin
Write-Host "🔧 ACCESO A TU BASE DE DATOS SHOPCART" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 INFORMACIÓN DE CONEXIÓN:" -ForegroundColor Yellow
Write-Host "   Host: localhost" -ForegroundColor White
Write-Host "   Puerto: 5432" -ForegroundColor White
Write-Host "   Base de datos: shopcart_db" -ForegroundColor White
Write-Host "   Usuario app: shopcart_user" -ForegroundColor White
Write-Host "   Contraseña app: shopcart_password" -ForegroundColor White
Write-Host "   Usuario admin: postgres" -ForegroundColor White
Write-Host "   Contraseña admin: Manuel1604" -ForegroundColor White
Write-Host ""

Write-Host "🚀 Intentando abrir pgAdmin..." -ForegroundColor Yellow
$pgAdminPath = "C:\Program Files\PostgreSQL\17\pgAdmin 4\bin\pgAdmin4.exe"

if (Test-Path $pgAdminPath) {
    Start-Process $pgAdminPath
    Write-Host "✅ pgAdmin abierto exitosamente!" -ForegroundColor Green
} else {
    Write-Host "❌ pgAdmin no encontrado en la ruta esperada" -ForegroundColor Red
    Write-Host "   Busca 'pgAdmin' en el menú inicio de Windows" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📚 PASOS PARA CONECTARTE EN PGADMIN:" -ForegroundColor Cyan
Write-Host "1. Clic derecho en 'Servers' → 'Create' → 'Server'" -ForegroundColor White
Write-Host "2. General → Name: 'ShopCart Local'" -ForegroundColor White  
Write-Host "3. Connection → Host: 'localhost', Port: '5432'" -ForegroundColor White
Write-Host "4. Connection → Username: 'postgres', Password: 'Manuel1604'" -ForegroundColor White
Write-Host "5. Save → Expandir 'Databases' → 'shopcart_db'" -ForegroundColor White
Write-Host ""

Read-Host "Presiona Enter para continuar"
