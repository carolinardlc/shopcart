// database/schema.js
const { query } = require('./connection');

// Script para crear las tablas de la base de datos
const createTables = async () => {
  try {
    console.log('📋 Creando tablas de la base de datos...');

    // Tabla de categorías
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de productos
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
        stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de movimientos de stock (para auditoría)
    await query(`
      CREATE TABLE IF NOT EXISTS stock_movements (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('IN', 'OUT', 'ADJUSTMENT')),
        quantity INTEGER NOT NULL,
        previous_stock INTEGER NOT NULL,
        new_stock INTEGER NOT NULL,
        reason VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Índices para mejorar performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
    `);
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
    `);

    console.log('✅ Tablas creadas exitosamente');

  } catch (error) {
    console.error('❌ Error creando tablas:', error.message);
    throw error;
  }
};

// Insertar datos de ejemplo
const insertSampleData = async () => {
  try {
    console.log('📝 Insertando datos de ejemplo...');

    // Insertar categorías
    const categories = [
      { name: 'Ropa', description: 'Ropa y vestimenta' },
      { name: 'Calzado', description: 'Zapatos y calzado deportivo' },
      { name: 'Accesorios', description: 'Accesorios y complementos' },
      { name: 'Electrónicos', description: 'Dispositivos electrónicos' }
    ];

    for (const category of categories) {
      await query(`
        INSERT INTO categories (name, description) 
        VALUES ($1, $2) 
        ON CONFLICT (name) DO NOTHING
      `, [category.name, category.description]);
    }

    // Obtener IDs de categorías
    const categoryResults = await query('SELECT id, name FROM categories');
    const categoryMap = {};
    categoryResults.rows.forEach(row => {
      categoryMap[row.name] = row.id;
    });

    // Insertar productos de ejemplo
    const products = [
      {
        name: 'Camiseta Premium',
        description: 'Camiseta de algodón 100% premium, cómoda y duradera',
        price: 25.99,
        stock: 50,
        category_id: categoryMap['Ropa'],
        image_url: '/images/camiseta-premium.jpg'
      },
      {
        name: 'Jeans Clásicos',
        description: 'Jeans de corte clásico, perfectos para cualquier ocasión',
        price: 59.99,
        stock: 30,
        category_id: categoryMap['Ropa'],
        image_url: '/images/jeans-clasicos.jpg'
      },
      {
        name: 'Sneakers Deportivos',
        description: 'Sneakers cómodos para deporte y uso casual',
        price: 89.99,
        stock: 25,
        category_id: categoryMap['Calzado'],
        image_url: '/images/sneakers-deportivos.jpg'
      },
      {
        name: 'Chaqueta de Cuero',
        description: 'Chaqueta de cuero sintético, estilo moderno',
        price: 149.99,
        stock: 15,
        category_id: categoryMap['Ropa'],
        image_url: '/images/chaqueta-cuero.jpg'
      },
      {
        name: 'Reloj Casual',
        description: 'Reloj casual resistente al agua',
        price: 79.99,
        stock: 20,
        category_id: categoryMap['Accesorios'],
        image_url: '/images/reloj-casual.jpg'
      },
      {
        name: 'Mochila Urban',
        description: 'Mochila urbana con múltiples compartimentos',
        price: 45.99,
        stock: 35,
        category_id: categoryMap['Accesorios'],
        image_url: '/images/mochila-urban.jpg'
      },
      {
        name: 'Gafas de Sol',
        description: 'Gafas de sol con protección UV',
        price: 29.99,
        stock: 40,
        category_id: categoryMap['Accesorios'],
        image_url: '/images/gafas-sol.jpg'
      },
      {
        name: 'Vestido Elegante',
        description: 'Vestido elegante para ocasiones especiales',
        price: 89.99,
        stock: 18,
        category_id: categoryMap['Ropa'],
        image_url: '/images/vestido-elegante.jpg'
      }
    ];

    for (const product of products) {
      await query(`
        INSERT INTO products (name, description, price, stock, category_id, image_url) 
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [
        product.name,
        product.description,
        product.price,
        product.stock,
        product.category_id,
        product.image_url
      ]);
    }

    console.log('✅ Datos de ejemplo insertados exitosamente');

  } catch (error) {
    console.error('❌ Error insertando datos de ejemplo:', error.message);
    throw error;
  }
};

// Función para eliminar todas las tablas (útil para development)
const dropTables = async () => {
  try {
    console.log('🗑️ Eliminando tablas...');
    
    await query('DROP TABLE IF EXISTS stock_movements CASCADE');
    await query('DROP TABLE IF EXISTS products CASCADE');
    await query('DROP TABLE IF EXISTS categories CASCADE');
    
    console.log('✅ Tablas eliminadas exitosamente');
  } catch (error) {
    console.error('❌ Error eliminando tablas:', error.message);
    throw error;
  }
};

module.exports = {
  createTables,
  insertSampleData,
  dropTables
};
