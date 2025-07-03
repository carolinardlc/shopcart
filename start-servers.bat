@echo off
echo Iniciando el sistema ShopCart...
echo.

echo Iniciando Backend (puerto 5000)...
start cmd /k "cd /d "%~dp0Backend" && npm run dev"

echo.
echo Esperando 3 segundos antes de iniciar el Frontend...
timeout /t 3 /nobreak >nul

echo Iniciando Frontend (puerto 3000)...
start cmd /k "cd /d "%~dp0Frontend" && npm run dev"

echo.
echo Ambos servidores se están iniciando:
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo.
echo Para detener los servidores, cierra las ventanas de comando que se abrieron.
pause
