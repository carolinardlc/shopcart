'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService, Product } from '@/lib/api';
import AddToCartButton from '@/components/AddToCartButton';

const HotDealPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await apiService.getProducts();
        if (response.success && response.data) {
          // Filtrar solo productos activos y tomar los primeros 8 para las ofertas
          const activeProducts = response.data.filter(product => product.is_active);
          setProducts(activeProducts.slice(0, 8));
        }
      } catch (err) {
        setError('Error al cargar los productos.');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Función para calcular precio con descuento
  const getDiscountedPrice = (price: string, discountPercent: number) => {
    const originalPrice = parseFloat(price);
    const discountedPrice = originalPrice * (1 - discountPercent / 100);
    return discountedPrice.toFixed(2);
  };

  // Generar descuentos aleatorios para cada producto
  const getRandomDiscount = (index: number) => {
    const discounts = [30, 40, 50, 60, 35, 45, 55, 25];
    return discounts[index % discounts.length];
  };

  if (isLoading) {
    return (
      <Container className="bg-shop-light-pink">
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ofertas...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="bg-shop-light-pink">
        <div className="py-20 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="bg-shop-light-pink">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔥 Hot Deals</h1>
          <p className="text-lg text-gray-600">
            ¡Ofertas especiales por tiempo limitado! No te pierdas estas increíbles oportunidades.
          </p>
        </div>

        {/* Banner principal de oferta */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold mb-2">¡Mega Sale!</h2>
              <p className="text-xl">Hasta 70% de descuento en productos seleccionados</p>
              <p className="text-sm mt-2 opacity-90">Válido hasta el 31 de Julio, 2025</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">70%</div>
              <div className="text-sm">OFF</div>
            </div>
          </div>
        </div>

        {/* Grid de productos en oferta */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => {
            const discountPercent = getRandomDiscount(index);
            const originalPrice = parseFloat(product.price);
            const discountedPrice = getDiscountedPrice(product.price, discountPercent);
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
                <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
                  -{discountPercent}%
                </Badge>
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">Imagen del producto</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-red-500">${discountedPrice}</span>
                    <span className="text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
                  </div>
                  <AddToCartButton
                    productId={product.id}
                    productName={product.name}
                    disabled={product.stock === 0}
                    size="sm"
                    className="w-full"
                  >
                    {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                  </AddToCartButton>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">¿No encontraste lo que buscabas?</h3>
          <p className="text-gray-600 mb-6">
            Suscríbete a nuestro newsletter y sé el primero en enterarte de nuevas ofertas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button>Suscribirse</Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HotDealPage;
