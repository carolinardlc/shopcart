'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, Heart, Share2, MessageSquare, Users } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  emotions: string[];
  isShared?: boolean;
}

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Auriculares Bluetooth Premium',
    price: 89.99,
    image: '/api/placeholder/200/200',
    quantity: 1,
    category: 'Tecnología',
    emotions: ['happy', 'excited'],
    isShared: false
  },
  {
    id: 2,
    name: 'Mochila Deportiva Multifuncional',
    price: 45.99,
    image: '/api/placeholder/200/200',
    quantity: 2,
    category: 'Deportes',
    emotions: ['motivated', 'adventurous'],
    isShared: true
  },
  {
    id: 3,
    name: 'Set de Aromas Relajantes',
    price: 32.99,
    image: '/api/placeholder/200/200',
    quantity: 1,
    category: 'Hogar',
    emotions: ['calm', 'romantic'],
    isShared: false
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [isSharedCart, setIsSharedCart] = useState(false);
  const [sharedWith, setSharedWith] = useState<string[]>(['maria@example.com']);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const moveToFavorites = (id: number) => {
    // Implementar lógica para mover a favoritos
    console.log('Moved to favorites:', id);
    removeItem(id);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // IGV 18%
  const total = subtotal + tax - discount;

  const shareCart = () => {
    setIsSharedCart(true);
    // Implementar lógica para compartir carrito
    console.log('Cart shared with:', sharedWith);
  };

  const applyCoupon = () => {
    // Simular aplicación de cupón
    if (couponCode.toLowerCase() === 'descuento10') {
      setDiscount(subtotal * 0.1);
    }
  };

  const proceedToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Carrito de Compras</h1>
          <div className="flex items-center gap-2">
            {isSharedCart && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Carrito Compartido
              </Badge>
            )}
            <Button variant="outline" onClick={shareCart}>
              <Share2 className="h-4 w-4 mr-2" />
              {isSharedCart ? 'Gestionar' : 'Compartir'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items del carrito */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Productos ({cartItems.length})</span>
                  {isSharedCart && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      3 comentarios
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{item.category}</Badge>
                        {item.isShared && (
                          <Badge variant="secondary" className="text-xs">
                            Compartido
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Emociones: {item.emotions.join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">S/{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">S/{item.price.toFixed(2)} c/u</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveToFavorites(item.id)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {cartItems.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🛒</div>
                    <p className="text-gray-600">Tu carrito está vacío</p>
                    <Button className="mt-4" onClick={() => router.push('/shop')}>
                      Continuar comprando
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Carrito colaborativo */}
            {isSharedCart && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Colaboradores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sharedWith.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{email}</span>
                        <Badge variant="outline">Editor</Badge>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input placeholder="Agregar por email..." className="flex-1" />
                      <Button>Invitar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>S/{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IGV (18%):</span>
                    <span>S/{tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span>-S/{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>S/{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código de cupón"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={applyCoupon}>
                      Aplicar
                    </Button>
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-green-600">
                      ¡Cupón aplicado! Ahorraste S/{discount.toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full"
                    onClick={proceedToCheckout}
                    disabled={cartItems.length === 0}
                  >
                    Proceder al Pago
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/shop')}
                  >
                    Continuar Comprando
                  </Button>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>✓ Envío gratuito en compras mayores a S/100</p>
                  <p>✓ Devoluciones gratuitas hasta 30 días</p>
                  <p>✓ Pago seguro con SSL</p>
                </div>
              </CardContent>
            </Card>

            {/* Productos recomendados */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Productos Recomendados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 border rounded">
                    <img
                      src="/api/placeholder/50/50"
                      alt="Producto recomendado"
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cargador Inalámbrico</p>
                      <p className="text-xs text-gray-600">S/39.99</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 p-2 border rounded">
                    <img
                      src="/api/placeholder/50/50"
                      alt="Producto recomendado"
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Botella de Agua</p>
                      <p className="text-xs text-gray-600">S/25.99</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
