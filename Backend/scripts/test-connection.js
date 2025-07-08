// scripts/test-connection.js
const { Pool } = require('pg');

async function testConnection(config) {
  console.log(`🔍 Probando conexión con:`);
  console.log(`   Host: ${config.host}:${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);
  
  const pool = new Pool(config);
  
  try {
    const client = await pool.connect();
    console.log('   ✅ Conexión exitosa!');
    
    // Verificar versión
    const versionResult = await client.query('SELECT version()');
    console.log(`   📦 PostgreSQL: ${versionResult.rows[0].version}`);
    
    // Verificar bases de datos disponibles
    const dbResult = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false');
    console.log(`   🗄️  Bases de datos disponibles:`);
    dbResult.rows.forEach(row => console.log(`      - ${row.datname}`));
    
    client.release();
    await pool.end();
    return true;
    
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
    await pool.end();
    return false;
  }
}

async function main() {
  console.log('🔍 PROBANDO CONEXIONES A POSTGRESQL 17\n');
  
  // Configuraciones a probar
  const configs = [
    {
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'postgres'
    },
    {
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'admin'
    },
    {
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'password'
    },
    {
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: ''
    }
  ];
  
  for (const config of configs) {
    console.log(`\n${'='.repeat(50)}`);
    const success = await testConnection(config);
    if (success) {
      console.log('\n✅ ¡CONEXIÓN EXITOSA ENCONTRADA!');
      console.log('📝 Usa estas credenciales en tu .env:');
      console.log(`DB_HOST=${config.host}`);
      console.log(`DB_PORT=${config.port}`);
      console.log(`DB_NAME=${config.database}`);
      console.log(`DB_USER=${config.user}`);
      console.log(`DB_PASSWORD=${config.password}`);
      break;
    }
  }
}

main().catch(console.error);
