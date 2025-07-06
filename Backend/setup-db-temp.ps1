# Script temporal para configurar la base de datos PostgreSQL
# Este script modifica temporalmente la configuración de autenticación

$pgDataPath = "C:\Program Files\PostgreSQL\17\data"
$pgBinPath = "C:\Program Files\PostgreSQL\17\bin"
$configFile = "$pgDataPath\pg_hba.conf"
$backupFile = "$pgDataPath\pg_hba.conf.backup"

Write-Host "Configurando acceso temporal a PostgreSQL..."

# Leer el archivo original
$originalContent = Get-Content $configFile

# Crear nueva configuración temporal (cambiar scram-sha-256 a trust para localhost)
$tempContent = $originalContent -replace "scram-sha-256", "trust"

# Escribir configuración temporal
$tempContent | Set-Content $configFile

Write-Host "Reiniciando servicio PostgreSQL..."
Restart-Service postgresql-x64-17

# Esperar un momento para que el servicio se reinicie
Start-Sleep -Seconds 5

Write-Host "Ejecutando script de base de datos..."
try {
    & "$pgBinPath\psql.exe" -U postgres -d postgres -f "setup-database.sql"
    Write-Host "Script de base de datos ejecutado exitosamente!"
} catch {
    Write-Host "Error al ejecutar el script: $_"
}

Write-Host "Restaurando configuración original..."
$originalContent | Set-Content $configFile

Write-Host "Reiniciando servicio PostgreSQL..."
Restart-Service postgresql-x64-17

Write-Host "Configuración restaurada. Base de datos lista para usar."
