import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactPage = () => {
  return (
    <Container className="bg-shop-light-pink">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contáctanos</h1>
          <p className="text-lg text-gray-600">
            Estamos aquí para ayudarte. No dudes en contactarnos por cualquier consulta.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulario de contacto */}
          <Card>
            <CardHeader>
              <CardTitle>Envíanos un mensaje</CardTitle>
              <CardDescription>
                Completa el formulario y te responderemos lo antes posible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    Nombre *
                  </label>
                  <Input
                    id="firstName"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Apellido *
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Teléfono
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Asunto *
                </label>
                <Input
                  id="subject"
                  placeholder="¿En qué podemos ayudarte?"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Mensaje *
                </label>
                <Textarea
                  id="message"
                  placeholder="Escribe tu mensaje aquí..."
                  rows={5}
                  required
                />
              </div>

              <Button className="w-full">
                Enviar mensaje
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Al enviar este formulario, aceptas nuestros términos de privacidad.
              </p>
            </CardContent>
          </Card>

          {/* Información de contacto */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de contacto</CardTitle>
                <CardDescription>
                  Múltiples formas de ponerte en contacto con nosotros.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">info@shopcart.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Phone className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <MapPin className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium">Dirección</p>
                    <p className="text-sm text-gray-600">
                      123 Shopping Street<br />
                      Ciudad, Estado 12345<br />
                      País
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Horarios de atención</p>
                    <p className="text-sm text-gray-600">
                      Lunes - Viernes: 9:00 AM - 6:00 PM<br />
                      Sábados: 10:00 AM - 4:00 PM<br />
                      Domingos: Cerrado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ rápido */}
            <Card>
              <CardHeader>
                <CardTitle>Preguntas frecuentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">¿Cuánto tiempo tarda en llegar mi pedido?</h3>
                  <p className="text-sm text-gray-600">
                    Los pedidos estándar tardan entre 3-5 días hábiles. Los envíos express llegan en 1-2 días.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">¿Puedo devolver un producto?</h3>
                  <p className="text-sm text-gray-600">
                    Sí, aceptamos devoluciones dentro de los 30 días posteriores a la compra.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">¿Ofrecen envío gratuito?</h3>
                  <p className="text-sm text-gray-600">
                    Ofrecemos envío gratuito en pedidos superiores a $50.
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  Ver todas las preguntas frecuentes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mapa placeholder */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Nuestra ubicación</CardTitle>
              <CardDescription>
                Visítanos en nuestra tienda física
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Mapa de ubicación</p>
                  <p className="text-sm text-gray-400">
                    Aquí iría integrado Google Maps o similar
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ContactPage;
