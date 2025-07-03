// models/Category.js
const { query } = require('../database/connection');

class Category {
  
  // Obtener todas las categorías
  static async getAll() {
    const sql = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      GROUP BY c.id, c.name, c.description, c.created_at, c.updated_at
      ORDER BY c.name ASC
    `;
    
    const result = await query(sql);
    return result.rows;
  }
  
  // Obtener una categoría por ID
  static async getById(id) {
    const sql = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.id = $1
      GROUP BY c.id, c.name, c.description, c.created_at, c.updated_at
    `;
    
    const result = await query(sql, [id]);
    return result.rows[0];
  }
  
  // Crear una nueva categoría
  static async create(categoryData) {
    const { name, description } = categoryData;
    
    const sql = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const result = await query(sql, [name, description]);
    return result.rows[0];
  }
  
  // Actualizar una categoría
  static async update(id, updateData) {
    const { name, description } = updateData;
    
    const sql = `
      UPDATE categories 
      SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await query(sql, [name, description, id]);
    return result.rows[0];
  }
  
  // Eliminar una categoría
  static async delete(id) {
    // Verificar si tiene productos asociados
    const checkSql = 'SELECT COUNT(*) as count FROM products WHERE category_id = $1 AND is_active = true';
    const checkResult = await query(checkSql, [id]);
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
    }
    
    const sql = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const result = await query(sql, [id]);
    return result.rows[0];
  }
  
  // Obtener productos de una categoría
  static async getProducts(categoryId, filters = {}) {
    let sql = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.image_url,
        p.is_active,
        p.created_at
      FROM products p
      WHERE p.category_id = $1 AND p.is_active = true
    `;
    
    const params = [categoryId];
    let paramCount = 1;
    
    // Filtro por disponibilidad en stock
    if (filters.in_stock) {
      sql += ` AND p.stock > 0`;
    }
    
    // Ordenamiento
    const orderBy = filters.order_by || 'created_at';
    const orderDirection = filters.order_direction || 'DESC';
    sql += ` ORDER BY p.${orderBy} ${orderDirection}`;
    
    const result = await query(sql, params);
    return result.rows;
  }
}

module.exports = Category;
