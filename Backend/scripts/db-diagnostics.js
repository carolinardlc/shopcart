// scripts/db-diagnostics.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuraciones de conexión a probar
const configs = [
  {
    name: 'Configuración Local',
    config: {
      host: 'localhost',
      port: 5432,
      database: 'shopcart_db',
      user: 'shopcart_user',
      password: 'shopcart_password'
    }
  },
  {
    name: 'Configuración por Defecto PostgreSQL',
    config: {
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'postgres'
    }
  },
  {
    name: 'Configuración Docker',
    config: {
      host: 'localhost',
      port: 5432,
      database: 'shopcart_db',
      user: 'shopcart_user',
      password: 'shopcart_password'
    }
  }
];

console.log('🔍 DIAGNÓSTICO DE BASE DE DATOS - SHOPCART');
console.log('=' .repeat(50));

async function testConnection(configName, config) {
  console.log(`\n🧪 Probando: ${configName}`);
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);
  
  const pool = new Pool(config);
  
  try {
    const client = await pool.connect();
    console.log('   ✅ Conexión exitosa!');
    
    // Verificar versión
    const versionResult = await client.query('SELECT version()');
    console.log(`   📦 PostgreSQL: ${versionResult.rows[0].version.split(' ')[1]}`);
    
    // Verificar bases de datos disponibles
    const dbResult = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false');
    console.log(`   🗄️  Bases de datos disponibles: ${dbResult.rows.map(row => row.datname).join(', ')}`);
    
    // Si estamos en shopcart_db, verificar tablas
    if (config.database === 'shopcart_db') {
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      console.log(`   📋 Tablas en shopcart_db: ${tablesResult.rows.map(row => row.table_name).join(', ')}`);
    }
    
    client.release();
    await pool.end();
    return true;
    
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
    await pool.end();
    return false;
  }
}

async function checkPostgreSQLStatus() {
  console.log('\n🔧 VERIFICANDO ESTADO DE POSTGRESQL');
  console.log('-' .repeat(40));
  
  const { exec } = require('child_process');
  
  return new Promise((resolve) => {
    exec('pg_isready -h localhost -p 5432', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ PostgreSQL no está ejecutándose o no está disponible');
        console.log('💡 Sugerencias:');
        console.log('   1. Instalar PostgreSQL: https://www.postgresql.org/download/');
        console.log('   2. Iniciar servicio: net start postgresql-x64-14');
        console.log('   3. O usar Docker: docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres');
        resolve(false);
      } else {
        console.log('✅ PostgreSQL está ejecutándose y disponible');
        resolve(true);
      }
    });
  });
}

async function suggestSolutions() {
  console.log('\n🛠️  SOLUCIONES RECOMENDADAS');
  console.log('-' .repeat(40));
  
  console.log('1. 🐳 OPCIÓN RÁPIDA - Docker:');
  console.log('   docker run -d --name shopcart-postgres -p 5432:5432 \\');
  console.log('     -e POSTGRES_DB=shopcart_db \\');
  console.log('     -e POSTGRES_USER=shopcart_user \\');
  console.log('     -e POSTGRES_PASSWORD=shopcart_password \\');
  console.log('     postgres:14');
  
  console.log('\n2. 💻 INSTALACIÓN LOCAL:');
  console.log('   - Descargar PostgreSQL: https://www.postgresql.org/download/');
  console.log('   - Instalar con usuario "postgres" y contraseña "postgres"');
  console.log('   - Ejecutar: npm run setup-db');
  
  console.log('\n3. 🔄 USAR BASE DE DATOS EXISTENTE:');
  console.log('   - Modificar credenciales en .env');
  console.log('   - Ejecutar: npm run test-db');
  
  console.log('\n4. 🐳 USAR DOCKER-COMPOSE:');
  console.log('   cd Backend');
  console.log('   docker-compose up -d postgres');
}

async function main() {
  // Verificar si PostgreSQL está ejecutándose
  const isRunning = await checkPostgreSQLStatus();
  
  if (!isRunning) {
    await suggestSolutions();
    return;
  }
  
  // Probar diferentes configuraciones
  let connectionFound = false;
  
  for (const { name, config } of configs) {
    const success = await testConnection(name, config);
    if (success) {
      connectionFound = true;
      break;
    }
  }
  
  if (!connectionFound) {
    console.log('\n❌ NO SE PUDO ESTABLECER CONEXIÓN CON NINGUNA CONFIGURACIÓN');
    await suggestSolutions();
  } else {
    console.log('\n✅ CONEXIÓN EXITOSA ENCONTRADA');
    console.log('💡 Puedes proceder con la configuración de la base de datos');
  }
  
  console.log('\n🚀 PRÓXIMOS PASOS:');
  console.log('   1. Si no tienes la base de datos: npm run setup-db');
  console.log('   2. Para probar la conexión: npm run test-db');
  console.log('   3. Para iniciar los microservicios: npm run start-microservices');
}

main().catch(console.error);
