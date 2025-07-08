@echo off
echo === SHOPCART - CONFIGURACION DE BASE DE DATOS ===
echo.

cd /d "%~dp0"

echo 📁 Directorio actual: %CD%
echo.

REM Verificar si Node.js está instalado
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no está instalado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Instalar dependencias si es necesario
if not exist node_modules (
    echo 📦 Instalando dependencias...
    npm install
    echo.
)

echo 🔍 Ejecutando diagnóstico de base de datos...
echo.

node scripts/db-diagnostics.js

echo.
echo 🎯 Diagnóstico completado
echo.
pause
