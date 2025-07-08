// scripts/check-shopcart-db.js
const { Pool } = require('pg');

async function checkDatabase() {
  const config = {
    host: 'localhost',
    port: 5432,
    database: 'shopcart_db',
    user: 'postgres',
    password: 'postgres'
  };
  
  const pool = new Pool(config);
  
  try {
    const client = await pool.connect();
    console.log('✅ Conectado a shopcart_db');
    
    // Verificar tablas existentes
    const tablesResult = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log(`\n📋 Tablas en shopcart_db (${tablesResult.rows.length}):`);
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  No hay tablas creadas');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name} (${row.table_type})`);
      });
    }
    
    // Si hay tablas, verificar algunos datos
    if (tablesResult.rows.length > 0) {
      console.log('\n📊 Datos en las tablas:');
      
      for (const table of tablesResult.rows) {
        try {
          const countResult = await client.query(`SELECT COUNT(*) FROM ${table.table_name}`);
          console.log(`   ${table.table_name}: ${countResult.rows[0].count} registros`);
        } catch (err) {
          console.log(`   ${table.table_name}: Error al contar - ${err.message}`);
        }
      }
    }
    
    client.release();
    await pool.end();
    
    return tablesResult.rows.length > 0;
    
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
    await pool.end();
    return false;
  }
}

async function main() {
  console.log('🔍 VERIFICANDO BASE DE DATOS shopcart_db\n');
  
  const hasData = await checkDatabase();
  
  if (!hasData) {
    console.log('\n💡 RECOMENDACIONES:');
    console.log('   1. Ejecutar setup de la base de datos: npm run setup-db');
    console.log('   2. O ejecutar el script SQL: psql -U postgres -d shopcart_db -f setup-database.sql');
    console.log('   3. Verificar que tienes el archivo setup-database.sql en este directorio');
  } else {
    console.log('\n✅ La base de datos tiene datos. Puedes usar pgAdmin4 para explorarla.');
  }
}

main().catch(console.error);
