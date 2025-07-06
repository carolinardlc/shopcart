// Category Service - Microservicio de gestión de categorías
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.CATEGORY_SERVICE_PORT || 5005;

// Configuración de base de datos
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'shopcart_db',
  user: process.env.DB_USER || 'shopcart_user',
  password: process.env.DB_PASSWORD || 'shopcart_password',
});

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[Category Service] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/categories/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      service: 'Category Service',
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      service: 'Category Service',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Inicializar tablas de categorías
const initializeTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ [Category Service] Tablas inicializadas correctamente');
    
    // Insertar categorías por defecto si no existen
    await insertDefaultCategories();
  } catch (error) {
    console.error('❌ [Category Service] Error inicializando tablas:', error.message);
  }
};

// Insertar categorías por defecto
const insertDefaultCategories = async () => {
  try {
    const defaultCategories = [
      { name: 'Ropa', description: 'Vestimenta y accesorios de moda' },
      { name: 'Electrónicos', description: 'Dispositivos y gadgets electrónicos' },
      { name: 'Hogar', description: 'Artículos para el hogar y decoración' },
      { name: 'Deportes', description: 'Equipamiento y ropa deportiva' }
    ];

    for (const category of defaultCategories) {
      await pool.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [category.name, category.description]
      );
    }

    console.log('✅ [Category Service] Categorías por defecto verificadas');
  } catch (error) {
    console.error('❌ [Category Service] Error insertando categorías por defecto:', error.message);
  }
};

// Listar categorías
app.get('/api/categories', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY name ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('[Category Service] Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener categoría por ID
app.get('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('[Category Service] Error al obtener categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Crear categoría
app.post('/api/categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nombre es requerido'
      });
    }
    
    const result = await pool.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Categoría creada exitosamente'
    });
  } catch (error) {
    console.error('[Category Service] Error al crear categoría:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar categoría
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const result = await pool.query(
      `UPDATE categories 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 
       RETURNING *`,
      [name, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Categoría actualizada exitosamente'
    });
  } catch (error) {
    console.error('[Category Service] Error al actualizar categoría:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Eliminar categoría
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay productos asociados
    const productsCheck = await pool.query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = $1',
      [id]
    );
    
    if (parseInt(productsCheck.rows[0].count) > 0) {
      return res.status(409).json({
        success: false,
        message: 'No se puede eliminar la categoría porque tiene productos asociados'
      });
    }
    
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('[Category Service] Error al eliminar categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener productos por categoría
app.get('/api/categories/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const result = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       JOIN categories c ON p.category_id = c.id 
       WHERE c.id = $1 AND p.is_active = true 
       ORDER BY p.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('[Category Service] Error al obtener productos de categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Estadísticas de categorías
app.get('/api/categories/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.description,
        COUNT(p.id) as product_count,
        COALESCE(AVG(p.price), 0) as avg_price,
        COALESCE(SUM(p.stock), 0) as total_stock
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      GROUP BY c.id, c.name, c.description
      ORDER BY product_count DESC
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('[Category Service] Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('[Category Service] Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servicio de categorías'
  });
});

// Inicializar y arrancar servidor
const startServer = async () => {
  try {
    await initializeTables();
    
    app.listen(PORT, () => {
      console.log(`🚀 [Category Service] Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📚 [Category Service] Endpoints disponibles:`);
      console.log(`   - GET /api/categories - Listar categorías`);
      console.log(`   - GET /api/categories/:id - Obtener categoría`);
      console.log(`   - POST /api/categories - Crear categoría`);
      console.log(`   - PUT /api/categories/:id - Actualizar categoría`);
      console.log(`   - DELETE /api/categories/:id - Eliminar categoría`);
      console.log(`   - GET /api/categories/:id/products - Productos por categoría`);
      console.log(`   - GET /api/categories/stats - Estadísticas de categorías`);
    });
  } catch (error) {
    console.error('❌ [Category Service] Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();
