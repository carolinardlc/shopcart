#!/bin/bash

# ShopCart Frontend - Script de Inicio
echo "=== ShopCart Frontend - Inicialización ==="
echo ""

# Navegar al directorio del frontend
cd "$(dirname "$0")"

echo "📁 Directorio actual: $(pwd)"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js versión: $(node -v)"
echo "✅ npm versión: $(npm -v)"
echo ""

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo ""
fi

# Verificar dependencias críticas
echo "🔍 Verificando dependencias críticas..."
npm list react @types/react next tailwindcss lucide-react --depth=0

echo ""
echo "🚀 Iniciando el servidor de desarrollo..."
echo ""
echo "📱 Páginas disponibles:"
echo "   • Inicio: http://localhost:3000"
echo "   • Login: http://localhost:3000/auth/login"
echo "   • Registro: http://localhost:3000/auth/register"
echo "   • Tienda: http://localhost:3000/shop/new"
echo "   • Estilo de Vida: http://localhost:3000/lifestyle"
echo "   • Escáner Visual: http://localhost:3000/visual-scanner"
echo "   • Navegación por Voz: http://localhost:3000/voice-navigation"
echo "   • Emociones: http://localhost:3000/emotions"
echo "   • StoryCart: http://localhost:3000/storycart"
echo "   • Recompensas: http://localhost:3000/rewards"
echo "   • Perfil: http://localhost:3000/profile"
echo "   • Carrito: http://localhost:3000/cart"
echo "   • Checkout: http://localhost:3000/checkout"
echo "   • Confirmación: http://localhost:3000/order-confirmation"
echo ""
echo "🎯 Presiona Ctrl+C para detener el servidor"
echo ""

# Iniciar el servidor de desarrollo
npm run dev
