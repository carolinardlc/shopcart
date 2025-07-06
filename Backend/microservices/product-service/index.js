// Product Service - Microservicio de gestión de productos
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();
const PORT = process.env.PRODUCT_SERVICE_PORT || 5002;

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

// Configuración de RabbitMQ
let rabbitConnection = null;
let rabbitChannel = null;

const connectRabbitMQ = async () => {
  try {
    rabbitConnection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    rabbitChannel = await rabbitConnection.createChannel();
    await rabbitChannel.assertExchange('shopcart_events', 'topic', { durable: true });
    
    // Suscribirse a eventos relevantes
    const queue = await rabbitChannel.assertQueue('product_service_queue', { durable: true });
    await rabbitChannel.bindQueue(queue.queue, 'shopcart_events', 'order.*');
    
    rabbitChannel.consume(queue.queue, (message) => {
      if (message) {
        const event = JSON.parse(message.content.toString());
        handleEvent(event);
        rabbitChannel.ack(message);
      }
    });
    
    console.log('[Product Service] Conectado a RabbitMQ');
  } catch (error) {
    console.error('[Product Service] Error conectando a RabbitMQ:', error.message);
  }
};

const publishEvent = async (eventType, data) => {
  if (rabbitChannel) {
    try {
      const message = {
        eventType,
        timestamp: new Date().toISOString(),
        service: 'product-service',
        data
      };
      rabbitChannel.publish(
        'shopcart_events',
        eventType,
        Buffer.from(JSON.stringify(message))
      );
      console.log(`[Product Service] Evento publicado: ${eventType}`);
    } catch (error) {
      console.error('[Product Service] Error publicando evento:', error);
    }
  }
};

const handleEvent = async (event) => {
  try {
    switch (event.eventType) {
      case 'order.created':
        // Reducir stock cuando se crea una orden
        await handleOrderCreated(event.data);
        break;
      case 'order.cancelled':
        // Restaurar stock cuando se cancela una orden
        await handleOrderCancelled(event.data);
        break;
      default:
        console.log(`[Product Service] Evento no manejado: ${event.eventType}`);
    }
  } catch (error) {
    console.error('[Product Service] Error manejando evento:', error);
  }
};

const handleOrderCreated = async (orderData) => {
  if (orderData.items) {
    for (const item of orderData.items) {
      await pool.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1',
        [item.quantity, item.productId]
      );
    }
    console.log(`[Product Service] Stock actualizado para orden ${orderData.orderId}`);
  }
};

const handleOrderCancelled = async (orderData) => {
  if (orderData.items) {
    for (const item of orderData.items) {
      await pool.query(
        'UPDATE products SET stock = stock + $1 WHERE id = $2',
        [item.quantity, item.productId]
      );
    }
    console.log(`[Product Service] Stock restaurado para orden cancelada ${orderData.orderId}`);
  }
};

// Conectar a RabbitMQ al inicio
connectRabbitMQ();

// Logging middleware
app.use((req, res, next) => {
  console.log(`[Product Service] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/products/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      service: 'Product Service',
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      service: 'Product Service',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Inicializar tablas de productos
const initializeTables = async () => {
  try {
    // Tabla de productos
    await pool.query(`
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

    // Tabla de movimientos de stock
    await pool.query(`
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

    // Índices
    await pool.query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id)');

    console.log('✅ [Product Service] Tablas inicializadas correctamente');
  } catch (error) {
    console.error('❌ [Product Service] Error inicializando tablas:', error.message);
  }
};

// Listar productos
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, category_id, search, active_only = 'true' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    let conditions = [];
    let params = [];
    let paramIndex = 1;
    
    if (active_only === 'true') {
      conditions.push(`p.is_active = $${paramIndex}`);
      params.push(true);
      paramIndex++;
    }
    
    if (category_id) {
      conditions.push(`p.category_id = $${paramIndex}`);
      params.push(category_id);
      paramIndex++;
    }
    
    if (search) {
      conditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
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
    console.error('[Product Service] Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Endpoint simple para compatibilidad
app.get('/api/products/simple', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = true 
      ORDER BY p.created_at DESC 
      LIMIT 20
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('[Product Service] Error en endpoint simple:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener producto por ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('[Product Service] Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Crear producto
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, stock, category_id, image_url, is_active = true } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y precio son requeridos'
      });
    }
    
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, category_id, image_url, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, description, price, stock || 0, category_id, image_url, is_active]
    );
    
    // Registrar movimiento de stock inicial si hay stock
    if (stock > 0) {
      await pool.query(
        `INSERT INTO stock_movements (product_id, movement_type, quantity, previous_stock, new_stock, reason) 
         VALUES ($1, 'IN', $2, 0, $2, 'Stock inicial')`,
        [result.rows[0].id, stock]
      );
    }
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Producto creado exitosamente'
    });
  } catch (error) {
    console.error('[Product Service] Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar producto
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, image_url, is_active } = req.body;
    
    const result = await pool.query(
      `UPDATE products 
       SET name = COALESCE($1, name), 
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           category_id = COALESCE($4, category_id),
           image_url = COALESCE($5, image_url),
           is_active = COALESCE($6, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [name, description, price, category_id, image_url, is_active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    console.error('[Product Service] Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Eliminar producto (soft delete)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Producto desactivado exitosamente'
    });
  } catch (error) {
    console.error('[Product Service] Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar stock
app.post('/api/products/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, reason = 'Ajuste manual' } = req.body;
    
    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: 'Cantidad es requerida'
      });
    }
    
    // Obtener stock actual
    const productResult = await pool.query('SELECT stock FROM products WHERE id = $1', [id]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    const currentStock = productResult.rows[0].stock;
    const newStock = currentStock + quantity;
    
    if (newStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuficiente'
      });
    }
    
    // Actualizar stock
    await pool.query(
      'UPDATE products SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newStock, id]
    );
    
    // Registrar movimiento
    const movementType = quantity > 0 ? 'IN' : 'OUT';
    await pool.query(
      `INSERT INTO stock_movements (product_id, movement_type, quantity, previous_stock, new_stock, reason) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, movementType, Math.abs(quantity), currentStock, newStock, reason]
    );
    
    res.json({
      success: true,
      data: {
        product_id: id,
        previous_stock: currentStock,
        new_stock: newStock,
        quantity_changed: quantity
      },
      message: 'Stock actualizado exitosamente'
    });
  } catch (error) {
    console.error('[Product Service] Error al actualizar stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener historial de movimientos de stock
app.get('/api/products/:id/stock-movements', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const result = await pool.query(
      `SELECT * FROM stock_movements 
       WHERE product_id = $1 
       ORDER BY created_at DESC 
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
    console.error('[Product Service] Error al obtener movimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('[Product Service] Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servicio de productos'
  });
});

// Inicializar y arrancar servidor
const startServer = async () => {
  try {
    await initializeTables();
    
    app.listen(PORT, () => {
      console.log(`🚀 [Product Service] Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📚 [Product Service] Endpoints disponibles:`);
      console.log(`   - GET /api/products - Listar productos`);
      console.log(`   - GET /api/products/simple - Productos simples`);
      console.log(`   - GET /api/products/:id - Obtener producto`);
      console.log(`   - POST /api/products - Crear producto`);
      console.log(`   - PUT /api/products/:id - Actualizar producto`);
      console.log(`   - DELETE /api/products/:id - Eliminar producto`);
      console.log(`   - POST /api/products/:id/stock - Actualizar stock`);
      console.log(`   - GET /api/products/:id/stock-movements - Historial stock`);
    });
  } catch (error) {
    console.error('❌ [Product Service] Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();
