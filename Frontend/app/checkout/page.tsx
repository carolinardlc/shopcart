'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Truck, Shield, MapPin, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { apiService } from '@/lib/api';
import Link from 'next/link';

interface CheckoutData {
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment: {
    method: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardName: string;
    paypalEmail?: string;
    cryptoWallet?: string;
  };
  shipping_method: string;
  gift_message?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalAmount, clearCart } = useCart();
  
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'PE'
    },
    payment: {
      method: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: '',
      paypalEmail: '',
      cryptoWallet: ''
    },
    shipping_method: 'standard',
    gift_message: ''
  });

  const [isGift, setIsGift] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calcular totales usando el carrito real
  const subtotal = getTotalAmount();
  const tax = subtotal * 0.18;
  const shippingCost = checkoutData.shipping_method === 'express' ? 15.99 : 5.99;
  const total = subtotal + tax + shippingCost;

  // Redirigir si el carrito está vacío
  if (items.length === 0) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">Agrega algunos productos antes de proceder al pago.</p>
          <Link href="/shop">
            <Button>Ir a la tienda</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const handleInputChange = (section: 'shipping' | 'payment', field: string, value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar datos requeridos
      const { shipping, payment } = checkoutData;
      if (!shipping.firstName || !shipping.lastName || !shipping.email || !shipping.address) {
        alert('Por favor, completa todos los campos requeridos de envío.');
        setIsLoading(false);
        return;
      }

      if (payment.method === 'card' && (!payment.cardNumber || !payment.expiryDate || !payment.cvv || !payment.cardName)) {
        alert('Por favor, completa todos los campos de la tarjeta.');
        setIsLoading(false);
        return;
      }

      // Crear orden usando el API real
      const orderData = {
        shipping_info: checkoutData.shipping,
        payment_info: {
          method: checkoutData.payment.method,
          // No enviamos datos sensibles reales de tarjeta al backend
          ...(checkoutData.payment.method !== 'card' && {
            details: checkoutData.payment
          })
        },
        shipping_method: checkoutData.shipping_method,
        gift_message: isGift ? checkoutData.gift_message : null,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: parseFloat(item.price_at_time)
        })),
        totals: {
          subtotal,
          tax,
          shipping: shippingCost,
          total
        }
      };

      // Por ahora simulamos el proceso, en producción usarías el API real
      console.log('Order data to be sent:', orderData);
      
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Vaciar carrito después del éxito
      await clearCart();
      
      // Redirigir a página de confirmación
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de checkout */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información de envío */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Información de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={checkoutData.shipping.firstName}
                        onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        value={checkoutData.shipping.lastName}
                        onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={checkoutData.shipping.email}
                        onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={checkoutData.shipping.phone}
                        onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={checkoutData.shipping.address}
                      onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={checkoutData.shipping.city}
                        onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Departamento</Label>
                      <Select value={checkoutData.shipping.state} onValueChange={(value: string) => handleInputChange('shipping', 'state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lima">Lima</SelectItem>
                          <SelectItem value="arequipa">Arequipa</SelectItem>
                          <SelectItem value="cusco">Cusco</SelectItem>
                          <SelectItem value="trujillo">Trujillo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Código Postal</Label>
                      <Input
                        id="zipCode"
                        value={checkoutData.shipping.zipCode}
                        onChange={(e) => handleInputChange('shipping', 'zipCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="saveAddress" 
                      checked={saveAddress}
                      onCheckedChange={(checked: boolean) => setSaveAddress(checked as boolean)}
                    />
                    <Label htmlFor="saveAddress">Guardar esta dirección para futuras compras</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Método de envío */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de Envío</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={checkoutData.shipping_method} 
                    onValueChange={(value: string) => setCheckoutData(prev => ({...prev, shipping_method: value}))}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded">
                      <RadioGroupItem value="standard" id="standard" />
                      <div className="flex-1">
                        <Label htmlFor="standard" className="font-medium">Envío Estándar</Label>
                        <p className="text-sm text-gray-600">5-7 días hábiles</p>
                      </div>
                      <span className="font-semibold">S/5.99</span>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded">
                      <RadioGroupItem value="express" id="express" />
                      <div className="flex-1">
                        <Label htmlFor="express" className="font-medium">Envío Express</Label>
                        <p className="text-sm text-gray-600">2-3 días hábiles</p>
                      </div>
                      <span className="font-semibold">S/15.99</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Método de pago */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup 
                    value={checkoutData.payment.method} 
                    onValueChange={(value: string) => handleInputChange('payment', 'method', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Tarjeta de Crédito/Débito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="crypto" id="crypto" />
                      <Label htmlFor="crypto">Criptomonedas</Label>
                    </div>
                  </RadioGroup>

                  {checkoutData.payment.method === 'card' && (
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={checkoutData.payment.cardNumber}
                          onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/AA"
                            value={checkoutData.payment.expiryDate}
                            onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={checkoutData.payment.cvv}
                            onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input
                          id="cardName"
                          value={checkoutData.payment.cardName}
                          onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {checkoutData.payment.method === 'paypal' && (
                    <div className="pt-4">
                      <Label htmlFor="paypalEmail">Email de PayPal</Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        value={checkoutData.payment.paypalEmail}
                        onChange={(e) => handleInputChange('payment', 'paypalEmail', e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {checkoutData.payment.method === 'crypto' && (
                    <div className="pt-4">
                      <Label htmlFor="cryptoWallet">Dirección de Wallet</Label>
                      <Input
                        id="cryptoWallet"
                        value={checkoutData.payment.cryptoWallet}
                        onChange={(e) => handleInputChange('payment', 'cryptoWallet', e.target.value)}
                        required
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Aceptamos Bitcoin, Ethereum y otras criptomonedas principales
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Opciones adicionales */}
              <Card>
                <CardHeader>
                  <CardTitle>Opciones Adicionales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isGift" 
                      checked={isGift}
                      onCheckedChange={(checked: boolean) => setIsGift(checked as boolean)}
                    />
                    <Label htmlFor="isGift">Este es un regalo</Label>
                  </div>

                  {isGift && (
                    <div>
                      <Label htmlFor="giftMessage">Mensaje de Regalo</Label>
                      <Input
                        id="giftMessage"
                        placeholder="Escribe tu mensaje aquí..."
                        value={checkoutData.gift_message}
                        onChange={(e) => setCheckoutData(prev => ({...prev, gift_message: e.target.value}))}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Resumen del Pedido</span>
                  <Link href="/cart">
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik02MCA2MEgxNDBWMTQwSDYwVjYwWiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                            <span className="text-gray-400 text-xs">Sin imagen</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.product_name}</p>
                        <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                        <p className="text-xs text-gray-600">${parseFloat(item.price_at_time).toFixed(2)} c/u</p>
                      </div>
                      <span className="text-sm font-semibold">
                        ${parseFloat(item.subtotal).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IGV (18%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Procesando...' : 'Realizar Pago'}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Pago seguro con cifrado SSL</span>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>✓ Garantía de satisfacción del 100%</p>
                  <p>✓ Devoluciones gratuitas hasta 30 días</p>
                  <p>✓ Soporte 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
