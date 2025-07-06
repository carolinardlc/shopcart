// Test de conexión simple a PostgreSQL
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'shopcart_db',
  user: 'shopcart_user',
  password: 'shopcart_password',
});

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a PostgreSQL...');
    
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL!');
    
    const result = await client.query('SELECT COUNT(*) as total FROM users');
    console.log('👥 Usuarios en la base de datos:', result.rows[0].total);
    
    const products = await client.query('SELECT COUNT(*) as total FROM products');
    console.log('📦 Productos en la base de datos:', products.rows[0].total);
    
    client.release();
    console.log('🎉 Test completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
