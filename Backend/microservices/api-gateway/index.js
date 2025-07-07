// API Gateway - Punto de entrada único para todos los microservicios
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

// Middleware de seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Demasiadas solicitudes desde esta IP, inténtalo más tarde.',
    retryAfter: '15 minutos'
  }
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// CORS configurado
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración de servicios
const services = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:5001',
  product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002',
  cart: process.env.CART_SERVICE_URL || 'http://localhost:5003',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5004',
  category: process.env.CATEGORY_SERVICE_URL || 'http://localhost:5005'
};

// Middleware de autenticación JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acceso requerido' 
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'shopcart_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      });
    }
    req.user = user;
    next();
  });
};

// Middleware para rutas públicas vs privadas
const isPublicRoute = (path, method) => {
  const publicRoutes = [
    '/api/health',
    '/api/info',
    '/api/saludo',
    '/api/users/auth/google',
    '/api/users/auth/google/callback',
    '/api/users/auth/status',
    '/auth/failure'
  ];
  
  // Rutas públicas específicas
  if (publicRoutes.includes(path)) return true;
  
  // Productos y categorías son públicos para GET
  if (method === 'GET' && (path.startsWith('/api/products') || path.startsWith('/api/categories'))) {
    return true;
  }
  
  return false;
};

// Aplicar autenticación selectiva
app.use((req, res, next) => {
  if (isPublicRoute(req.path, req.method)) {
    next();
  } else {
    authenticateToken(req, res, next);
  }
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`[API Gateway] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check del gateway con verificación de servicios
app.get('/api/health', async (req, res) => {
  const serviceHealths = {};
  
  for (const [serviceName, serviceUrl] of Object.entries(services)) {
    try {
      const axios = require('axios');
      // Mapear nombres de servicios a endpoints correctos
      const endpointMap = {
        'user': 'users',
        'product': 'products', 
        'cart': 'cart',
        'payment': 'payments',
        'category': 'categories'
      };
      const endpoint = endpointMap[serviceName] || serviceName;
      const response = await axios.get(`${serviceUrl}/api/${endpoint}/health`, {
        timeout: 5000
      });
      serviceHealths[serviceName] = {
        status: 'OK',
        url: serviceUrl,
        responseTime: response.headers['x-response-time'] || 'N/A'
      };
    } catch (error) {
      serviceHealths[serviceName] = {
        status: 'ERROR',
        url: serviceUrl,
        error: error.message
      };
    }
  }
  
  const allHealthy = Object.values(serviceHealths).every(service => service.status === 'OK');
  
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'OK' : 'DEGRADED',
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
    services: serviceHealths,
    uptime: process.uptime()
  });
});

// Información del gateway
app.get('/api/info', (req, res) => {
  res.json({
    name: 'ShopCart API Gateway',
    version: '1.0.0',
    description: 'Gateway de microservicios para gestión de e-commerce',
    architecture: 'Microservicios',
    services: {
      'users': '/api/users',
      'products': '/api/products', 
      'cart': '/api/cart',
      'payments': '/api/payments',
      'categories': '/api/categories'
    },
    endpoints: {
      health: '/api/health',
      info: '/api/info'
    }
  });
});

// Proxy a microservicios
app.use('/api/users', createProxyMiddleware({
  target: services.user,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/users' },
  onError: (err, req, res) => {
    console.error('[API Gateway] Error en User Service:', err.message);
    res.status(503).json({ error: 'User Service no disponible' });
  }
}));

app.use('/api/products', createProxyMiddleware({
  target: services.product,
  changeOrigin: true,
  pathRewrite: { '^/api/products': '/api/products' },
  onError: (err, req, res) => {
    console.error('[API Gateway] Error en Product Service:', err.message);
    res.status(503).json({ error: 'Product Service no disponible' });
  }
}));

app.use('/api/cart', createProxyMiddleware({
  target: services.cart,
  changeOrigin: true,
  pathRewrite: { '^/api/cart': '/api/cart' },
  onError: (err, req, res) => {
    console.error('[API Gateway] Error en Cart Service:', err.message);
    res.status(503).json({ error: 'Cart Service no disponible' });
  }
}));

app.use('/api/payments', createProxyMiddleware({
  target: services.payment,
  changeOrigin: true,
  pathRewrite: { '^/api/payments': '/api/payments' },
  onError: (err, req, res) => {
    console.error('[API Gateway] Error en Payment Service:', err.message);
    res.status(503).json({ error: 'Payment Service no disponible' });
  }
}));

app.use('/api/categories', createProxyMiddleware({
  target: services.category,
  changeOrigin: true,
  pathRewrite: { '^/api/categories': '/api/categories' },
  onError: (err, req, res) => {
    console.error('[API Gateway] Error en Category Service:', err.message);
    res.status(503).json({ error: 'Category Service no disponible' });
  }
}));

// Endpoints legacy para compatibilidad
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'Hola desde el API Gateway con arquitectura de microservicios' });
});

app.post('/api/datos', (req, res) => {
  const datos = req.body;
  console.log('[API Gateway] Datos recibidos:', datos);
  res.json({ mensaje: 'Datos recibidos correctamente en el Gateway' });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado en el Gateway',
    path: req.originalUrl,
    availableServices: Object.keys(services)
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('[API Gateway] Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del Gateway',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 [API Gateway] Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📚 [API Gateway] Documentación disponible en:`);
  console.log(`   - Info: http://localhost:${PORT}/api/info`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`🔧 [API Gateway] Servicios configurados:`);
  Object.entries(services).forEach(([name, url]) => {
    console.log(`   - ${name}: ${url}`);
  });
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 [API Gateway] Cerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 [API Gateway] Cerrando servidor...');
  process.exit(0);
});
