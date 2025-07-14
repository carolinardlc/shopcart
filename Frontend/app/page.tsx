'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/Container';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import TestApiComponent from '@/components/TestApiComponent';
import AddToCartButton from '@/components/AddToCartButton';
import { apiService, Product } from '@/lib/api';
import Link from 'next/link';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cargar productos destacados
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await apiService.getProducts();
        if (response.success && response.data) {
          // Tomar los primeros 4 productos activos como destacados
          const activeProducts = response.data.filter(product => product.is_active);
          setFeaturedProducts(activeProducts.slice(0, 4));
        }
      } catch (err) {
        console.error('Error cargando productos destacados:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
  <Container className=" bg-shop-light-pink">
    <h2 className="text-xl font-semibold mb-4">Home</h2>
    <p className="mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    
    {/* Componente de prueba para la conexión Backend-Frontend */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Prueba de Conexión Backend-Frontend</h3>
      <TestApiComponent />
    </div>

    {/* Productos Destacados */}
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Productos Destacados</h3>
        <Link href="/shop">
          <Button variant="outline">Ver todos</Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="bg-white">
              <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <span className="text-gray-500">Imagen del producto</span>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg truncate">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-green-600">${product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    
    <div className="text-center">
      <Link href="/cart">
        <Button size="lg">Ver Carrito</Button>
      </Link>
    </div>
  </Container>
  );
};

export default Home;