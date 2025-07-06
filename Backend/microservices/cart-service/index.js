// Cart Service - Microservicio de gestión de carrito de compras
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.CART_SERVICE_PORT || 5003;

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
  console.log(`[Cart Service] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/cart/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      service: 'Cart Service',
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      service: 'Cart Service',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Inicializar tablas del carrito
const initializeTables = async () => {
  try {
    // Tabla de carritos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_id VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'abandoned', 'completed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_active_cart UNIQUE(user_id, status)
      )
    `);

    // Tabla de items del carrito
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        price_at_time DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_cart_product UNIQUE(cart_id, product_id)
      )
    `);

    // Índices
    await pool.query('CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_carts_session ON carts(session_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id)');

    console.log('✅ [Cart Service] Tablas inicializadas correctamente');
  } catch (error) {
    console.error('❌ [Cart Service] Error inicializando tablas:', error.message);
  }
};

// Obtener carrito del usuario
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Buscar carrito activo del usuario
    let cartResult = await pool.query(
      'SELECT * FROM carts WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );
    
    // Si no existe, crear uno nuevo
    if (cartResult.rows.length === 0) {
      cartResult = await pool.query(
        'INSERT INTO carts (user_id, status) VALUES ($1, $2) RETURNING *',
        [userId, 'active']
      );
    }
    
    const cart = cartResult.rows[0];
    
    // Obtener items del carrito
    const itemsResult = await pool.query(`
      SELECT 
        ci.*,
        p.name as product_name,
        p.description as product_description,
        p.image_url as product_image,
        p.stock as available_stock,
        (ci.quantity * ci.price_at_time) as subtotal
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1 AND p.is_active = true
      ORDER BY ci.created_at ASC
    `, [cart.id]);
    
    // Calcular totales
    const total = itemsResult.rows.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    const totalItems = itemsResult.rows.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({
      success: true,
      data: {
        cart: {
          ...cart,
          total_amount: total.toFixed(2),
          total_items: totalItems
        },
        items: itemsResult.rows
      }
    });
  } catch (error) {
    console.error('[Cart Service] Error al obtener carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Agregar item al carrito
app.post('/api/cart/:userId/items', async (req, res) => {
  try {
    const { userId } = req.params;
    const { product_id, quantity = 1 } = req.body;
    
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID es requerido'
      });
    }
    
    // Verificar producto existe y obtener precio actual
    const productResult = await pool.query(
      'SELECT id, name, price, stock, is_active FROM products WHERE id = $1',
      [product_id]
    );
    
    if (productResult.rows.length === 0 || !productResult.rows[0].is_active) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado o no disponible'
      });
    }
    
    const product = productResult.rows[0];
    
    // Verificar stock disponible
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuficiente',
        available_stock: product.stock
      });
    }
    
    // Obtener o crear carrito activo
    let cartResult = await pool.query(
      'SELECT * FROM carts WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );
    
    if (cartResult.rows.length === 0) {
      cartResult = await pool.query(
        'INSERT INTO carts (user_id, status) VALUES ($1, $2) RETURNING *',
        [userId, 'active']
      );
    }
    
    const cart = cartResult.rows[0];
    
    // Verificar si el item ya existe en el carrito
    const existingItemResult = await pool.query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cart.id, product_id]
    );
    
    let result;
    if (existingItemResult.rows.length > 0) {
      // Actualizar cantidad
      const newQuantity = existingItemResult.rows[0].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Stock insuficiente para la cantidad total',
          current_in_cart: existingItemResult.rows[0].quantity,
          available_stock: product.stock
        });
      }
      
      result = await pool.query(
        `UPDATE cart_items 
         SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE cart_id = $2 AND product_id = $3 
         RETURNING *`,
        [newQuantity, cart.id, product_id]
      );
    } else {
      // Crear nuevo item
      result = await pool.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, price_at_time) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [cart.id, product_id, quantity, product.price]
      );
    }
    
    // Actualizar timestamp del carrito
    await pool.query(
      'UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [cart.id]
    );
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Item agregado al carrito exitosamente'
    });
  } catch (error) {
    console.error('[Cart Service] Error al agregar item:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar cantidad de item en carrito
app.put('/api/cart/:userId/items/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Cantidad debe ser mayor a 0'
      });
    }
    
    // Verificar que el item pertenece al usuario
    const itemCheck = await pool.query(`
      SELECT ci.*, p.stock, p.is_active
      FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = $1 AND c.user_id = $2 AND c.status = 'active'
    `, [itemId, userId]);
    
    if (itemCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado en el carrito'
      });
    }
    
    const item = itemCheck.rows[0];
    
    if (!item.is_active) {
      return res.status(400).json({
        success: false,
        message: 'Producto no disponible'
      });
    }
    
    if (item.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuficiente',
        available_stock: item.stock
      });
    }
    
    const result = await pool.query(
      `UPDATE cart_items 
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [quantity, itemId]
    );
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Cantidad actualizada exitosamente'
    });
  } catch (error) {
    console.error('[Cart Service] Error al actualizar item:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Eliminar item del carrito
app.delete('/api/cart/:userId/items/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    
    // Verificar que el item pertenece al usuario
    const result = await pool.query(`
      DELETE FROM cart_items 
      WHERE id = $1 AND cart_id IN (
        SELECT id FROM carts WHERE user_id = $2 AND status = 'active'
      )
      RETURNING id
    `, [itemId, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado en el carrito'
      });
    }
    
    res.json({
      success: true,
      message: 'Item eliminado del carrito exitosamente'
    });
  } catch (error) {
    console.error('[Cart Service] Error al eliminar item:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Vaciar carrito
app.delete('/api/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    await pool.query(`
      DELETE FROM cart_items 
      WHERE cart_id IN (
        SELECT id FROM carts WHERE user_id = $1 AND status = 'active'
      )
    `, [userId]);
    
    res.json({
      success: true,
      message: 'Carrito vaciado exitosamente'
    });
  } catch (error) {
    console.error('[Cart Service] Error al vaciar carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Completar carrito (marcar como completado)
app.post('/api/cart/:userId/complete', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(
      `UPDATE carts 
       SET status = 'completed', updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND status = 'active' 
       RETURNING *`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay carrito activo para completar'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Carrito completado exitosamente'
    });
  } catch (error) {
    console.error('[Cart Service] Error al completar carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener estadísticas del carrito
app.get('/api/cart/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT c.id) as total_carts,
        COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_carts,
        COUNT(DISTINCT CASE WHEN c.status = 'completed' THEN c.id END) as completed_carts,
        COUNT(DISTINCT CASE WHEN c.status = 'abandoned' THEN c.id END) as abandoned_carts,
        COALESCE(SUM(CASE WHEN c.status = 'active' THEN ci.quantity * ci.price_at_time END), 0) as active_cart_value
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.user_id = $1
    `, [userId]);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('[Cart Service] Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('[Cart Service] Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servicio de carrito'
  });
});

// Inicializar y arrancar servidor
const startServer = async () => {
  try {
    await initializeTables();
    
    app.listen(PORT, () => {
      console.log(`🚀 [Cart Service] Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📚 [Cart Service] Endpoints disponibles:`);
      console.log(`   - GET /api/cart/:userId - Obtener carrito`);
      console.log(`   - POST /api/cart/:userId/items - Agregar item`);
      console.log(`   - PUT /api/cart/:userId/items/:itemId - Actualizar cantidad`);
      console.log(`   - DELETE /api/cart/:userId/items/:itemId - Eliminar item`);
      console.log(`   - DELETE /api/cart/:userId - Vaciar carrito`);
      console.log(`   - POST /api/cart/:userId/complete - Completar carrito`);
      console.log(`   - GET /api/cart/:userId/stats - Estadísticas carrito`);
    });
  } catch (error) {
    console.error('❌ [Cart Service] Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();
