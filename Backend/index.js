// backend/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar conexión a base de datos y rutas
const { testConnection } = require('./database/connection');
const { createTables, insertSampleData } = require('./database/schema');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas originales (mantenidas para compatibilidad)
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'Hola desde el backend con PostgreSQL' });
});

app.post('/api/datos', (req, res) => {
  const datos = req.body;
  console.log('Datos recibidos:', datos);
  res.json({ mensaje: 'Datos recibidos correctamente' });
});

// Nuevas rutas de la API
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

// Ruta de información de la API
app.get('/api/info', (req, res) => {
  res.json({
    name: 'ShopCart API',
    version: '1.0.0',
    description: 'API REST para gestión de productos y categorías',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      health: '/api/health'
    }
  });
});

// Ruta de health check
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'Connected' : 'Disconnected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'Error',
      error: error.message
    });
  }
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    path: req.originalUrl
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    console.log('🔧 Verificando conexión a base de datos...');
    
    // Probar conexión
    const connected = await testConnection();
    if (!connected) {
      throw new Error('No se pudo conectar a la base de datos');
    }
    
    // NOTA: Las tablas ya están creadas por setup-database.sql
    // No es necesario crear tablas ni insertar datos aquí
    
    console.log('✅ Conexión a base de datos verificada');
    return true;
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error.message);
    return false;
  }
};

// Iniciar servidor
const startServer = async () => {
  try {
    // Inicializar base de datos
    const dbInitialized = await initializeDatabase();
    
    if (!dbInitialized) {
      console.log('⚠️ Servidor iniciado sin conexión a base de datos');
    } else {
      console.log('✅ Servidor iniciado con base de datos conectada');
    }
    
    // Iniciar servidor HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📚 Documentación de API disponible en:`);
      console.log(`   - Info: http://localhost:${PORT}/api/info`);
      console.log(`   - Health: http://localhost:${PORT}/api/health`);
      console.log(`   - Products: http://localhost:${PORT}/api/products`);
      console.log(`   - Categories: http://localhost:${PORT}/api/categories`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando servidor...');
  process.exit(0);
});

// Iniciar aplicación
startServer();
