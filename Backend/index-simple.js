// index-simple.js - Versión simplificada para probar
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar conexión a base de datos
const { testConnection } = require('./database/connection');

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

// Rutas básicas
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'Hola desde el backend con PostgreSQL' });
});

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

// Ruta simple para obtener productos (sin modelo complejo)
app.get('/api/products/simple', async (req, res) => {
  try {
    const { query } = require('./database/connection');
    const result = await query('SELECT * FROM products LIMIT 10');
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo productos',
      error: error.message
    });
  }
});

// Ruta simple para obtener categorías
app.get('/api/categories/simple', async (req, res) => {
  try {
    const { query } = require('./database/connection');
    const result = await query('SELECT * FROM categories');
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo categorías',
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📚 Endpoints disponibles:`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Saludo: http://localhost:${PORT}/api/saludo`);
  console.log(`   - Products: http://localhost:${PORT}/api/products/simple`);
  console.log(`   - Categories: http://localhost:${PORT}/api/categories/simple`);
});
