'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  productId: number;
  productName?: string;
  quantity?: number;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName,
  quantity = 1,
  disabled = false,
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
  children
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (disabled || isAdding) return;

    setIsAdding(true);
    try {
      await addToCart(productId, quantity);
      
      // Mostrar mensaje de éxito
      const message = productName 
        ? `${productName} agregado al carrito exitosamente!`
        : 'Producto agregado al carrito exitosamente!';
      
      // Usar una notificación simple por ahora
      alert(message);
    } catch (error: any) {
      console.error('Error agregando al carrito:', error);
      alert(`Error: ${error.message || 'No se pudo agregar al carrito'}`);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      variant={variant}
      size={size}
      className={className}
    >
      {showIcon && !isAdding && <ShoppingCart className="w-4 h-4 mr-2" />}
      {isAdding ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Agregando...
        </>
      ) : (
        children || 'Agregar al carrito'
      )}
    </Button>
  );
};

export default AddToCartButton;
