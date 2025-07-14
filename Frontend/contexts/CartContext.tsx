'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_description?: string;
  product_image?: string;
  quantity: number;
  price_at_time: string;
  subtotal: string;
  available_stock: number;
}

export interface Cart {
  id: number;
  user_id: number;
  status: string;
  total_amount: string;
  total_items: number;
  created_at: string;
  updated_at: string;
}

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Por ahora usamos un userId fijo, en producción esto vendría de la autenticación
  const userId = 1;

  const refreshCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getCart(userId);
      if (response.success && response.data) {
        setCart(response.data.cart);
        setItems(response.data.items || []);
      } else {
        const errorMsg = response.mensaje || response.message || 'Error al cargar el carrito';
        console.error('Cart API Error:', response);
        setError(`Error del servidor: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error('Error cargando carrito:', err);
      
      // Mejorar el mensaje de error basado en el tipo de error
      let errorMessage = 'Error al cargar el carrito';
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.';
      } else if (err.response) {
        errorMessage = `Error del servidor (${err.response.status}): ${err.response.data?.mensaje || err.response.data?.message || 'Error desconocido'}`;
      } else if (err.message) {
        errorMessage = `Error de conexión: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.addToCart(userId, productId, quantity);
      if (response.success) {
        await refreshCart();
      } else {
        setError(response.mensaje || response.message || 'Error al agregar al carrito');
        throw new Error(response.mensaje || response.message || 'Error al agregar al carrito');
      }
    } catch (err: any) {
      console.error('Error agregando al carrito:', err);
      setError(err.message || 'Error al agregar al carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.updateCartItem(userId, productId, quantity);
      if (response.success) {
        await refreshCart();
      } else {
        setError(response.mensaje || response.message || 'Error al actualizar cantidad');
        throw new Error(response.mensaje || response.message || 'Error al actualizar cantidad');
      }
    } catch (err: any) {
      console.error('Error actualizando cantidad:', err);
      setError(err.message || 'Error al actualizar cantidad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.removeFromCart(userId, productId);
      if (response.success) {
        await refreshCart();
      } else {
        setError(response.mensaje || response.message || 'Error al eliminar del carrito');
        throw new Error(response.mensaje || response.message || 'Error al eliminar del carrito');
      }
    } catch (err: any) {
      console.error('Error eliminando del carrito:', err);
      setError(err.message || 'Error al eliminar del carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.clearCart(userId);
      if (response.success) {
        setCart(null);
        setItems([]);
      } else {
        setError(response.mensaje || response.message || 'Error al limpiar carrito');
        throw new Error(response.mensaje || response.message || 'Error al limpiar carrito');
      }
    } catch (err: any) {
      console.error('Error limpiando carrito:', err);
      setError(err.message || 'Error al limpiar carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = (): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = (): number => {
    return items.reduce((total, item) => total + parseFloat(item.subtotal), 0);
  };

  // Cargar carrito al inicializar
  useEffect(() => {
    refreshCart();
  }, []);

  const value: CartContextType = {
    cart,
    items,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    getTotalItems,
    getTotalAmount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
