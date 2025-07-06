// database/connection.js
const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'shopcart_db',
  user: process.env.DB_USER || 'shopcart_user',
  password: process.env.DB_PASSWORD || 'shopcart_password',
  // Configuraciones adicionales para desarrollo
  max: 20, // máximo número de conexiones en el pool
  idleTimeoutMillis: 30000, // tiempo para cerrar conexiones inactivas
  connectionTimeoutMillis: 2000, // tiempo límite para conectar
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Verificar versión de PostgreSQL
    const result = await client.query('SELECT version()');
    console.log('📦 PostgreSQL version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
    
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    console.log('🔧 Asegúrate de que PostgreSQL esté ejecutándose y las credenciales sean correctas');
    return false;
  }
};

// Función para ejecutar queries con manejo de errores
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('🔍 Query ejecutada:', { text, duration: duration + 'ms', rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('❌ Error en query:', err.message);
    throw err;
  }
};

// Función para cerrar todas las conexiones (útil para testing)
const closePool = async () => {
  await pool.end();
  console.log('🔒 Pool de conexiones cerrado');
};

module.exports = {
  pool,
  query,
  testConnection,
  closePool
};
