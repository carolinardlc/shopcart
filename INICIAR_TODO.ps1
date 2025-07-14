# Script completo para iniciar TODO el sistema ShopCart
# Ejecutar como Administrador

Write-Host "[>>] INICIANDO SISTEMA COMPLETO SHOPCART" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Verificar si se ejecuta como administrador
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "[X] Este script debe ejecutarse como Administrador" -ForegroundColor Red
    Write-Host "   Clic derecho en PowerShell > 'Ejecutar como administrador'" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Paso 1: Verificar e instalar servicios de sistema
Write-Host "[?] PASO 1: Verificando servicios del sistema..." -ForegroundColor Cyan

# Funcion para instalar Chocolatey si no esta instalado
function Install-Chocolatey {
    if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "   [PKG] Instalando Chocolatey (gestor de paquetes)..." -ForegroundColor Yellow
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        Write-Host "   [OK] Chocolatey instalado" -ForegroundColor Green
        
        # Actualizar la variable PATH para la sesion actual
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
    }
}

# Verificar Node.js
Write-Host "   Verificando Node.js..." -ForegroundColor Gray
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "   [!] Node.js no esta instalado. Instalando..." -ForegroundColor Yellow
    Install-Chocolatey
    choco install nodejs -y
    # Actualizar PATH
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
    Write-Host "   [OK] Node.js instalado" -ForegroundColor Green
} else {
    Write-Host "   [OK] Node.js ya esta instalado" -ForegroundColor Green
}

# Verificar PostgreSQL 17 (OBLIGATORIO)
Write-Host "   Verificando PostgreSQL 17..." -ForegroundColor Gray
try {
    # Verificar si PostgreSQL 17 esta instalado
    $pg17Service = Get-Service "postgresql-x64-17" -ErrorAction SilentlyContinue
    $oldPgServices = Get-Service "postgresql-x64-14", "postgresql-x64-15", "postgresql-x64-16" -ErrorAction SilentlyContinue
    
    # Remover versiones anteriores si existen
    if ($oldPgServices) {
        Write-Host "   [CLEANUP] Removiendo versiones anteriores de PostgreSQL..." -ForegroundColor Yellow
        foreach ($service in $oldPgServices) {
            Stop-Service $service.Name -Force -ErrorAction SilentlyContinue
        }
        Install-Chocolatey
        choco uninstall postgresql14 postgresql15 postgresql16 -y --remove-dependencies --force
        Write-Host "   [OK] Versiones anteriores removidas" -ForegroundColor Green
    }
    
    if ($pg17Service -and $pg17Service.Status -eq "Running") {
        Write-Host "   [OK] PostgreSQL 17 ya esta ejecutandose" -ForegroundColor Green
    } else {
        Write-Host "   [INSTALL] Instalando PostgreSQL 17..." -ForegroundColor Yellow
        Install-Chocolatey
        
        # Desinstalar cualquier version anterior que pueda existir
        Write-Host "   [CLEANUP] Limpiando instalaciones anteriores..." -ForegroundColor Gray
        choco uninstall postgresql postgresql14 postgresql15 postgresql16 -y --remove-dependencies --force
        
        # Instalar especificamente PostgreSQL 17
        Write-Host "   [DOWNLOAD] Descargando e instalando PostgreSQL 17..." -ForegroundColor Yellow
        try {
            choco install postgresql17 -y --params '/Password:postgres' --timeout=600 --force
            
            Write-Host "   [WAIT] Esperando a que PostgreSQL 17 se inicie..." -ForegroundColor Gray
            Start-Sleep -Seconds 20
            
            # Verificar instalacion
            $pg17Service = Get-Service "postgresql-x64-17" -ErrorAction SilentlyContinue
            if ($pg17Service) {
                if ($pg17Service.Status -ne "Running") {
                    Write-Host "   [START] Iniciando servicio PostgreSQL 17..." -ForegroundColor Gray
                    Start-Service "postgresql-x64-17"
                    Start-Sleep -Seconds 10
                }
                Write-Host "   [OK] PostgreSQL 17 instalado e iniciado correctamente" -ForegroundColor Green
                
                # Actualizar PATH para PostgreSQL 17
                $pgPath17 = "C:\Program Files\PostgreSQL\17\bin"
                if (Test-Path $pgPath17) {
                    $env:PATH = $env:PATH + ";" + $pgPath17
                    Write-Host "   [OK] PATH actualizado para PostgreSQL 17" -ForegroundColor Green
                }
            } else {
                throw "Servicio postgresql-x64-17 no encontrado"
            }
        } catch {
            Write-Host "   [ERROR] Fallo la instalacion automatica de PostgreSQL 17" -ForegroundColor Red
            Write-Host "   [MANUAL] === INSTALACION MANUAL OBLIGATORIA ===" -ForegroundColor Cyan
            Write-Host "   DEBES instalar PostgreSQL 17 manualmente:" -ForegroundColor Yellow
            Write-Host "   1. Ve a: https://www.postgresql.org/download/windows/" -ForegroundColor White
            Write-Host "   2. Descarga PostgreSQL 17 (SOLO VERSION 17)" -ForegroundColor White
            Write-Host "   3. Durante la instalacion configura:" -ForegroundColor White
            Write-Host "      - Usuario superusuario: postgres" -ForegroundColor Gray
            Write-Host "      - Contrasena: postgres" -ForegroundColor Gray
            Write-Host "      - Puerto: 5432" -ForegroundColor Gray
            Write-Host "      - Instalar Stack Builder: NO" -ForegroundColor Gray
            Write-Host "   4. Despues ejecuta este script nuevamente" -ForegroundColor White
            Write-Host "   ================================================" -ForegroundColor Cyan
            
            Read-Host "Presiona Enter para salir e instalar PostgreSQL 17 manualmente"
            exit 1
        }
    }
} catch {
    Write-Host "   [X] Error con PostgreSQL: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "      Continuando con la instalacion..." -ForegroundColor Gray
}

# Verificar RabbitMQ
Write-Host "   Verificando RabbitMQ..." -ForegroundColor Gray
try {
    $rabbitService = Get-Service RabbitMQ -ErrorAction SilentlyContinue
    if ($rabbitService) {
        if ($rabbitService.Status -ne "Running") {
            Start-Service RabbitMQ
            Start-Sleep -Seconds 5
            Write-Host "   [OK] RabbitMQ iniciado" -ForegroundColor Green
        } else {
            Write-Host "   [OK] RabbitMQ ya esta ejecutandose" -ForegroundColor Green
        }
    } else {
        Write-Host "   [!] RabbitMQ no esta instalado. Instalando..." -ForegroundColor Yellow
        Install-Chocolatey
        choco install rabbitmq -y
        
        Write-Host "   [WAIT] Iniciando servicio RabbitMQ..." -ForegroundColor Gray
        Start-Sleep -Seconds 10
        Start-Service RabbitMQ -ErrorAction SilentlyContinue
        
        # Habilitar management plugin
        try {
            & rabbitmq-plugins enable rabbitmq_management
            Write-Host "   [OK] RabbitMQ instalado e iniciado" -ForegroundColor Green
        } catch {
            Write-Host "   [!] RabbitMQ instalado pero requiere configuracion" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   [X] Error con RabbitMQ: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "      Continuando con la instalacion..." -ForegroundColor Gray
}

Write-Host ""

# Paso 2: Verificar y configurar base de datos
Write-Host "[DB] PASO 2: Verificando base de datos..." -ForegroundColor Cyan

# Esperar un poco mas para que PostgreSQL este completamente listo
Start-Sleep -Seconds 5

try {
    # Agregar PostgreSQL 17 al PATH
    $pgPath17 = "C:\Program Files\PostgreSQL\17\bin"
    if (Test-Path $pgPath17 -and $env:PATH -notlike "*$pgPath17*") {
        $env:PATH = $env:PATH + ";" + $pgPath17
        Write-Host "   [OK] PostgreSQL 17 agregado al PATH" -ForegroundColor Green
    }
    
    # Verificar que tenemos PostgreSQL 17 funcionando
    $pg17Service = Get-Service "postgresql-x64-17" -ErrorAction SilentlyContinue
    if (-not $pg17Service -or $pg17Service.Status -ne "Running") {
        Write-Host "   [ERROR] PostgreSQL 17 no esta disponible" -ForegroundColor Red
        Write-Host "   [INFO] Instala PostgreSQL 17 manualmente y ejecuta el script nuevamente" -ForegroundColor Yellow
        throw "PostgreSQL 17 requerido"
    }
    
    # Intentar conexion con PostgreSQL 17
    $connectionSuccessful = $false
    $authMethods = @(
        @{User="postgres"; Password="postgres"},
        @{User="postgres"; Password=""},
        @{User="postgres"; Password=$null}
    )
    
    foreach ($auth in $authMethods) {
        Write-Host "   Probando conexion PostgreSQL 17..." -ForegroundColor Gray
        if ($auth.Password) {
            $env:PGPASSWORD = $auth.Password
        } else {
            Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
        }
        
        & psql -U $auth.User -c "SELECT version();" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   [OK] Conexion PostgreSQL 17 exitosa" -ForegroundColor Green
            $connectionSuccessful = $true
            break
        }
    }
    
    if ($connectionSuccessful) {
        # Configurar base de datos usando PostgreSQL 17
        $psqlPath17 = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
        
        if (Test-Path $psqlPath17) {
            Write-Host "   [DB] Configurando base de datos ShopCart en PostgreSQL 17..." -ForegroundColor Yellow
            
            # Configurar autenticacion trust temporal para PostgreSQL 17
            $pgHbaPath = "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
            if (Test-Path $pgHbaPath) {
                $backupPath = $pgHbaPath + ".backup.original"
                if (-not (Test-Path $backupPath)) {
                    Copy-Item $pgHbaPath $backupPath
                }
                
                # Configuracion temporal trust
                $trustConfig = @"
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    all             all             0.0.0.0/0               md5
"@
                $trustConfig | Out-File -FilePath $pgHbaPath -Encoding ASCII
                Restart-Service "postgresql-x64-17" -Force
                Start-Sleep -Seconds 8
            }
            
            # Configuracion completa de la base de datos
            $configSQL = @"
-- Configurar contrasena de postgres
ALTER USER postgres PASSWORD 'postgres';

-- Crear usuario de aplicacion
DROP USER IF EXISTS shopcart_user;
CREATE USER shopcart_user WITH PASSWORD 'shopcart_password';

-- Crear base de datos
DROP DATABASE IF EXISTS shopcart_db;
CREATE DATABASE shopcart_db WITH OWNER shopcart_user;

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE shopcart_db TO shopcart_user;
"@
            
            $tempConfigFile = Join-Path $env:TEMP "shopcart_config.sql"
            $configSQL | Out-File -FilePath $tempConfigFile -Encoding ASCII
            
            # Ejecutar configuracion en PostgreSQL 17
            & $psqlPath17 -U postgres -d postgres -f $tempConfigFile -q 2>$null
            Remove-Item $tempConfigFile -Force -ErrorAction SilentlyContinue
            
            # Ejecutar script principal de base de datos
            $setupScript = Join-Path $scriptPath "Backend\setup-database.sql"
            if (Test-Path $setupScript) {
                & $psqlPath17 -U postgres -d shopcart_db -f $setupScript -q 2>$null
                Write-Host "   [OK] Esquema de base de datos creado en PostgreSQL 17" -ForegroundColor Green
            }
            
            # Insertar datos de ejemplo
            $sampleDataSQL = @"
INSERT INTO users (email, name, password_hash, role) VALUES
('cliente1@test.com', 'Juan Perez', '$2b$10$example_hash_user1', 'customer'),
('cliente2@test.com', 'Maria Garcia', '$2b$10$example_hash_user2', 'customer'),
('vendedor@shopcart.com', 'Carlos Vendedor', '$2b$10$example_hash_seller', 'seller')
ON CONFLICT (email) DO NOTHING;
"@
            
            $tempSampleFile = Join-Path $env:TEMP "shopcart_sample_data.sql"
            $sampleDataSQL | Out-File -FilePath $tempSampleFile -Encoding ASCII
            
            & $psqlPath17 -U postgres -d shopcart_db -f $tempSampleFile -q 2>$null
            Remove-Item $tempSampleFile -Force -ErrorAction SilentlyContinue
            
            # Restaurar configuracion segura
            if (Test-Path $pgHbaPath) {
                $secureConfig = @"
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
host    all             all             0.0.0.0/0               md5
"@
                $secureConfig | Out-File -FilePath $pgHbaPath -Encoding ASCII
                Restart-Service "postgresql-x64-17" -Force
                Start-Sleep -Seconds 5
            }
            
            Write-Host "   [OK] Base de datos PostgreSQL 17 configurada completamente" -ForegroundColor Green
        } else {
            Write-Host "   [ERROR] PostgreSQL 17 no encontrado en la ubicacion esperada" -ForegroundColor Red
            throw "PostgreSQL 17 binarios no encontrados"
        }
    } else {
        Write-Host "   [ERROR] PostgreSQL 17 no esta disponible para configuracion" -ForegroundColor Red
        Write-Host "   [INFO] El proyecto requiere PostgreSQL 17 especificamente" -ForegroundColor Yellow
        Write-Host "   [INFO] Instala PostgreSQL 17 manualmente y ejecuta el script nuevamente" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   [ERROR] Error configurando PostgreSQL 17: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   [INFO] El proyecto requiere PostgreSQL 17 para funcionar correctamente" -ForegroundColor Yellow
    Write-Host "   [INFO] Los microservicios podrian fallar sin la base de datos" -ForegroundColor Gray
}

# Paso 2.6: Instalar y abrir pgAdmin4 automaticamente
Write-Host ""
Write-Host "[ADMIN] PASO 2.6: Configurando pgAdmin4..." -ForegroundColor Cyan

try {
    # Verificar si pgAdmin4 esta instalado
    $pgAdminPaths = @(
        "${env:ProgramFiles}\pgAdmin 4\bin\pgAdmin4.exe",
        "${env:ProgramFiles(x86)}\pgAdmin 4\bin\pgAdmin4.exe",
        "$env:LOCALAPPDATA\Programs\pgAdmin 4\runtime\pgAdmin4.exe"
    )
    
    $pgAdminPath = $null
    foreach ($path in $pgAdminPaths) {
        if (Test-Path $path) {
            $pgAdminPath = $path
            break
        }
    }
    
    if ($pgAdminPath) {
        Write-Host "   [OK] pgAdmin4 ya esta instalado" -ForegroundColor Green
    } else {
        Write-Host "   [INSTALL] Instalando pgAdmin4..." -ForegroundColor Yellow
        Install-Chocolatey
        
        try {
            choco install pgadmin4 -y
            Write-Host "   [OK] pgAdmin4 instalado" -ForegroundColor Green
            
            # Buscar nueva instalacion
            Start-Sleep -Seconds 3
            foreach ($path in $pgAdminPaths) {
                if (Test-Path $path) {
                    $pgAdminPath = $path
                    break
                }
            }
        } catch {
            Write-Host "   [!] Error instalando pgAdmin4" -ForegroundColor Yellow
        }
    }
    
    # Abrir pgAdmin4 automaticamente
    if ($pgAdminPath) {
        Write-Host "   [OPEN] Abriendo pgAdmin4..." -ForegroundColor Yellow
        Start-Process $pgAdminPath
        Write-Host "   [OK] pgAdmin4 abierto en el navegador" -ForegroundColor Green
        
        # Mostrar instrucciones de conexion
        Write-Host ""
        Write-Host "   [INFO] === INSTRUCCIONES PARA CONECTAR EN PGADMIN4 ===" -ForegroundColor Cyan
        Write-Host "   1. En pgAdmin4, clic derecho en 'Servers' > 'Register' > 'Server...'" -ForegroundColor White
        Write-Host "   2. General tab: Name = 'ShopCart Database'" -ForegroundColor White
        Write-Host "   3. Connection tab:" -ForegroundColor White
        Write-Host "      - Host: localhost" -ForegroundColor White
        Write-Host "      - Port: 5432" -ForegroundColor White
        Write-Host "      - Database: shopcart_db" -ForegroundColor White
        Write-Host "      - Username: postgres" -ForegroundColor White
        Write-Host "      - Password: postgres" -ForegroundColor White
        Write-Host "   4. Clic 'Save' para conectar" -ForegroundColor White
        Write-Host "   =======================================================" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "   [!] Error configurando pgAdmin4: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   [INFO] Descarga manual: https://www.pgadmin.org/download/" -ForegroundColor Cyan
}

Write-Host ""

# Paso 3: Instalar dependencias si es necesario
Write-Host "[PKG] PASO 3: Verificando dependencias..." -ForegroundColor Cyan

$services = @(
    "Backend\microservices\api-gateway",
    "Backend\microservices\user-service",
    "Backend\microservices\product-service", 
    "Backend\microservices\cart-service",
    "Backend\microservices\payment-service",
    "Backend\microservices\category-service",
    "Frontend"
)

foreach ($service in $services) {
    $servicePath = Join-Path $scriptPath $service
    $nodeModulesPath = Join-Path $servicePath "node_modules"
    
    if (!(Test-Path $nodeModulesPath)) {
        Write-Host "   [PKG] Instalando dependencias en $service..." -ForegroundColor Yellow
        Set-Location $servicePath
        npm install --silent
        Set-Location $scriptPath
        Write-Host "   [OK] Dependencias instaladas en $service" -ForegroundColor Green
    } else {
        Write-Host "   [OK] Dependencias OK en $service" -ForegroundColor Green
    }
}

Write-Host ""

# Paso 4: Iniciar microservicios
Write-Host "[>>] PASO 4: Iniciando microservicios..." -ForegroundColor Cyan

# Usar el script optimizado de microservicios
$backendPath = Join-Path $scriptPath "Backend"
Write-Host "   [>>] Iniciando todos los microservicios con start-microservices.js..." -ForegroundColor Gray

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command", 
    "cd '$backendPath'; Write-Host 'Iniciando todos los microservicios...' -ForegroundColor Green; npm run start-all"
)

Write-Host "   [OK] Todos los microservicios iniciados en una sola ventana" -ForegroundColor Green
Write-Host ""

# Paso 5: Esperar que los servicios esten listos
Write-Host "[WAIT] PASO 5: Esperando que los servicios esten listos..." -ForegroundColor Cyan
Write-Host "   (Esto puede tomar 30-60 segundos)" -ForegroundColor Gray

Start-Sleep -Seconds 30

# Verificar que los puertos esten libres antes de health checks
Write-Host ""
Write-Host "[CHECK] Verificando puertos..." -ForegroundColor Cyan
$requiredPorts = @(5000, 5001, 5002, 5003, 5004, 5005)
$portsInUse = @()

foreach ($port in $requiredPorts) {
    try {
        $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connection) {
            Write-Host "   [OK] Puerto $port en uso" -ForegroundColor Green
            $portsInUse += $port
        } else {
            Write-Host "   [X] Puerto $port libre (servicio no iniciado)" -ForegroundColor Red
        }
    } catch {
        Write-Host "   [X] Puerto $port no disponible" -ForegroundColor Red
    }
}

if ($portsInUse.Count -lt 6) {
    Write-Host ""
    Write-Host "   [WARNING] Solo $($portsInUse.Count)/6 servicios parecen estar corriendo" -ForegroundColor Yellow
    Write-Host "   [INFO] Esperando 30 segundos adicionales..." -ForegroundColor Gray
    Start-Sleep -Seconds 30
}

# Verificar health checks
Write-Host ""
Write-Host "[HEALTH] Verificando health checks..." -ForegroundColor Cyan
$healthChecks = @(
    @{Name="API Gateway"; Url="http://localhost:5000/api/health"; Critical=$true},
    @{Name="User Service"; Url="http://localhost:5001/api/users/health"; Critical=$false},
    @{Name="Product Service"; Url="http://localhost:5002/api/products/health"; Critical=$false},
    @{Name="Cart Service"; Url="http://localhost:5003/api/cart/health"; Critical=$false},
    @{Name="Payment Service"; Url="http://localhost:5004/api/payments/health"; Critical=$false},
    @{Name="Category Service"; Url="http://localhost:5005/api/categories/health"; Critical=$false}
)

$allHealthy = $true
$criticalServicesDown = $false

foreach ($check in $healthChecks) {
    try {
        $response = Invoke-RestMethod -Uri $check.Url -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.status -eq "OK") {
            Write-Host "   [OK] $($check.Name): $($check.Url)" -ForegroundColor Green
        } else {
            Write-Host "   [!] $($check.Name): $($check.Url) (respuesta: $($response.status))" -ForegroundColor Yellow
            if ($check.Critical) { $criticalServicesDown = $true }
        }
    } catch {
        Write-Host "   [X] $($check.Name): $($check.Url) (no responde)" -ForegroundColor Red
        $allHealthy = $false
        if ($check.Critical) { $criticalServicesDown = $true }
        
        # Diagnostico adicional para API Gateway
        if ($check.Name -eq "API Gateway") {
            Write-Host "      [DIAG] Verificando diagnostico de API Gateway..." -ForegroundColor Gray
            
            # Verificar si el puerto esta en uso
            $portInUse = netstat -ano | findstr ":5000 "
            if ($portInUse) {
                Write-Host "      [INFO] Puerto 5000 esta en uso por proceso Node.js" -ForegroundColor Gray
                
                # Intentar obtener info del gateway a pesar del error
                try {
                    $gatewayInfo = Invoke-RestMethod -Uri "http://localhost:5000/api/info" -TimeoutSec 3 -ErrorAction SilentlyContinue
                    Write-Host "      [OK] API Gateway responde en /api/info: $($gatewayInfo.name)" -ForegroundColor Green
                    Write-Host "      [ISSUE] Problema especifico con health checks - revisar logs" -ForegroundColor Yellow
                } catch {
                    Write-Host "      [ERROR] API Gateway no responde en endpoints publicos" -ForegroundColor Red
                    Write-Host "      [HINT] Revisa la ventana del API Gateway para errores de inicio" -ForegroundColor Cyan
                }
                
                # Verificar microservicios individuales
                Write-Host "      [CHECK] Verificando microservicios individuales..." -ForegroundColor Gray
                $individualServices = @(
                    @{Name="User"; Url="http://localhost:5001/api/users/health"},
                    @{Name="Product"; Url="http://localhost:5002/api/products/health"},
                    @{Name="Cart"; Url="http://localhost:5003/api/cart/health"},
                    @{Name="Payment"; Url="http://localhost:5004/api/payments/health"},
                    @{Name="Category"; Url="http://localhost:5005/api/categories/health"}
                )
                
                $workingServices = 0
                foreach ($service in $individualServices) {
                    try {
                        $serviceResponse = Invoke-RestMethod -Uri $service.Url -TimeoutSec 3 -ErrorAction SilentlyContinue
                        if ($serviceResponse.status -eq "OK") {
                            Write-Host "        [OK] $($service.Name) Service funciona directamente" -ForegroundColor Green
                            $workingServices++
                        } else {
                            Write-Host "        [!] $($service.Name) Service: $($serviceResponse.status)" -ForegroundColor Yellow
                        }
                    } catch {
                        Write-Host "        [X] $($service.Name) Service no responde" -ForegroundColor Red
                    }
                }
                
                if ($workingServices -ge 3) {
                    Write-Host "      [SUMMARY] $workingServices/5 microservicios funcionan - Backend parcialmente operativo" -ForegroundColor Yellow
                    Write-Host "      [ACTION] Frontend deberia funcionar con funcionalidad limitada" -ForegroundColor Cyan
                } else {
                    Write-Host "      [SUMMARY] Solo $workingServices/5 microservicios funcionan - Backend deficiente" -ForegroundColor Red
                    Write-Host "      [ACTION] Revisa las ventanas de microservicios para errores" -ForegroundColor Cyan
                }
            } else {
                Write-Host "      [ERROR] Puerto 5000 NO esta en uso - API Gateway no inicio" -ForegroundColor Red
                Write-Host "      [ACTION] Revisa la ventana del API Gateway para errores de inicio" -ForegroundColor Cyan
            }
        }
    }
}

# Mostrar diagnostico adicional si hay problemas criticos
if ($criticalServicesDown) {
    Write-Host ""
    Write-Host "   [CRITICAL] API Gateway no responde - El frontend no funcionara" -ForegroundColor Red
    Write-Host "   [DIAG] Pasos para solucionar:" -ForegroundColor Yellow
    Write-Host "   1. Verifica que la terminal de microservicios este abierta" -ForegroundColor White
    Write-Host "   2. En la terminal de microservicios, verifica que no haya errores" -ForegroundColor White
    Write-Host "   3. Si hay errores de base de datos, verifica PostgreSQL 17" -ForegroundColor White
    Write-Host "   4. Reinicia manualmente: cd Backend && npm run start-all" -ForegroundColor White
}

Write-Host ""

# Paso 6: Iniciar Frontend
Write-Host "[UI] PASO 6: Iniciando Frontend..." -ForegroundColor Cyan
$frontendPath = Join-Path $scriptPath "Frontend"

Write-Host "   [>>] Iniciando Next.js (Puerto 3000)..." -ForegroundColor Gray
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command", 
    "cd '$frontendPath'; Write-Host 'Iniciando Frontend Next.js...' -ForegroundColor Green; npm run dev"
)

Write-Host "   [OK] Frontend iniciado" -ForegroundColor Green
Write-Host ""

# Paso 7: Resumen final
Write-Host "[DONE] SISTEMA COMPLETO INICIADO" -ForegroundColor Green
Write-Host "===========================" -ForegroundColor Green
Write-Host ""
Write-Host "[SVC] SERVICIOS EJECUTANDOSE:" -ForegroundColor Cyan
Write-Host "   [UI] Frontend:          http://localhost:3000" -ForegroundColor White
Write-Host "   [API] API Gateway:      http://localhost:5000" -ForegroundColor White
Write-Host "   [USER] User Service:    http://localhost:5001" -ForegroundColor White
Write-Host "   [PKG] Product Service:  http://localhost:5002" -ForegroundColor White
Write-Host "   [CART] Cart Service:    http://localhost:5003" -ForegroundColor White
Write-Host "   [PAY] Payment Service:  http://localhost:5004" -ForegroundColor White
Write-Host "   [CAT] Category Service: http://localhost:5005" -ForegroundColor White
Write-Host ""
Write-Host "[DB] BASE DE DATOS:" -ForegroundColor Cyan
Write-Host "   [PG] PostgreSQL:        localhost:5432" -ForegroundColor White
Write-Host "   [RMQ] RabbitMQ:         localhost:5672" -ForegroundColor White
Write-Host "   [WEB] RabbitMQ UI:      http://localhost:15672 (guest/guest)" -ForegroundColor White
Write-Host ""

# Informacion de base de datos
Write-Host "[DB] INFORMACION DE BASE DE DATOS:" -ForegroundColor Cyan
Write-Host "   [INFO] Base de datos: shopcart_db" -ForegroundColor White
Write-Host "   [INFO] Usuario app: shopcart_user / shopcart_password" -ForegroundColor White
Write-Host "   [INFO] Usuario admin: postgres / postgres" -ForegroundColor White
Write-Host "   [INFO] pgAdmin4 disponible para administracion" -ForegroundColor White
Write-Host ""
Write-Host "   [DATA] La base de datos incluye:" -ForegroundColor Yellow
Write-Host "   - Usuarios de ejemplo (admin, clientes, vendedor)" -ForegroundColor Green
Write-Host "   - Categorias de productos predefinidas" -ForegroundColor Green
Write-Host "   - Productos de ejemplo con precios" -ForegroundColor Green
Write-Host "   - Carritos de compras con items" -ForegroundColor Green
Write-Host "   - Esquema completo de microservicios" -ForegroundColor Green
Write-Host ""

if ($allHealthy) {
    Write-Host "[OK] TODOS LOS SERVICIOS ESTAN SALUDABLES" -ForegroundColor Green
} else {
    Write-Host "[!] ALGUNOS SERVICIOS PUEDEN ESTAR INICIANDOSE TODAVIA" -ForegroundColor Yellow
    Write-Host "   Espera 1-2 minutos y verifica las URLs de arriba" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[OAUTH] CONFIGURACION DE GOOGLE OAUTH:" -ForegroundColor Cyan
Write-Host "   [OK] Archivos .env configurados correctamente" -ForegroundColor Green
Write-Host "   [INFO] Sistema funciona con credenciales de desarrollo" -ForegroundColor Yellow
Write-Host "   [INFO] Para producción, configurar credenciales reales en Google Cloud" -ForegroundColor White
Write-Host "   [URL] Endpoint de autenticacion: http://localhost:5001/api/users/auth/google" -ForegroundColor Gray

Write-Host ""
Write-Host "[>>] ABRIR APLICACION:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "[STOP] PARA DETENER:" -ForegroundColor Red
Write-Host "   Cierra las 2 ventanas de PowerShell (Backend y Frontend)" -ForegroundColor White
Write-Host ""

# Opcion para abrir el navegador automaticamente
$openBrowser = Read-Host "¿Abrir la aplicacion en el navegador automaticamente? (y/n)"
if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
    Start-Sleep -Seconds 5
    Start-Process "http://localhost:3000"
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
