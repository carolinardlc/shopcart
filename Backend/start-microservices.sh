#!/bin/bash

# Script para iniciar todos los microservicios de ShopCart
echo "🚀 Iniciando arquitectura de microservicios ShopCart..."

# Instalar dependencias si es necesario
echo "📦 Verificando dependencias..."

# API Gateway
echo "🔧 Instalando dependencias del API Gateway..."
cd microservices/api-gateway
npm install
cd ../..

# User Service
echo "👥 Instalando dependencias del User Service..."
cd microservices/user-service
npm install
cd ../..

# Product Service
echo "🛍️ Instalando dependencias del Product Service..."
cd microservices/product-service
npm install
cd ../..

# Cart Service
echo "🛒 Instalando dependencias del Cart Service..."
cd microservices/cart-service
npm install
cd ../..

# Payment Service
echo "💳 Instalando dependencias del Payment Service..."
cd microservices/payment-service
npm install
cd ../..

# Category Service
echo "📂 Instalando dependencias del Category Service..."
cd microservices/category-service
npm install
cd ../..

echo "✅ Todas las dependencias instaladas correctamente!"

# Iniciar servicios en segundo plano
echo "🚀 Iniciando microservicios..."

# Iniciar Category Service primero (otros servicios dependen de él)
echo "📂 Iniciando Category Service en puerto 5005..."
cd microservices/category-service
npm start &
CATEGORY_PID=$!
cd ../..

sleep 2

# Iniciar Product Service
echo "🛍️ Iniciando Product Service en puerto 5002..."
cd microservices/product-service
npm start &
PRODUCT_PID=$!
cd ../..

sleep 2

# Iniciar User Service
echo "👥 Iniciando User Service en puerto 5001..."
cd microservices/user-service
npm start &
USER_PID=$!
cd ../..

sleep 2

# Iniciar Cart Service
echo "🛒 Iniciando Cart Service en puerto 5003..."
cd microservices/cart-service
npm start &
CART_PID=$!
cd ../..

sleep 2

# Iniciar Payment Service
echo "💳 Iniciando Payment Service en puerto 5004..."
cd microservices/payment-service
npm start &
PAYMENT_PID=$!
cd ../..

sleep 3

# Iniciar API Gateway al final
echo "🌐 Iniciando API Gateway en puerto 5000..."
cd microservices/api-gateway
npm start &
GATEWAY_PID=$!
cd ../..

echo ""
echo "🎉 ¡Todos los microservicios iniciados correctamente!"
echo ""
echo "📊 Estado de los servicios:"
echo "   🌐 API Gateway:      http://localhost:5000"
echo "   👥 User Service:     http://localhost:5001"
echo "   🛍️ Product Service:  http://localhost:5002"
echo "   🛒 Cart Service:     http://localhost:5003"
echo "   💳 Payment Service:  http://localhost:5004"
echo "   📂 Category Service: http://localhost:5005"
echo ""
echo "📚 Endpoints principales:"
echo "   - API Info:     http://localhost:5000/api/info"
echo "   - Health Check: http://localhost:5000/api/health"
echo "   - Products:     http://localhost:5000/api/products"
echo "   - Categories:   http://localhost:5000/api/categories"
echo "   - Users:        http://localhost:5000/api/users"
echo "   - Cart:         http://localhost:5000/api/cart"
echo "   - Payments:     http://localhost:5000/api/payments"
echo ""
echo "⚠️ Para detener todos los servicios, presiona Ctrl+C"

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo microservicios..."
    kill $GATEWAY_PID $USER_PID $PRODUCT_PID $CART_PID $PAYMENT_PID $CATEGORY_PID 2>/dev/null
    echo "✅ Todos los microservicios detenidos"
    exit 0
}

# Capturar señal de interrupción
trap cleanup SIGINT SIGTERM

# Esperar indefinidamente
wait
