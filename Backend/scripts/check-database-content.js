// scripts/check-database-content.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'shopcart_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function checkDatabaseContent() {
  console.log('🔍 VERIFICANDO CONTENIDO DE LA BASE DE DATOS');
  console.log('=' .repeat(50));
  
  try {
    const client = await pool.connect();
    
    // Verificar tablas
    console.log('\n📋 TABLAS EN LA BASE DE DATOS:');
    const tablesResult = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    tablesResult.rows.forEach(row => {
      console.log(`   • ${row.table_name} (${row.table_type})`);
    });
    
    // Verificar categorías
    console.log('\n🏷️  CATEGORÍAS:');
    const categoriesResult = await client.query('SELECT * FROM categories ORDER BY id');
    categoriesResult.rows.forEach(row => {
      console.log(`   • ID: ${row.id}, Nombre: ${row.name}, Descripción: ${row.description}`);
    });
    
    // Verificar productos
    console.log('\n📦 PRODUCTOS:');
    const productsResult = await client.query(`
      SELECT p.id, p.name, p.price, p.stock, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.id
    `);
    
    productsResult.rows.forEach(row => {
      console.log(`   • ID: ${row.id}, Nombre: ${row.name}, Precio: S/.${row.price}, Stock: ${row.stock}, Categoría: ${row.category_name}`);
    });
    
    // Estadísticas
    console.log('\n📊 ESTADÍSTICAS:');
    const statsResult = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM categories) as total_categories,
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM products WHERE is_active = true) as active_products,
        (SELECT SUM(stock) FROM products) as total_stock
    `);
    
    const stats = statsResult.rows[0];
    console.log(`   • Total de categorías: ${stats.total_categories}`);
    console.log(`   • Total de productos: ${stats.total_products}`);
    console.log(`   • Productos activos: ${stats.active_products}`);
    console.log(`   • Stock total: ${stats.total_stock}`);
    
    client.release();
    
    console.log('\n✅ BASE DE DATOS FUNCIONANDO CORRECTAMENTE');
    console.log('🚀 Puedes proceder a iniciar los microservicios');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkDatabaseContent();
