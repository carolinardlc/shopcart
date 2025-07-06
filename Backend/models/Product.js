// models/Product.js
const { query } = require('../database/connection');

class Product {
  
  // Obtener todos los productos con información de categoría
  static async getAll(filters = {}) {
    let sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.image_url,
        p.is_active,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.id as category_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    
    const params = [];
    let paramCount = 0;
    
    // Filtro por categoría
    if (filters.category_id) {
      paramCount++;
      sql += ` AND p.category_id = $${paramCount}`;
      params.push(filters.category_id);
    }
    
    // Filtro por disponibilidad en stock
    if (filters.in_stock) {
      sql += ` AND p.stock > 0`;
    }
    
    // Filtro por búsqueda de texto
    if (filters.search) {
      paramCount++;
      sql += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
    }
    
    sql += ` ORDER BY p.created_at DESC`;
    
    // Paginación
    if (filters.limit) {
      paramCount++;
      sql += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
      
      if (filters.offset) {
        paramCount++;
        sql += ` OFFSET $${paramCount}`;
        params.push(filters.offset);
      }
    }
    
    const result = await query(sql, params);
    return result.rows;
  }
  
  // Obtener un producto por ID
  static async getById(id) {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.image_url,
        p.is_active,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.id as category_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0];
  }
  
  // Crear un nuevo producto
  static async create(productData) {
    const { name, description, price, stock, category_id, image_url } = productData;
    
    const sql = `
      INSERT INTO products (name, description, price, stock, category_id, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await query(sql, [name, description, price, stock, category_id, image_url]);
    
    // Registrar movimiento de stock inicial
    if (stock > 0) {
      await this.recordStockMovement(result.rows[0].id, 'IN', stock, 0, stock, 'Stock inicial');
    }
    
    return result.rows[0];
  }
  
  // Actualizar un producto
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 0;
    
    // Construir query dinámicamente basado en los campos a actualizar
    const allowedFields = ['name', 'description', 'price', 'category_id', 'image_url', 'is_active'];
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        paramCount++;
        fields.push(`${field} = $${paramCount}`);
        values.push(updateData[field]);
      }
    }
    
    if (fields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }
    
    // Siempre actualizar updated_at
    paramCount++;
    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    
    paramCount++;
    values.push(id);
    
    const sql = `
      UPDATE products 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  }
  
  // Actualizar stock de un producto
  static async updateStock(id, newStock, reason = 'Actualización manual') {
    // Obtener stock actual
    const currentProduct = await this.getById(id);
    if (!currentProduct) {
      throw new Error('Producto no encontrado');
    }
    
    const previousStock = currentProduct.stock;
    const movementType = newStock > previousStock ? 'IN' : newStock < previousStock ? 'OUT' : 'ADJUSTMENT';
    const quantity = Math.abs(newStock - previousStock);
    
    // Actualizar stock
    const sql = 'UPDATE products SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await query(sql, [newStock, id]);
    
    // Registrar movimiento de stock
    await this.recordStockMovement(id, movementType, quantity, previousStock, newStock, reason);
    
    return result.rows[0];
  }
  
  // Registrar movimiento de stock
  static async recordStockMovement(productId, movementType, quantity, previousStock, newStock, reason) {
    const sql = `
      INSERT INTO stock_movements (product_id, movement_type, quantity, previous_stock, new_stock, reason)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await query(sql, [productId, movementType, quantity, previousStock, newStock, reason]);
    return result.rows[0];
  }
  
  // Obtener historial de movimientos de stock
  static async getStockMovements(productId, limit = 50) {
    const sql = `
      SELECT 
        sm.*,
        p.name as product_name
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      WHERE sm.product_id = $1
      ORDER BY sm.created_at DESC
      LIMIT $2
    `;
    
    const result = await query(sql, [productId, limit]);
    return result.rows;
  }
  
  // Eliminar un producto (soft delete)
  static async delete(id) {
    const sql = `
      UPDATE products 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0];
  }
  
  // Obtener productos con bajo stock
  static async getLowStock(threshold = 10) {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.stock,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stock <= $1 AND p.is_active = true
      ORDER BY p.stock ASC
    `;
    
    const result = await query(sql, [threshold]);
    return result.rows;
  }
  
  // Obtener estadísticas de productos
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN stock > 0 THEN 1 END) as in_stock_products,
        COUNT(CASE WHEN stock = 0 THEN 1 END) as out_of_stock_products,
        ROUND(AVG(price), 2) as average_price,
        SUM(stock) as total_stock_units
      FROM products 
      WHERE is_active = true
    `;
    
    const result = await query(sql);
    return result.rows[0];
  }
}

module.exports = Product;
