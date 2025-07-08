@echo off
echo === SHOPCART - CONFIGURACION RAPIDA DE DATABASE ===
echo.

cd /d "%~dp0"

echo 🚀 Iniciando PostgreSQL con Docker...
echo.

REM Verificar si Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Docker no está instalado
    echo Por favor instala Docker Desktop desde https://www.docker.com/products/docker-desktop/
    echo.
    echo 💡 Alternativa: Instalar PostgreSQL localmente
    echo    https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo ✅ Docker está disponible
echo.

REM Detener contenedor existente si existe
docker stop shopcart-postgres 2>nul
docker rm shopcart-postgres 2>nul

echo 🐳 Creando contenedor PostgreSQL...
docker run -d ^
  --name shopcart-postgres ^
  -p 5432:5432 ^
  -e POSTGRES_DB=shopcart_db ^
  -e POSTGRES_USER=shopcart_user ^
  -e POSTGRES_PASSWORD=shopcart_password ^
  postgres:14

if %errorlevel% neq 0 (
    echo ❌ Error creando contenedor Docker
    pause
    exit /b 1
)

echo ✅ Contenedor PostgreSQL creado exitosamente
echo.

echo ⏳ Esperando que PostgreSQL esté listo...
timeout /t 10 /nobreak >nul

echo 🔧 Configurando base de datos...
echo.

REM Instalar dependencias si es necesario
if not exist node_modules (
    echo 📦 Instalando dependencias Node.js...
    npm install
    echo.
)

echo 🏗️  Ejecutando script de configuración...
node scripts/db-admin.js

echo.
echo ✅ CONFIGURACIÓN COMPLETADA
echo.
echo 📊 Información de conexión:
echo    Host: localhost
echo    Port: 5432
echo    Database: shopcart_db
echo    User: shopcart_user
echo    Password: shopcart_password
echo.
echo 🎯 Próximos pasos:
echo    1. Ejecutar: npm run test-db
echo    2. Iniciar microservicios: npm run start-microservices
echo    3. Acceder a pgAdmin o cualquier cliente PostgreSQL
echo.
echo 🛑 Para detener la base de datos: docker stop shopcart-postgres
echo 🗑️  Para eliminar el contenedor: docker rm shopcart-postgres
echo.
pause
