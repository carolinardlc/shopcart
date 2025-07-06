@echo off
REM Script para iniciar todos los microservicios de ShopCart en Windows

echo 🚀 Iniciando arquitectura de microservicios ShopCart...

REM Instalar dependencias
echo 📦 Verificando dependencias...

REM API Gateway
echo 🔧 Instalando dependencias del API Gateway...
cd microservices\api-gateway
call npm install
cd ..\..

REM User Service
echo 👥 Instalando dependencias del User Service...
cd microservices\user-service
call npm install
cd ..\..

REM Product Service
echo 🛍️ Instalando dependencias del Product Service...
cd microservices\product-service
call npm install
cd ..\..

REM Cart Service
echo 🛒 Instalando dependencias del Cart Service...
cd microservices\cart-service
call npm install
cd ..\..

REM Payment Service
echo 💳 Instalando dependencias del Payment Service...
cd microservices\payment-service
call npm install
cd ..\..

REM Category Service
echo 📂 Instalando dependencias del Category Service...
cd microservices\category-service
call npm install
cd ..\..

echo ✅ Todas las dependencias instaladas correctamente!

REM Crear ventanas separadas para cada servicio
echo 🚀 Iniciando microservicios en ventanas separadas...

REM Category Service
start "Category Service (Puerto 5005)" cmd /k "cd microservices\category-service && npm start"
timeout /t 3 /nobreak > nul

REM Product Service
start "Product Service (Puerto 5002)" cmd /k "cd microservices\product-service && npm start"
timeout /t 3 /nobreak > nul

REM User Service
start "User Service (Puerto 5001)" cmd /k "cd microservices\user-service && npm start"
timeout /t 3 /nobreak > nul

REM Cart Service
start "Cart Service (Puerto 5003)" cmd /k "cd microservices\cart-service && npm start"
timeout /t 3 /nobreak > nul

REM Payment Service
start "Payment Service (Puerto 5004)" cmd /k "cd microservices\payment-service && npm start"
timeout /t 3 /nobreak > nul

REM API Gateway
start "API Gateway (Puerto 5000)" cmd /k "cd microservices\api-gateway && npm start"

echo.
echo 🎉 ¡Todos los microservicios iniciados correctamente!
echo.
echo 📊 Estado de los servicios:
echo    🌐 API Gateway:      http://localhost:5000
echo    👥 User Service:     http://localhost:5001
echo    🛍️ Product Service:  http://localhost:5002
echo    🛒 Cart Service:     http://localhost:5003
echo    💳 Payment Service:  http://localhost:5004
echo    📂 Category Service: http://localhost:5005
echo.
echo 📚 Endpoints principales:
echo    - API Info:     http://localhost:5000/api/info
echo    - Health Check: http://localhost:5000/api/health
echo    - Products:     http://localhost:5000/api/products
echo    - Categories:   http://localhost:5000/api/categories
echo    - Users:        http://localhost:5000/api/users
echo    - Cart:         http://localhost:5000/api/cart
echo    - Payments:     http://localhost:5000/api/payments
echo.
echo ⚠️ Cada servicio se ejecuta en una ventana separada
echo ⚠️ Para detener un servicio, cierra su ventana correspondiente
echo.
pause
