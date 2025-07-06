// routes/products.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET /api/products/stats/low-stock - Productos con bajo stock (debe ir antes de /:id)
router.get('/stats/low-stock', async (req, res) => {
  try {
    const threshold = req.query.threshold ? parseInt(req.query.threshold) : 10;
    const lowStockProducts = await Product.getLowStock(threshold);
    
    res.json({
      success: true,
      data: lowStockProducts,
      count: lowStockProducts.length,
      threshold
    });
  } catch (error) {
    console.error('Error obteniendo productos con bajo stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/products/stats/overview - Estadísticas generales de productos
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Product.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/products - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const filters = {
      category_id: req.query.category,
      in_stock: req.query.in_stock === 'true',
      search: req.query.search,
      limit: req.query.limit ? parseInt(req.query.limit) : null,
      offset: req.query.offset ? parseInt(req.query.offset) : null
    };
    
    const products = await Product.getAll(filters);
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/products/:id - Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }
    
    const product = await Product.getById(parseInt(id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/products - Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock, category_id, image_url } = req.body;
    
    // Validaciones básicas
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y precio son requeridos'
      });
    }
    
    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio no puede ser negativo'
      });
    }
    
    if (stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'El stock no puede ser negativo'
      });
    }
    
    const productData = {
      name,
      description: description || null,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      category_id: category_id ? parseInt(category_id) : null,
      image_url: image_url || null
    };
    
    const newProduct = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: newProduct
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
