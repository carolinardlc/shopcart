# ShopCart Microservices Launcher
# Script de PowerShell para iniciar todos los microservicios

param(
    [switch]$Dev,           # Usar nodemon para desarrollo
    [switch]$Background,    # Ejecutar en background
    [switch]$Health,        # Solo verificar health de servicios
    [switch]$Stop           # Detener todos los servicios
)

# Colores para output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Cyan = "Cyan"
$White = "White"

# Configuración de servicios
$services = @(
    @{ Name = "API Gateway"; Path = "microservices\api-gateway"; Port = 5000; Url = "http://localhost:5000/api/health" },
    @{ Name = "User Service"; Path = "microservices\user-service"; Port = 5001; Url = "http://localhost:5001/api/users/health" },
    @{ Name = "Product Service"; Path = "microservices\product-service"; Port = 5002; Url = "http://localhost:5002/api/products/health" },
    @{ Name = "Cart Service"; Path = "microservices\cart-service"; Port = 5003; Url = "http://localhost:5003/api/cart/health" },
    @{ Name = "Payment Service"; Path = "microservices\payment-service"; Port = 5004; Url = "http://localhost:5004/api/payments/health" },
    @{ Name = "Category Service"; Path = "microservices\category-service"; Port = 5005; Url = "http://localhost:5005/api/categories/health" }
)

function Write-Banner {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor $Cyan
    Write-Host "║                    ShopCart Microservices                   ║" -ForegroundColor $Cyan  
    Write-Host "║                  Arquitectura Distribuida                   ║" -ForegroundColor $Cyan
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor $Cyan
    Write-Host ""
}

function Test-Prerequisites {
    Write-Host "🔍 Verificando prerrequisitos..." -ForegroundColor $Yellow
    
    # Verificar Node.js
    if (!(Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Node.js no encontrado. Instalar desde: https://nodejs.org" -ForegroundColor $Red
        return $false
    }
    
    # Verificar PostgreSQL
    if (!(Get-Command psql -ErrorAction SilentlyContinue)) {
        Write-Host "⚠️  PostgreSQL no encontrado. Ejecutar: .\setup-environment.ps1" -ForegroundColor $Yellow
    }
    
    # Verificar RabbitMQ
    $rabbitService = Get-Service RabbitMQ -ErrorAction SilentlyContinue
    if (!$rabbitService -or $rabbitService.Status -ne "Running") {
        Write-Host "⚠️  RabbitMQ no está ejecutándose. Ejecutar: .\setup-environment.ps1" -ForegroundColor $Yellow
    }
    
    # Verificar archivo .env
    if (!(Test-Path ".env")) {
        Write-Host "❌ Archivo .env no encontrado" -ForegroundColor $Red
        return $false
    }
    
    Write-Host "✅ Prerrequisitos verificados" -ForegroundColor $Green
    return $true
}

function Stop-Services {
    Write-Host "🛑 Deteniendo microservicios..." -ForegroundColor $Yellow
    
    foreach ($service in $services) {
        $processes = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
            $_.MainWindowTitle -like "*$($service.Port)*" -or 
            $_.CommandLine -like "*$($service.Path)*"
        }
        
        foreach ($process in $processes) {
            Write-Host "   Deteniendo $($service.Name) (PID: $($process.Id))" -ForegroundColor $White
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        }
    }
    
    Write-Host "✅ Servicios detenidos" -ForegroundColor $Green
}

function Test-ServiceHealth {
    param($ServiceUrl, $ServiceName)
    
    try {
        $response = Invoke-RestMethod -Uri $ServiceUrl -Method Get -TimeoutSec 5
        if ($response.status -eq "OK") {
            Write-Host "✅ $ServiceName - Healthy" -ForegroundColor $Green
            return $true
        } else {
            Write-Host "⚠️  $ServiceName - Unhealthy" -ForegroundColor $Yellow
            return $false
        }
    } catch {
        Write-Host "❌ $ServiceName - No disponible" -ForegroundColor $Red
        return $false
    }
}

function Test-AllServices {
    Write-Host "🏥 Verificando health de servicios..." -ForegroundColor $Cyan
    Write-Host ""
    
    $healthyCount = 0
    foreach ($service in $services) {
        if (Test-ServiceHealth -ServiceUrl $service.Url -ServiceName $service.Name) {
            $healthyCount++
        }
    }
    
    Write-Host ""
    Write-Host "📊 Health Summary: $healthyCount/$($services.Count) servicios healthy" -ForegroundColor $Cyan
    
    if ($healthyCount -eq $services.Count) {
        Write-Host "🎉 Todos los servicios están funcionando correctamente!" -ForegroundColor $Green
    } else {
        Write-Host "⚠️  Algunos servicios pueden no estar disponibles" -ForegroundColor $Yellow
    }
}

function Start-Services {
    Write-Host "🚀 Iniciando microservicios..." -ForegroundColor $Cyan
    Write-Host ""
    
    $startedServices = @()
    
    foreach ($service in $services) {
        $servicePath = $service.Path
        
        if (Test-Path $servicePath) {
            Write-Host "▶️  Iniciando $($service.Name) en puerto $($service.Port)..." -ForegroundColor $Yellow
            
            Push-Location $servicePath
            
            try {
                if ($Dev) {
                    $cmd = "npm run dev"
                } else {
                    $cmd = "npm start"
                }
                
                if ($Background) {
                    Start-Process -FilePath "powershell" -ArgumentList "-Command", $cmd -WindowStyle Minimized
                } else {
                    Start-Process -FilePath "powershell" -ArgumentList "-Command", $cmd, "-NoExit"
                }
                
                $startedServices += $service.Name
                Write-Host "✅ $($service.Name) iniciado" -ForegroundColor $Green
                
                # Esperar un poco antes del siguiente servicio
                Start-Sleep -Seconds 2
                
            } catch {
                Write-Host "❌ Error iniciando $($service.Name): $($_.Exception.Message)" -ForegroundColor $Red
            }
            
            Pop-Location
        } else {
            Write-Host "❌ Directorio no encontrado: $servicePath" -ForegroundColor $Red
        }
    }
    
    Write-Host ""
    Write-Host "🎯 Servicios iniciados: $($startedServices.Count)/$($services.Count)" -ForegroundColor $Cyan
    
    if ($startedServices.Count -gt 0) {
        Write-Host ""
        Write-Host "📱 URLs de servicios:" -ForegroundColor $Cyan
        foreach ($service in $services) {
            if ($service.Name -in $startedServices) {
                Write-Host "   - $($service.Name): http://localhost:$($service.Port)" -ForegroundColor $White
            }
        }
        
        Write-Host ""
        Write-Host "🔍 Para verificar health:" -ForegroundColor $Cyan
        Write-Host "   .\start-microservices.ps1 -Health" -ForegroundColor $White
        
        Write-Host ""
        Write-Host "🛑 Para detener servicios:" -ForegroundColor $Cyan
        Write-Host "   .\start-microservices.ps1 -Stop" -ForegroundColor $White
    }
}

# Script principal
Write-Banner

if ($Stop) {
    Stop-Services
    exit 0
}

if ($Health) {
    Test-AllServices
    exit 0
}

if (!(Test-Prerequisites)) {
    Write-Host ""
    Write-Host "❌ Prerrequisitos no cumplidos. Por favor, configurar el entorno primero." -ForegroundColor $Red
    Write-Host "   Ejecutar: .\setup-environment.ps1" -ForegroundColor $White
    exit 1
}

Write-Host "🎛️  Modo de ejecución:" -ForegroundColor $Cyan
if ($Dev) {
    Write-Host "   - Desarrollo (nodemon)" -ForegroundColor $White
} else {
    Write-Host "   - Producción (node)" -ForegroundColor $White
}

if ($Background) {
    Write-Host "   - Ejecución en background" -ForegroundColor $White
} else {
    Write-Host "   - Ventanas separadas para cada servicio" -ForegroundColor $White
}

Write-Host ""

Start-Services

# Esperar y verificar health después de iniciar
if ($startedServices.Count -gt 0) {
    Write-Host ""
    Write-Host "⏳ Esperando que los servicios se inicialicen..." -ForegroundColor $Yellow
    Start-Sleep -Seconds 10
    
    Test-AllServices
}

Write-Host ""
Write-Host "🏁 Script completado. Los servicios están ejecutándose en ventanas separadas." -ForegroundColor $Green
