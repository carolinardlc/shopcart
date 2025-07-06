// routes/categories.js
const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

// GET /api/categories - Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categories = await Category.getAll();
    
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/categories/:id - Obtener una categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de categoría inválido'
      });
    }
    
    const category = await Category.getById(parseInt(id));
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/categories/:id/products - Obtener productos de una categoría
router.get('/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de categoría inválido'
      });
    }
    
    const filters = {
      in_stock: req.query.in_stock === 'true',
      order_by: req.query.order_by || 'created_at',
      order_direction: req.query.order_direction || 'DESC'
    };
    
    const products = await Category.getProducts(parseInt(id), filters);
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error obteniendo productos de categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/categories - Crear una nueva categoría
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validaciones básicas
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría es requerido'
      });
    }
    
    const categoryData = {
      name: name.trim(),
      description: description ? description.trim() : null
    };
    
    const newCategory = await Category.create(categoryData);
    
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: newCategory
    });
  } catch (error) {
    console.error('Error creando categoría:', error);
    
    // Manejar error de nombre duplicado
    if (error.code === '23505') { // PostgreSQL unique violation
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

// PUT /api/categories/:id - Actualizar una categoría
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de categoría inválido'
      });
    }
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría es requerido'
      });
    }
    
    const updateData = {
      name: name.trim(),
      description: description ? description.trim() : null
    };
    
    const updatedCategory = await Category.update(parseInt(id), updateData);
    
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    
    // Manejar error de nombre duplicado
    if (error.code === '23505') { // PostgreSQL unique violation
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

// DELETE /api/categories/:id - Eliminar una categoría
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de categoría inválido'
      });
    }
    
    const deletedCategory = await Category.delete(parseInt(id));
    
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente',
      data: deletedCategory
    });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    
    if (error.message.includes('productos asociados')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
