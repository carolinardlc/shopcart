@echo off
title ShopCart Microservices
echo [SHOPCART] Iniciando todos los microservicios...

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Iniciar API Gateway
echo [START] API Gateway (Puerto 5000)...
start "API Gateway" cmd /k "cd microservices\api-gateway && npm start"
timeout /t 2

REM Iniciar User Service  
echo [START] User Service (Puerto 5001)...
start "User Service" cmd /k "cd microservices\user-service && npm start"
timeout /t 2

REM Iniciar Product Service
echo [START] Product Service (Puerto 5002)...
start "Product Service" cmd /k "cd microservices\product-service && npm start"
timeout /t 2

REM Iniciar Cart Service
echo [START] Cart Service (Puerto 5003)...
start "Cart Service" cmd /k "cd microservices\cart-service && npm start"
timeout /t 2

REM Iniciar Payment Service
echo [START] Payment Service (Puerto 5004)...
start "Payment Service" cmd /k "cd microservices\payment-service && npm start"
timeout /t 2

REM Iniciar Category Service
echo [START] Category Service (Puerto 5005)...
start "Category Service" cmd /k "cd microservices\category-service && npm start"
timeout /t 2

echo.
echo [OK] Todos los microservicios iniciados
echo [INFO] Se abrieron 6 ventanas de CMD, una para cada microservicio
echo [INFO] Para detener: cierra cada ventana individualmente
echo.
pause
