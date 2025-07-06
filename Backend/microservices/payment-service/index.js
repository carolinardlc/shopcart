// Payment Service - Microservicio de gestión de pagos y órdenes
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();
const PORT = process.env.PAYMENT_SERVICE_PORT || 5004;

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
    console.log('[Payment Service] Conectado a RabbitMQ');
  } catch (error) {
    console.error('[Payment Service] Error conectando a RabbitMQ:', error.message);
  }
};

const publishEvent = async (eventType, data) => {
  if (rabbitChannel) {
    try {
      const message = {
        eventType,
        timestamp: new Date().toISOString(),
        service: 'payment-service',
        data
      };
      rabbitChannel.publish(
        'shopcart_events',
        eventType,
        Buffer.from(JSON.stringify(message))
      );
      console.log(`[Payment Service] Evento publicado: ${eventType}`);
    } catch (error) {
      console.error('[Payment Service] Error publicando evento:', error);
    }
  }
};

// Conectar a RabbitMQ al inicio
connectRabbitMQ();

// Logging middleware
app.use((req, res, next) => {
  console.log(`[Payment Service] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/payments/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      service: 'Payment Service',
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      service: 'Payment Service',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Inicializar tablas de pagos
const initializeTables = async () => {
  try {
    // Tabla de órdenes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        cart_id INTEGER REFERENCES carts(id),
        order_number VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
        total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
        currency VARCHAR(3) DEFAULT 'USD',
        shipping_address TEXT,
        billing_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de items de orden
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER NOT NULL REFERENCES products(id),
        product_name VARCHAR(200) NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
        total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de pagos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        payment_method VARCHAR(50) NOT NULL,
        payment_provider VARCHAR(50),
        transaction_id VARCHAR(255),
        amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
        payment_date TIMESTAMP,
        failure_reason TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Índices
    await pool.query('CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)');

    console.log('✅ [Payment Service] Tablas inicializadas correctamente');
  } catch (error) {
    console.error('❌ [Payment Service] Error inicializando tablas:', error.message);
  }
};

// Generar número de orden único
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

// Crear orden desde carrito
app.post('/api/payments/orders', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { user_id, cart_id, shipping_address, billing_address } = req.body;
    
    if (!user_id || !cart_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID y Cart ID son requeridos'
      });
    }
    
    // Verificar carrito activo
    const cartResult = await client.query(`
      SELECT c.*, 
             COUNT(ci.id) as item_count,
             SUM(ci.quantity * ci.price_at_time) as total_amount
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.id = $1 AND c.user_id = $2 AND c.status = 'active'
      GROUP BY c.id
    `, [cart_id, user_id]);
    
    if (cartResult.rows.length === 0 || cartResult.rows[0].item_count === 0) {
      return res.status(400).json({
        success: false,
        message: 'Carrito no encontrado o vacío'
      });
    }
    
    const cart = cartResult.rows[0];
    const orderNumber = generateOrderNumber();
    
    // Crear orden
    const orderResult = await client.query(`
      INSERT INTO orders (user_id, cart_id, order_number, total_amount, shipping_address, billing_address, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `, [user_id, cart_id, orderNumber, cart.total_amount, shipping_address, billing_address]);
    
    const order = orderResult.rows[0];
    
    // Obtener items del carrito y crear order_items
    const cartItemsResult = await client.query(`
      SELECT ci.*, p.name as product_name, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1 AND p.is_active = true
    `, [cart_id]);
    
    // Verificar stock y crear order items
    for (const item of cartItemsResult.rows) {
      if (item.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${item.product_name}. Disponible: ${item.stock}, Solicitado: ${item.quantity}`);
      }
      
      // Crear order item
      await client.query(`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [order.id, item.product_id, item.product_name, item.quantity, item.price_at_time, item.quantity * item.price_at_time]);
      
      // Reducir stock del producto
      await client.query(`
        UPDATE products 
        SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2
      `, [item.quantity, item.product_id]);
      
      // Registrar movimiento de stock
      await client.query(`
        INSERT INTO stock_movements (product_id, movement_type, quantity, previous_stock, new_stock, reason)
        VALUES ($1, 'OUT', $2, $3, $4, $5)
      `, [item.product_id, item.quantity, item.stock, item.stock - item.quantity, `Venta - Orden ${orderNumber}`]);
    }
    
    // Marcar carrito como completado
    await client.query(`
      UPDATE carts SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1
    `, [cart_id]);
    
    await client.query('COMMIT');
    
    // Publicar evento de orden creada
    await publishEvent('order.created', {
      orderId: order.id,
      orderNumber: order.order_number,
      userId: order.user_id,
      cartId: order.cart_id,
      totalAmount: order.total_amount,
      items: cartItemsResult.rows.map(item => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        unitPrice: item.price_at_time
      })),
      timestamp: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      data: order,
      message: 'Orden creada exitosamente'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[Payment Service] Error al crear orden:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  } finally {
    client.release();
  }
});

// Procesar pago
app.post('/api/payments/process', async (req, res) => {
  try {
    const { order_id, payment_method, payment_provider = 'simulation', amount, metadata = {} } = req.body;
    
    if (!order_id || !payment_method || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, método de pago y monto son requeridos'
      });
    }
    
    // Verificar orden existe
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [order_id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }
    
    const order = orderResult.rows[0];
    
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'La orden no está en estado pendiente'
      });
    }
    
    // Simular procesamiento de pago
    const isPaymentSuccessful = Math.random() > 0.1; // 90% éxito
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
    
    const paymentStatus = isPaymentSuccessful ? 'completed' : 'failed';
    const orderStatus = isPaymentSuccessful ? 'processing' : 'pending';
    const failureReason = isPaymentSuccessful ? null : 'Simulación de falla de pago';
    
    // Crear registro de pago
    const paymentResult = await pool.query(`
      INSERT INTO payments (order_id, payment_method, payment_provider, transaction_id, amount, status, payment_date, failure_reason, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [order_id, payment_method, payment_provider, transactionId, amount, paymentStatus, 
        isPaymentSuccessful ? new Date() : null, failureReason, JSON.stringify(metadata)]);
    
    // Actualizar estado de la orden
    await pool.query(`
      UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2
    `, [orderStatus, order_id]);
    
    res.json({
      success: isPaymentSuccessful,
      data: paymentResult.rows[0],
      message: isPaymentSuccessful ? 'Pago procesado exitosamente' : 'Error al procesar el pago'
    });
  } catch (error) {
    console.error('[Payment Service] Error al procesar pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener orden por ID
app.get('/api/payments/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }
    
    // Obtener items de la orden
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    
    // Obtener pagos de la orden
    const paymentsResult = await pool.query('SELECT * FROM payments WHERE order_id = $1', [id]);
    
    res.json({
      success: true,
      data: {
        order: orderResult.rows[0],
        items: itemsResult.rows,
        payments: paymentsResult.rows
      }
    });
  } catch (error) {
    console.error('[Payment Service] Error al obtener orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Listar órdenes de usuario
app.get('/api/payments/users/:userId/orders', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM orders WHERE user_id = $1';
    let params = [userId];
    let paramIndex = 2;
    
    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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
    console.error('[Payment Service] Error al obtener órdenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar estado de orden
app.put('/api/payments/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido'
      });
    }
    
    const result = await pool.query(`
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `, [status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Estado de orden actualizado exitosamente'
    });
  } catch (error) {
    console.error('[Payment Service] Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener estadísticas de pagos
app.get('/api/payments/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'completed' THEN o.id END) as completed_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.id END) as pending_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'cancelled' THEN o.id END) as cancelled_orders,
        COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount END), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN o.status = 'completed' THEN o.total_amount END), 0) as avg_order_value,
        COUNT(DISTINCT p.id) as total_payments,
        COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) as successful_payments,
        COUNT(DISTINCT CASE WHEN p.status = 'failed' THEN p.id END) as failed_payments
      FROM orders o
      LEFT JOIN payments p ON o.id = p.order_id
    `);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('[Payment Service] Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('[Payment Service] Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servicio de pagos'
  });
});

// Inicializar y arrancar servidor
const startServer = async () => {
  try {
    await initializeTables();
    
    app.listen(PORT, () => {
      console.log(`🚀 [Payment Service] Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📚 [Payment Service] Endpoints disponibles:`);
      console.log(`   - POST /api/payments/orders - Crear orden`);
      console.log(`   - POST /api/payments/process - Procesar pago`);
      console.log(`   - GET /api/payments/orders/:id - Obtener orden`);
      console.log(`   - GET /api/payments/users/:userId/orders - Órdenes de usuario`);
      console.log(`   - PUT /api/payments/orders/:id/status - Actualizar estado`);
      console.log(`   - GET /api/payments/stats - Estadísticas de pagos`);
    });
  } catch (error) {
    console.error('❌ [Payment Service] Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();
