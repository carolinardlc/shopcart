import Container from '@/components/Container';
import { Button } from '@/components/ui/button';

const BlogPage = () => {
  return (
    <Container className="bg-shop-light-pink">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Artículo de ejemplo 1 */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del artículo</span>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">Tendencias de Moda 2025</h2>
              <p className="text-gray-600 mb-4">
                Descubre las últimas tendencias en moda para este año y cómo incorporarlas en tu guardarropa.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">15 Jun 2025</span>
                <Button variant="outline" size="sm">Leer más</Button>
              </div>
            </div>
          </article>

          {/* Artículo de ejemplo 2 */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del artículo</span>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">Guía de Compras Online</h2>
              <p className="text-gray-600 mb-4">
                Consejos esenciales para hacer compras seguras y inteligentes en línea.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">10 Jun 2025</span>
                <Button variant="outline" size="sm">Leer más</Button>
              </div>
            </div>
          </article>

          {/* Artículo de ejemplo 3 */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del artículo</span>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">Sostenibilidad en la Moda</h2>
              <p className="text-gray-600 mb-4">
                Cómo elegir marcas sostenibles y contribuir a un mundo más verde.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">5 Jun 2025</span>
                <Button variant="outline" size="sm">Leer más</Button>
              </div>
            </div>
          </article>

          {/* Artículo de ejemplo 4 */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del artículo</span>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">Accesorios de Temporada</h2>
              <p className="text-gray-600 mb-4">
                Los accesorios imprescindibles para completar tu look esta temporada.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">1 Jun 2025</span>
                <Button variant="outline" size="sm">Leer más</Button>
              </div>
            </div>
          </article>

          {/* Artículo de ejemplo 5 */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del artículo</span>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">Cuidado de la Ropa</h2>
              <p className="text-gray-600 mb-4">
                Tips para mantener tu ropa como nueva y alargar su vida útil.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">25 May 2025</span>
                <Button variant="outline" size="sm">Leer más</Button>
              </div>
            </div>
          </article>

          {/* Artículo de ejemplo 6 */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Imagen del artículo</span>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">Estilo Minimalista</h2>
              <p className="text-gray-600 mb-4">
                Cómo crear un guardarropa cápsula con menos piezas pero más versátiles.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">20 May 2025</span>
                <Button variant="outline" size="sm">Leer más</Button>
              </div>
            </div>
          </article>
        </div>

        {/* Paginación */}
        <div className="mt-8 flex justify-center space-x-2">
          <Button variant="outline" size="sm">Anterior</Button>
          <Button variant="default" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Siguiente</Button>
        </div>
      </div>
    </Container>
  );
};

export default BlogPage;
