@echo off
echo ================================================================
echo     Configuracion de Base de Datos PostgreSQL para ShopCart
echo ================================================================
echo.
echo Este script ejecutara el archivo setup-database.sql
echo Necesitaras ingresar la contrasena del usuario 'postgres'
echo.
echo Ubicacion de PostgreSQL: C:\Program Files\PostgreSQL\17\bin\
echo.
pause

"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d postgres -f setup-database.sql

echo.
echo ================================================================
echo Si el script se ejecuto exitosamente, la base de datos esta lista!
echo.
echo Para verificar la conexion, puedes usar:
echo psql -U shopcart_user -d shopcart_db -h localhost
echo ================================================================
pause
