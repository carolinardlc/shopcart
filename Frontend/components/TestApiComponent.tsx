'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService, Product, Category } from '@/lib/api';

interface TestApiComponentProps {
  className?: string;
}

const TestApiComponent: React.FC<TestApiComponentProps> = ({ className }) => {
  const [mensaje, setMensaje] = useState<string>('');
  const [inputData, setInputData] = useState<string>('');
  const [respuesta, setRespuesta] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [healthStatus, setHealthStatus] = useState<any>(null);

  // Función para obtener saludo del backend
  const obtenerSaludo = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getSaludo();
      setMensaje(response.mensaje || 'Respuesta recibida');
    } catch (err: any) {
      // Manejar error de autenticación de manera más amigable
      if (err.message && err.message.includes('Token de acceso requerido')) {
        setError('Este endpoint requiere autenticación OAuth con Google. Configura las credenciales primero.');
        setMensaje('Autenticación requerida - OAuth no configurado');
      } else {
        setError('Error al conectar con el backend. Verifica que esté ejecutándose en el puerto 5000.');
      }
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener health status
  const obtenerHealth = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getHealth();
      setHealthStatus(response);
    } catch (err: any) {
      // El health check puede fallar mientras los microservicios se inician
      setError('Health check temporalmente no disponible - Los microservicios pueden estar iniciándose.');
      setHealthStatus({ 
        status: 'INICIANDO', 
        message: 'Los microservicios están iniciándose. Espera 1-2 minutos.',
        timestamp: new Date().toISOString()
      });
      console.warn('Health check no disponible:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener productos
  const obtenerProductos = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      setError('Error al obtener productos.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para obtener categorías
  const obtenerCategorias = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      setError('Error al obtener categorías.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para enviar datos al backend
  const enviarDatos = async () => {
    if (!inputData.trim()) {
      setError('Por favor ingresa algunos datos');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await apiService.enviarDatos({
        mensaje: inputData,
        timestamp: new Date().toISOString()
      });
      setRespuesta(response.mensaje || 'Datos enviados correctamente');
      setInputData('');
    } catch (err) {
      setError('Error al enviar datos al backend');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-cargar datos al montar el componente
  useEffect(() => {
    obtenerSaludo();
    obtenerHealth();
    obtenerProductos();
    obtenerCategorias();
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>🔗 Prueba de Conexión API</CardTitle>
          <CardDescription>
            Prueba la conexión entre el frontend y backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={obtenerSaludo} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Cargando...' : 'Obtener Saludo'}
            </Button>
            
            <Button 
              onClick={obtenerHealth} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Cargando...' : 'Verificar Estado'}
            </Button>

            <Button 
              onClick={obtenerProductos} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Cargando...' : 'Cargar Productos'}
            </Button>

            <Button 
              onClick={obtenerCategorias} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Cargando...' : 'Cargar Categorías'}
            </Button>
          </div>

          {mensaje && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-800"><strong>Respuesta:</strong> {mensaje}</p>
            </div>
          )}

          {healthStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estado del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Estado:</span>
                    <Badge variant={healthStatus.status === 'OK' ? 'default' : 'destructive'} className="ml-2">
                      {healthStatus.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Base de Datos:</span>
                    <Badge variant={healthStatus.database === 'Connected' ? 'default' : 'destructive'} className="ml-2">
                      {healthStatus.database}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Tiempo activo:</span> {Math.round(healthStatus.uptime || 0)}s
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Escribe algunos datos para enviar..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && enviarDatos()}
              />
              <Button 
                onClick={enviarDatos} 
                disabled={isLoading || !inputData.trim()}
              >
                Enviar
              </Button>
            </div>
            
            {respuesta && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-blue-800"><strong>Respuesta del servidor:</strong> {respuesta}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🛍️ Productos ({products.length})</CardTitle>
            <CardDescription>
              Productos cargados desde la base de datos PostgreSQL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product) => (
                <Card key={product.id} className="border">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-green-600">${product.price}</span>
                        <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                          Stock: {product.stock}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          ID: {product.id}
                        </Badge>
                        {product.category_name && (
                          <Badge variant="secondary" className="text-xs">
                            {product.category_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {products.length > 6 && (
              <p className="text-sm text-gray-600 mt-4 text-center">
                Y {products.length - 6} productos más...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📂 Categorías ({categories.length})</CardTitle>
            <CardDescription>
              Categorías disponibles en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <Card key={category.id} className="border">
                  <CardContent className="p-3">
                    <div className="text-center space-y-1">
                      <h4 className="font-medium text-sm">{category.name}</h4>
                      {category.description && (
                        <p className="text-xs text-gray-600">{category.description}</p>
                      )}
                      <Badge variant="outline" className="text-xs">
                        ID: {category.id}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestApiComponent;