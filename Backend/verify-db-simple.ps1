# Script para verificar la conexion a la base de datos
Write-Host "================================================================"
Write-Host "     Verificacion de Conexion a ShopCart Database"
Write-Host "================================================================"
Write-Host ""

$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

Write-Host "Verificando tablas en la base de datos..."
Write-Host "Usuario: shopcart_user"
Write-Host "Base de datos: shopcart_db" 
Write-Host "Password: shopcart_password"
Write-Host ""

# Listar todas las tablas
Write-Host "Listando tablas creadas:"
& $psqlPath -U shopcart_user -d shopcart_db -h localhost -c "\dt"

Write-Host ""
Write-Host "Contando registros en tablas principales:"

# Verificar datos de ejemplo
Write-Host "Categorias:"
& $psqlPath -U shopcart_user -d shopcart_db -h localhost -c "SELECT COUNT(*) as total_categorias FROM categories;"

Write-Host "Productos:"
& $psqlPath -U shopcart_user -d shopcart_db -h localhost -c "SELECT COUNT(*) as total_productos FROM products;"

Write-Host "Usuarios:"
& $psqlPath -U shopcart_user -d shopcart_db -h localhost -c "SELECT COUNT(*) as total_usuarios FROM users;"

Write-Host ""
Write-Host "Base de datos lista para usar con los microservicios!"
