'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Ocultar confeti después de 5 segundos
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const orderNumber = `SHC-${Date.now()}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <Container>
      <div className="py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ¡Gracias por tu compra!
            </h1>
            <p className="text-xl text-gray-600">
              Tu pedido ha sido confirmado y será procesado pronto.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                Detalles del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Número de Pedido</p>
                <p className="text-xl font-semibold text-gray-900">{orderNumber}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">Estado del Pedido</p>
                  <p className="font-semibold text-green-600">Confirmado</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">Entrega Estimada</p>
                  <p className="font-semibold">
                    {estimatedDelivery.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                <p className="font-medium text-blue-800 mb-2">📧 Confirmación por Email</p>
                <p>Hemos enviado los detalles de tu pedido a tu correo electrónico.</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="w-full sm:w-auto">
                  <Home className="w-5 h-5 mr-2" />
                  Volver al Inicio
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Seguir Comprando
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-gray-600 space-y-2 mt-8">
              <p>✓ Tu pedido será empacado con cuidado</p>
              <p>✓ Recibirás notificaciones de seguimiento</p>
              <p>✓ Envío gratuito incluido</p>
              <p>✓ Garantía de satisfacción 30 días</p>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                ¿Tienes preguntas sobre tu pedido?{' '}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  Contáctanos
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confetti Effect (Optional) */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}
    </Container>
  );
}
