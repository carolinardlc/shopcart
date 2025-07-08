// scripts/test-postgres-connection.js
const { Pool } = require('pg');

async function testPostgreSQLConnection() {
  console.log('🔍 PROBANDO CONEXIÓN A POSTGRESQL');
  console.log('=' .repeat(50));
  
  // Configuraciones comunes para PostgreSQL
  const configs = [
    {
      name: 'Usuario por defecto (postgres)',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'postgres'
      }
    },
    {
      name: 'Sin contraseña',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: ''
      }
    },
    {
      name: 'Usuario del sistema',
      config: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: process.env.USERNAME || 'postgres',
        password: ''
      }
    },
    {
      name: 'Puerto alternativo 5433',
      config: {
        host: 'localhost',
        port: 5433,
        database: 'postgres',
        user: 'postgres',
        password: 'postgres'
      }
    }
  ];
  
  for (const { name, config } of configs) {
    console.log(`\n🧪 Probando: ${name}`);
    console.log(`   ${config.user}@${config.host}:${config.port}/${config.database}`);
    
    const pool = new Pool(config);
    
    try {
      const client = await pool.connect();
      console.log('   ✅ ¡CONEXIÓN EXITOSA!');
      
      // Obtener información del servidor
      const result = await client.query('SELECT version(), current_user, current_database()');
      const row = result.rows[0];
      
      console.log(`   📦 Versión: ${row.version.split(' ')[1]}`);
      console.log(`   👤 Usuario: ${row.current_user}`);
      console.log(`   🗄️  Base de datos: ${row.current_database}`);
      
      // Listar todas las bases de datos
      const dbResult = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname');
      console.log(`   📋 Bases de datos disponibles:`);
      dbResult.rows.forEach(row => {
        console.log(`      - ${row.datname}`);
      });
      
      client.release();
      await pool.end();
      
      console.log('\n✅ CONFIGURACIÓN VÁLIDA ENCONTRADA');
      console.log('📝 Puedes usar estas credenciales:');
      console.log(`   Host: ${config.host}`);
      console.log(`   Port: ${config.port}`);
      console.log(`   Database: ${config.database}`);
      console.log(`   User: ${config.user}`);
      console.log(`   Password: ${config.password || '(sin contraseña)'}`);
      
      return config;
      
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
      await pool.end();
    }
  }
  
  console.log('\n❌ NO SE PUDO CONECTAR CON NINGUNA CONFIGURACIÓN');
  console.log('💡 Intenta:');
  console.log('   1. Verificar que PostgreSQL esté ejecutándose');
  console.log('   2. Comprobar las credenciales en pgAdmin');
  console.log('   3. Restablecer la contraseña del usuario postgres');
  
  return null;
}

async function createShopCartDatabase(config) {
  console.log('\n🏗️  CREANDO BASE DE DATOS SHOPCART');
  console.log('-' .repeat(40));
  
  const pool = new Pool(config);
  
  try {
    const client = await pool.connect();
    
    // Verificar si la base de datos existe
    const dbCheck = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', ['shopcart_db']);
    
    if (dbCheck.rows.length === 0) {
      console.log('📦 Creando base de datos shopcart_db...');
      await client.query('CREATE DATABASE shopcart_db');
      console.log('✅ Base de datos creada');
    } else {
      console.log('ℹ️  Base de datos shopcart_db ya existe');
    }
    
    client.release();
    await pool.end();
    
    return true;
    
  } catch (err) {
    console.log(`❌ Error creando base de datos: ${err.message}`);
    await pool.end();
    return false;
  }
}

async function main() {
  const workingConfig = await testPostgreSQLConnection();
  
  if (workingConfig) {
    // Crear la base de datos shopcart_db si no existe
    const dbCreated = await createShopCartDatabase(workingConfig);
    
    if (dbCreated) {
      console.log('\n🎉 ¡LISTO PARA USAR!');
      console.log('🚀 Próximos pasos:');
      console.log('   1. Actualizar las credenciales en .env');
      console.log('   2. Ejecutar: npm run setup-db');
      console.log('   3. Ejecutar: npm run start-microservices');
      
      // Mostrar ejemplo de .env
      console.log('\n📝 Ejemplo de .env:');
      console.log('DB_HOST=localhost');
      console.log(`DB_PORT=${workingConfig.port}`);
      console.log('DB_NAME=shopcart_db');
      console.log(`DB_USER=${workingConfig.user}`);
      console.log(`DB_PASSWORD=${workingConfig.password}`);
    }
  }
}

main().catch(console.error);
