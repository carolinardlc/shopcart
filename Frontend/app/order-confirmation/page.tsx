'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Truck, MapPin, Clock, Download, Share2 } from 'lucide-react';
import Confetti from 'react-confetti';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const mockOrderData = {
  orderNumber: 'SHC-2024-001234',
  orderDate: '2024-01-15T10:30:00Z',
  status: 'confirmed',
  items: [
    {
      id: 1,
      name: 'Auriculares Bluetooth Premium',
      price: 89.99,
      quantity: 1,
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      name: 'Mochila Deportiva Multifuncional',
      price: 45.99,
      quantity: 2,
      image: '/api/placeholder/80/80'
    }
  ],
  shipping: {
    method: 'express',
    address: 'Av. Arequipa 1234, Miraflores, Lima, Perú',
    estimatedDelivery: '2024-01-18'
  },
  payment: {
    method: 'card',
    last4: '1234',
    amount: 197.97
  },
  tracking: {
    number: 'TRK123456789',
    url: 'https://tracking.shopcart.com/TRK123456789'
  }
};

export default function OrderConfirmationPage() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [orderData] = useState(mockOrderData);
  const router = useRouter();

  useEffect(() => {
    // Detener confetti después de 5 segundos
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'processing':
        return 'Procesando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      default:
        return 'Desconocido';
    }
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mi pedido en ShopCart',
        text: `¡Acabo de realizar un pedido en ShopCart! Número de pedido: ${orderData.orderNumber}`,
        url: window.location.href
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const downloadInvoice = () => {
    // Simular descarga de factura
    console.log('Downloading invoice for order:', orderData.orderNumber);
    alert('Funcionalidad de descarga de factura implementada');
  };

  const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  const shipping = 15.99;

  return (
    <Container className="py-8">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header de confirmación */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600">
            Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
          </p>
        </div>

        {/* Información del pedido */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detalles del Pedido</CardTitle>
              <Badge className={getStatusColor(orderData.status)}>
                {getStatusText(orderData.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Número de pedido:</p>
                <p className="font-semibold">{orderData.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha del pedido:</p>
                <p className="font-semibold">{formatDate(orderData.orderDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Método de pago:</p>
                <p className="font-semibold">
                  Tarjeta terminada en {orderData.payment.last4}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total pagado:</p>
                <p className="font-semibold text-green-600">
                  S/{orderData.payment.amount.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seguimiento del envío */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Información de Envío
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Dirección de envío:</p>
                <p className="font-semibold">{orderData.shipping.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Método de envío:</p>
                <p className="font-semibold">
                  {orderData.shipping.method === 'express' ? 'Envío Express' : 'Envío Estándar'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Entrega estimada:</p>
                <p className="font-semibold">
                  {new Date(orderData.shipping.estimatedDelivery).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Número de seguimiento:</p>
                <p className="font-semibold">{orderData.tracking.number}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => window.open(orderData.tracking.url, '_blank')}
              >
                <Package className="h-4 w-4 mr-2" />
                Rastrear Pedido
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Productos del pedido */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Productos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">S/{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">S/{item.price.toFixed(2)} c/u</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>S/{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>S/{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IGV (18%):</span>
                <span>S/{tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>S/{orderData.payment.amount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Button onClick={downloadInvoice} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Descargar Factura
          </Button>
          <Button onClick={shareOrder} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button onClick={() => router.push('/shop')} variant="outline">
            Seguir Comprando
          </Button>
          <Button onClick={() => router.push('/orders')} variant="outline">
            Mis Pedidos
          </Button>
        </div>

        {/* Próximos pasos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximos Pasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold">Procesamiento del pedido</p>
                  <p className="text-sm text-gray-600">
                    Estamos preparando tu pedido para el envío (1-2 días hábiles)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold">Envío</p>
                  <p className="text-sm text-gray-600">
                    Tu pedido será enviado y recibirás un código de seguimiento
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold">Entrega</p>
                  <p className="text-sm text-gray-600">
                    Tu pedido llegará a la dirección especificada
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">¿Necesitas ayuda?</h3>
          <p className="text-sm text-gray-600 mb-2">
            Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos:
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span>📧 soporte@shopcart.com</span>
            <span>📞 +51 1 234-5678</span>
            <span>💬 Chat en vivo 24/7</span>
          </div>
        </div>
      </div>
    </Container>
  );
}
