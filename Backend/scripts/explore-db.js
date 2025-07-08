// scripts/explore-db.js
const { Pool } = require('pg');

const config = {
  host: 'localhost',
  port: 5432,
  database: 'shopcart_db',
  user: 'postgres',
  password: 'postgres'
};

async function exploreDatabase() {
  const pool = new Pool(config);
  
  try {
    const client = await pool.connect();
    console.log('🔍 EXPLORANDO BASE DE DATOS SHOPCART');
    console.log('=' .repeat(50));
    
    // Mostrar categorías
    console.log('\n📂 CATEGORÍAS:');
    const categoriesResult = await client.query('SELECT * FROM categories ORDER BY id');
    categoriesResult.rows.forEach(row => {
      console.log(`   ${row.id}. ${row.name} - ${row.description}`);
    });
    
    // Mostrar productos
    console.log('\n📦 PRODUCTOS:');
    const productsResult = await client.query(`
      SELECT p.id, p.name, p.price, p.stock, c.name as category
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.id
    `);
    productsResult.rows.forEach(row => {
      console.log(`   ${row.id}. ${row.name} - S/.${row.price} (Stock: ${row.stock}) [${row.category}]`);
    });
    
    // Mostrar estadísticas
    console.log('\n📊 ESTADÍSTICAS:');
    const statsResult = await client.query(`
      SELECT 
        COUNT(*) as total_products,
        AVG(price) as avg_price,
        SUM(stock) as total_stock,
        MAX(price) as max_price,
        MIN(price) as min_price
      FROM products
    `);
    const stats = statsResult.rows[0];
    console.log(`   Total productos: ${stats.total_products}`);
    console.log(`   Precio promedio: S/.${parseFloat(stats.avg_price).toFixed(2)}`);
    console.log(`   Stock total: ${stats.total_stock}`);
    console.log(`   Precio máximo: S/.${stats.max_price}`);
    console.log(`   Precio mínimo: S/.${stats.min_price}`);
    
    // Productos por categoría
    console.log('\n🏷️  PRODUCTOS POR CATEGORÍA:');
    const categoryStatsResult = await client.query(`
      SELECT 
        c.name as category,
        COUNT(p.id) as product_count,
        AVG(p.price) as avg_price
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name
      ORDER BY product_count DESC
    `);
    categoryStatsResult.rows.forEach(row => {
      const avgPrice = row.avg_price ? parseFloat(row.avg_price).toFixed(2) : '0.00';
      console.log(`   ${row.category}: ${row.product_count} productos (Promedio: S/.${avgPrice})`);
    });
    
    client.release();
    await pool.end();
    
    console.log('\n✅ Exploración completada. Usa pgAdmin4 para ver más detalles.');
    
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
    await pool.end();
  }
}

exploreDatabase().catch(console.error);
