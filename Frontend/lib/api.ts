// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const CART_API_URL = 'http://localhost:5003/api'; // Cart service directo

export interface ApiResponse<T = any> {
  mensaje?: string;
  message?: string;
  data?: T;
  success?: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  category_id?: number;
  category_name?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

class ApiService {
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // GET request
  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  // POST request
  async post<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Métodos específicos para tu backend
  async getSaludo(): Promise<ApiResponse> {
    return this.get('/saludo');
  }

  async enviarDatos(datos: any): Promise<ApiResponse> {
    return this.post('/datos', datos);
  }

  // Health check
  async getHealth(): Promise<ApiResponse> {
    return this.get('/health');
  }

  // API Info
  async getInfo(): Promise<ApiResponse> {
    return this.get('/info');
  }

  // Products endpoints
  async getProducts(): Promise<ProductsResponse> {
    return this.get('/products');
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return this.get(`/products/${id}`);
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Product>> {
    return this.post('/products', product);
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.put(`/products/${id}`, product);
  }

  async deleteProduct(id: number): Promise<ApiResponse> {
    return this.delete(`/products/${id}`);
  }

  async updateStock(id: number, quantity: number, reason?: string): Promise<ApiResponse> {
    return this.post(`/products/${id}/stock`, { quantity, reason });
  }

  // Categories endpoints
  async getCategories(): Promise<CategoriesResponse> {
    return this.get('/categories');
  }

  async getCategory(id: number): Promise<ApiResponse<Category>> {
    return this.get(`/categories/${id}`);
  }

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Category>> {
    return this.post('/categories', category);
  }

  async updateCategory(id: number, category: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.put(`/categories/${id}`, category);
  }

  async deleteCategory(id: number): Promise<ApiResponse> {
    return this.delete(`/categories/${id}`);
  }

  // Cart endpoints (usando cart-service directo)
  async getCart(userId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${CART_API_URL}/cart/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error;
    }
  }

  async addToCart(userId: number, productId: number, quantity: number = 1): Promise<ApiResponse> {
    try {
      const response = await fetch(`${CART_API_URL}/cart/${userId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity })
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateCartItem(userId: number, productId: number, quantity: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${CART_API_URL}/cart/${userId}/items/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  async removeFromCart(userId: number, productId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${CART_API_URL}/cart/${userId}/items/product/${productId}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async clearCart(userId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`${CART_API_URL}/cart/${userId}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Payment endpoints
  async createOrder(userId: number, orderData: any): Promise<ApiResponse> {
    return this.post(`/payments/orders`, { user_id: userId, ...orderData });
  }

  async processPayment(orderId: number, paymentData: any): Promise<ApiResponse> {
    return this.post(`/payments/process`, { order_id: orderId, ...paymentData });
  }

  async getOrder(orderId: number): Promise<ApiResponse> {
    return this.get(`/payments/orders/${orderId}`);
  }
}

export const apiService = new ApiService();
export default apiService;
