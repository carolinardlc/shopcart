'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { 
    cart, 
    items, 
    loading, 
    error, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    getTotalItems,
    getTotalAmount 
  } = useCart();
  
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error: any) {
      alert(`Error al actualizar cantidad: ${error.message}`);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      setUpdatingItems(prev => new Set(prev).add(productId));
      try {
        await removeFromCart(productId);
      } catch (error: any) {
        alert(`Error al eliminar producto: ${error.message}`);
      } finally {
        setUpdatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    }
  };

  const handleClearCart = async () => {
    if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
      try {
        await clearCart();
      } catch (error: any) {
        alert(`Error al vaciar carrito: ${error.message}`);
      }
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    router.push('/checkout');
  };

  if (loading && !cart) {
    return (
      <Container>
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando carrito...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-20 text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md mx-auto">
            <p className="text-red-800">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Reintentar
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const totalItems = getTotalItems();
  const totalAmount = getTotalAmount();
  const tax = totalAmount * 0.18; // 18% IGV
  const finalTotal = totalAmount + tax;

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/shop">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar comprando
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
            <p className="text-gray-600">
              {totalItems > 0 ? `${totalItems} ${totalItems === 1 ? 'producto' : 'productos'} en tu carrito` : 'Tu carrito está vacío'}
            </p>
          </div>
        </div>

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-8">
              ¡Explora nuestros productos y encuentra algo que te guste!
            </p>
            <Link href="/shop">
              <Button size="lg">
                Explorar productos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Productos</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearCart}
                  disabled={loading}
                >
                  Vaciar carrito
                </Button>
              </div>

              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik02MCA2MEgxNDBWMTQwSDYwVjYwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                            <span className="text-gray-400 text-xs">Sin imagen</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{item.product_name}</h3>
                            {item.product_description && (
                              <p className="text-sm text-gray-600 line-clamp-2">{item.product_description}</p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveItem(item.product_id)}
                            disabled={updatingItems.has(item.product_id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItems.has(item.product_id)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {updatingItems.has(item.product_id) ? '...' : item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                              disabled={item.quantity >= item.available_stock || updatingItems.has(item.product_id)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              ${parseFloat(item.subtotal).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              ${parseFloat(item.price_at_time).toFixed(2)} c/u
                            </p>
                          </div>
                        </div>

                        {/* Stock info */}
                        {item.available_stock <= 5 && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-yellow-600">
                              Solo {item.available_stock} disponibles
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} productos)</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>IGV (18%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                    disabled={loading || items.length === 0}
                  >
                    {loading ? 'Procesando...' : 'Continuar con el pago'}
                  </Button>

                  <div className="text-center">
                    <Link href="/shop" className="text-sm text-gray-600 hover:text-gray-900">
                      Continuar comprando
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
