# Script para verificar la conexión a la base de datos
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     Verificación de Conexión a ShopCart Database" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

Write-Host "🔍 Verificando tablas en la base de datos..." -ForegroundColor Yellow
Write-Host "   Usuario: shopcart_user" -ForegroundColor Gray
Write-Host "   Base de datos: shopcart_db" -ForegroundColor Gray
Write-Host "   Contraseña: shopcart_password" -ForegroundColor Gray
Write-Host ""

# Listar todas las tablas
Write-Host "📋 Listando tablas creadas:" -ForegroundColor Cyan
& $psqlPath -U shopcart_user -d shopcart_db -h localhost -c "\dt"

Write-Host ""
Write-Host "📊 Contando registros en tablas principales:" -ForegroundColor Cyan

# Verificar datos de ejemplo
Write-Host "   • Categorías:" -ForegroundColor Yellow
& $psqlPath -U shopcart_user -d shopcart_db -h localhost -c "SELECT COUNT(*) as total_categorias FROM categories;"

Write-Host "   • Productos:" -ForegroundColor Yellow  
& $psqlPath -U shopcart_user -d shopcart_db -h localhost -c "SELECT COUNT(*) as total_productos FROM products;"

Write-Host "   • Usuarios:" -ForegroundColor Yellow
& $psqlPath -U shopcart_user -d shopcart_db -h localhost -c "SELECT COUNT(*) as total_usuarios FROM users;"

Write-Host ""
Write-Host "✅ ¡Base de datos lista para usar con los microservicios!" -ForegroundColor Green
