# Script de configuración del entorno para ShopCart Microservices
# Ejecutar como Administrador

Write-Host "🚀 Configurando entorno de microservicios ShopCart..." -ForegroundColor Green

# Verificar si Chocolatey está instalado
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Instalando Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# Verificar si PostgreSQL está instalado
if (!(Get-Command psql -ErrorAction SilentlyContinue)) {
    Write-Host "🐘 Instalando PostgreSQL..." -ForegroundColor Yellow
    choco install postgresql14 -y
    
    Write-Host "⏳ Esperando a que PostgreSQL se inicie..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    # Configurar usuario postgres
    Write-Host "🔧 Configurando PostgreSQL..." -ForegroundColor Yellow
    $env:PGPASSWORD = "postgres"
    
    # Ejecutar script de configuración de base de datos
    psql -U postgres -f "$PSScriptRoot\setup-database.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL configurado exitosamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error configurando PostgreSQL" -ForegroundColor Red
    }
} else {
    Write-Host "✅ PostgreSQL ya está instalado" -ForegroundColor Green
}

# Verificar si RabbitMQ está instalado
if (!(Get-Service RabbitMQ -ErrorAction SilentlyContinue)) {
    Write-Host "🐰 Instalando RabbitMQ..." -ForegroundColor Yellow
    choco install rabbitmq -y
    
    Write-Host "⏳ Iniciando servicio RabbitMQ..." -ForegroundColor Yellow
    Start-Service RabbitMQ
    
    # Habilitar management plugin
    rabbitmq-plugins enable rabbitmq_management
    
    Write-Host "✅ RabbitMQ instalado y configurado" -ForegroundColor Green
    Write-Host "📊 Management UI disponible en: http://localhost:15672" -ForegroundColor Cyan
    Write-Host "   Usuario: guest / Password: guest" -ForegroundColor Cyan
} else {
    Write-Host "✅ RabbitMQ ya está instalado" -ForegroundColor Green
    Start-Service RabbitMQ -ErrorAction SilentlyContinue
}

# Verificar si Node.js está instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "📗 Instalando Node.js..." -ForegroundColor Yellow
    choco install nodejs -y
} else {
    Write-Host "✅ Node.js ya está instalado" -ForegroundColor Green
}

# Instalar dependencias de todos los microservicios
Write-Host "📦 Instalando dependencias de microservicios..." -ForegroundColor Yellow

$services = @(
    "api-gateway",
    "user-service", 
    "product-service",
    "cart-service",
    "payment-service",
    "category-service"
)

foreach ($service in $services) {
    $servicePath = "$PSScriptRoot\microservices\$service"
    if (Test-Path $servicePath) {
        Write-Host "   Installing $service dependencies..." -ForegroundColor Gray
        Set-Location $servicePath
        npm install
        Set-Location $PSScriptRoot
    }
}

Write-Host "🎉 Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Servicios configurados:" -ForegroundColor Cyan
Write-Host "   - PostgreSQL: localhost:5432" -ForegroundColor White
Write-Host "   - RabbitMQ: localhost:5672" -ForegroundColor White
Write-Host "   - RabbitMQ Management: http://localhost:15672" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Para iniciar los microservicios:" -ForegroundColor Cyan
Write-Host "   .\start-microservices.ps1" -ForegroundColor White
Write-Host ""
Write-Host "📊 Puertos de servicios:" -ForegroundColor Cyan
Write-Host "   - API Gateway: http://localhost:5000" -ForegroundColor White
Write-Host "   - User Service: http://localhost:5001" -ForegroundColor White
Write-Host "   - Product Service: http://localhost:5002" -ForegroundColor White
Write-Host "   - Cart Service: http://localhost:5003" -ForegroundColor White
Write-Host "   - Payment Service: http://localhost:5004" -ForegroundColor White
Write-Host "   - Category Service: http://localhost:5005" -ForegroundColor White
