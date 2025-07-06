# Script para acceso rápido a la base de datos PostgreSQL
# Uso: .\db-access.ps1 [comando]

param(
    [string]$Command = "connect"
)

$env:PGPASSWORD = "shopcart_password"
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_NAME = "shopcart_db"
$DB_USER = "shopcart_user"

function Write-Header {
    Write-Host ""
    Write-Host "🗄️  ShopCart Database Access" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
}

function Test-DatabaseConnection {
    Write-Host "🔍 Verificando conexión a la base de datos..." -ForegroundColor Yellow
    
    try {
        $result = psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" -t 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Conexión exitosa" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Error de conexión" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ PostgreSQL no está disponible" -ForegroundColor Red
        return $false
    }
}

function Show-DatabaseInfo {
    Write-Host "📊 Información de la base de datos:" -ForegroundColor Cyan
    Write-Host "   Host: $DB_HOST" -ForegroundColor White
    Write-Host "   Puerto: $DB_PORT" -ForegroundColor White
    Write-Host "   Base de datos: $DB_NAME" -ForegroundColor White
    Write-Host "   Usuario: $DB_USER" -ForegroundColor White
    Write-Host ""
}

function Show-Tables {
    Write-Host "📋 Tablas disponibles:" -ForegroundColor Yellow
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"
}

function Show-TableCounts {
    Write-Host "📊 Conteo de registros por tabla:" -ForegroundColor Yellow
    
    $tables = @("users", "categories", "products", "carts", "cart_items", "orders", "order_items", "payments")
    
    foreach ($table in $tables) {
        $count = psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM $table;" -t --quiet 2>$null
        if ($LASTEXITCODE -eq 0) {
            $count = $count.Trim()
            Write-Host "   $table`: $count registros" -ForegroundColor White
        }
    }
    Write-Host ""
}

function Connect-Database {
    Write-Host "🔗 Conectando a la base de datos..." -ForegroundColor Green
    Write-Host "💡 Comandos útiles una vez conectado:" -ForegroundColor Yellow
    Write-Host "   \dt                    - Listar tablas" -ForegroundColor Gray
    Write-Host "   \d table_name          - Describir tabla" -ForegroundColor Gray
    Write-Host "   SELECT * FROM users;   - Ver usuarios" -ForegroundColor Gray
    Write-Host "   \q                     - Salir" -ForegroundColor Gray
    Write-Host ""
    
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME
}

function Show-SampleQueries {
    Write-Host "📝 Consultas de ejemplo:" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "🔍 Ver productos con categorías:" -ForegroundColor Cyan
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
    SELECT 
        p.name as product_name, 
        p.price, 
        p.stock, 
        c.name as category_name 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    LIMIT 5;"
    
    Write-Host ""
    Write-Host "👥 Usuarios registrados:" -ForegroundColor Cyan
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
    SELECT 
        id, 
        name, 
        email, 
        provider, 
        role, 
        created_at 
    FROM users 
    ORDER BY created_at DESC 
    LIMIT 5;"
    
    Write-Host ""
    Write-Host "🛒 Carritos activos:" -ForegroundColor Cyan
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
    SELECT 
        c.id, 
        u.name as user_name, 
        c.status, 
        COUNT(ci.id) as items_count,
        c.created_at
    FROM carts c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN cart_items ci ON c.id = ci.cart_id
    GROUP BY c.id, u.name, c.status, c.created_at
    ORDER BY c.created_at DESC
    LIMIT 5;"
}

function Reset-Database {
    Write-Host "⚠️  ADVERTENCIA: Esto eliminará todos los datos!" -ForegroundColor Red
    $confirm = Read-Host "¿Estás seguro? (escribir 'RESET' para confirmar)"
    
    if ($confirm -eq "RESET") {
        Write-Host "🔄 Reinicializando base de datos..." -ForegroundColor Yellow
        
        # Ejecutar script de configuración
        psql -U postgres -f "setup-database.sql"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Base de datos reinicializada correctamente" -ForegroundColor Green
        } else {
            Write-Host "❌ Error reinicializando base de datos" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Operación cancelada" -ForegroundColor Yellow
    }
}

function Show-Help {
    Write-Host "📚 Comandos disponibles:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   .\db-access.ps1                 - Conectar a la base de datos" -ForegroundColor White
    Write-Host "   .\db-access.ps1 info            - Mostrar información de la DB" -ForegroundColor White
    Write-Host "   .\db-access.ps1 tables          - Listar tablas" -ForegroundColor White
    Write-Host "   .\db-access.ps1 count           - Contar registros por tabla" -ForegroundColor White
    Write-Host "   .\db-access.ps1 samples         - Mostrar datos de ejemplo" -ForegroundColor White
    Write-Host "   .\db-access.ps1 reset           - Reinicializar base de datos" -ForegroundColor White
    Write-Host "   .\db-access.ps1 help            - Mostrar esta ayuda" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Herramientas gráficas recomendadas:" -ForegroundColor Yellow
    Write-Host "   - pgAdmin: choco install pgadmin4" -ForegroundColor Gray
    Write-Host "   - DBeaver: choco install dbeaver" -ForegroundColor Gray
    Write-Host ""
}

# Script principal
Write-Header

switch ($Command.ToLower()) {
    "info" {
        Show-DatabaseInfo
        if (Test-DatabaseConnection) {
            Show-TableCounts
        }
    }
    "tables" {
        if (Test-DatabaseConnection) {
            Show-Tables
        }
    }
    "count" {
        if (Test-DatabaseConnection) {
            Show-TableCounts
        }
    }
    "samples" {
        if (Test-DatabaseConnection) {
            Show-SampleQueries
        }
    }
    "reset" {
        Reset-Database
    }
    "help" {
        Show-Help
    }
    "connect" {
        Show-DatabaseInfo
        if (Test-DatabaseConnection) {
            Connect-Database
        } else {
            Write-Host ""
            Write-Host "💡 Soluciones posibles:" -ForegroundColor Yellow
            Write-Host "   1. Verificar que PostgreSQL esté ejecutándose" -ForegroundColor Gray
            Write-Host "   2. Ejecutar: .\setup-environment.ps1" -ForegroundColor Gray
            Write-Host "   3. Verificar credenciales en .env" -ForegroundColor Gray
        }
    }
    default {
        Show-Help
    }
}
