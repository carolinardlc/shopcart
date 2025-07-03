import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HotDealPage = () => {
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
          {/* Producto 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
              -50%
            </Badge>
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Camiseta Premium</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-red-500">$25.00</span>
                <span className="text-sm text-gray-500 line-through">$50.00</span>
              </div>
              <Button className="w-full" size="sm">
                Agregar al carrito
              </Button>
            </div>
          </div>

          {/* Producto 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
              -40%
            </Badge>
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Jeans Clásicos</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-red-500">$36.00</span>
                <span className="text-sm text-gray-500 line-through">$60.00</span>
              </div>
              <Button className="w-full" size="sm">
                Agregar al carrito
              </Button>
            </div>
          </div>

          {/* Producto 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
              -60%
            </Badge>
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Chaqueta de Cuero</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-red-500">$80.00</span>
                <span className="text-sm text-gray-500 line-through">$200.00</span>
              </div>
              <Button className="w-full" size="sm">
                Agregar al carrito
              </Button>
            </div>
          </div>

          {/* Producto 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
              -35%
            </Badge>
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Sneakers Deportivos</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-red-500">$65.00</span>
                <span className="text-sm text-gray-500 line-through">$100.00</span>
              </div>
              <Button className="w-full" size="sm">
                Agregar al carrito
              </Button>
            </div>
          </div>

          {/* Producto 5 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
              -45%
            </Badge>
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Vestido Elegante</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-red-500">$44.00</span>
                <span className="text-sm text-gray-500 line-through">$80.00</span>
              </div>
              <Button className="w-full" size="sm">
                Agregar al carrito
              </Button>
            </div>
          </div>

          {/* Producto 6 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
              -55%
            </Badge>
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Reloj Casual</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-red-500">$45.00</span>
                <span className="text-sm text-gray-500 line-through">$100.00</span>
              </div>
              <Button className="w-full" size="sm">
                Agregar al carrito
              </Button>
            </div>
          </div>

          {/* Producto 7 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
              -30%
            </Badge>
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Mochila Urban</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-red-500">$35.00</span>
                <span className="text-sm text-gray-500 line-through">$50.00</span>
              </div>
              <Button className="w-full" size="sm">
                Agregar al carrito
              </Button>
            </div>
          </div>

          {/* Producto 8 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
              -70%
            </Badge>
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Gafas de Sol</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-red-500">$15.00</span>
                <span className="text-sm text-gray-500 line-through">$50.00</span>
              </div>
              <Button className="w-full" size="sm">
                Agregar al carrito
              </Button>
            </div>
          </div>
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
