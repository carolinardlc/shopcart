'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, Search, Zap, ShoppingBag, Heart, Share2, X, CheckCircle } from 'lucide-react';

// Mock data for visual search results
const mockSearchResults = [
  {
    id: 1,
    name: 'Smartphone Similar',
    price: 699,
    originalPrice: 899,
    brand: 'TechBrand',
    rating: 4.5,
    reviews: 1234,
    image: '/api/placeholder/200/200',
    similarity: 95,
    availability: 'in_stock',
    features: ['64MP Camera', '5G', 'Fast Charging']
  },
  {
    id: 2,
    name: 'Alternativa Premium',
    price: 799,
    originalPrice: 999,
    brand: 'PremiumTech',
    rating: 4.8,
    reviews: 856,
    image: '/api/placeholder/200/200',
    similarity: 87,
    availability: 'limited',
    features: ['108MP Camera', '5G', 'Wireless Charging']
  },
  {
    id: 3,
    name: 'Opción Económica',
    price: 399,
    originalPrice: 499,
    brand: 'ValueTech',
    rating: 4.2,
    reviews: 567,
    image: '/api/placeholder/200/200',
    similarity: 78,
    availability: 'in_stock',
    features: ['48MP Camera', '4G', 'Fast Charging']
  }
];

const mockRecentSearches = [
  { id: 1, image: '/api/placeholder/80/80', name: 'Zapatillas deportivas', date: '2024-01-15' },
  { id: 2, image: '/api/placeholder/80/80', name: 'Reloj inteligente', date: '2024-01-14' },
  { id: 3, image: '/api/placeholder/80/80', name: 'Auriculares', date: '2024-01-13' }
];

export default function VisualScannerPage() {
  const [activeTab, setActiveTab] = useState('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: 'all',
    brand: 'all',
    rating: 'all',
    availability: 'all'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('No se pudo acceder a la cámara');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setUploadedImage(imageData);
        performSearch(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);
        performSearch(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const performSearch = (imageData: string) => {
    setIsScanning(true);
    // Simulate image processing
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsScanning(false);
    }, 2000);
  };

  const resetSearch = () => {
    setSearchResults([]);
    setUploadedImage(null);
    setIsScanning(false);
    if (cameraActive) {
      stopCamera();
    }
  };

  const addToCart = (product: any) => {
    alert(`${product.name} añadido al carrito`);
  };

  const addToFavorites = (product: any) => {
    alert(`${product.name} añadido a favoritos`);
  };

  const shareProduct = (product: any) => {
    alert(`Compartiendo ${product.name}`);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in_stock': return 'text-green-600';
      case 'limited': return 'text-yellow-600';
      case 'out_of_stock': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in_stock': return 'En stock';
      case 'limited': return 'Stock limitado';
      case 'out_of_stock': return 'Agotado';
      default: return 'Disponibilidad desconocida';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Escáner Visual</h1>
          <p className="text-lg text-gray-600">Encuentra productos similares con tu cámara o foto</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scanner Section */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Escáner Visual
                </CardTitle>
                <CardDescription>
                  Captura una foto o sube una imagen para encontrar productos similares
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="camera">Cámara</TabsTrigger>
                    <TabsTrigger value="upload">Subir Foto</TabsTrigger>
                  </TabsList>

                  <TabsContent value="camera" className="space-y-4">
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                      {cameraActive ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : uploadedImage ? (
                        <img
                          src={uploadedImage}
                          alt="Captured"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center">
                            <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p>Presiona iniciar para activar la cámara</p>
                          </div>
                        </div>
                      )}
                      
                      {uploadedImage && (
                        <button
                          onClick={resetSearch}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex justify-center space-x-2">
                      {!cameraActive && !uploadedImage && (
                        <Button onClick={startCamera} className="flex items-center">
                          <Camera className="h-4 w-4 mr-2" />
                          Iniciar Cámara
                        </Button>
                      )}
                      {cameraActive && (
                        <>
                          <Button onClick={captureImage} className="flex items-center">
                            <Zap className="h-4 w-4 mr-2" />
                            Capturar
                          </Button>
                          <Button variant="outline" onClick={stopCamera}>
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-4">
                    <div
                      className="relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
                      style={{ height: '300px' }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploadedImage ? (
                        <>
                          <img
                            src={uploadedImage}
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              resetSearch();
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center">
                            <Upload className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p>Haz clic para subir una imagen</p>
                            <p className="text-sm mt-2">JPG, PNG hasta 5MB</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </TabsContent>
                </Tabs>

                {/* Scanning State */}
                {isScanning && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-lg font-medium">Analizando imagen...</p>
                      <p className="text-sm text-gray-600">Buscando productos similares</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    Resultados de Búsqueda
                  </CardTitle>
                  <CardDescription>
                    Encontramos {searchResults.length} productos similares
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {searchResults.map((product) => (
                      <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <Badge variant="secondary">{product.similarity}% similar</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <span className="text-yellow-500">★</span>
                              <span className="ml-1">{product.rating}</span>
                              <span className="text-gray-500 ml-1">({product.reviews})</span>
                            </div>
                            <div className={getAvailabilityColor(product.availability)}>
                              {getAvailabilityText(product.availability)}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {product.features.map((feature: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            disabled={product.availability === 'out_of_stock'}
                            className="flex items-center"
                          >
                            <ShoppingBag className="h-4 w-4 mr-1" />
                            Agregar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToFavorites(product)}
                            className="flex items-center"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            Favorito
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => shareProduct(product)}
                            className="flex items-center"
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            Compartir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consejos de Búsqueda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Buena iluminación</p>
                      <p className="text-gray-600">Asegúrate de tener buena luz natural o artificial</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Objeto centrado</p>
                      <p className="text-gray-600">Coloca el producto en el centro de la imagen</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Fondo simple</p>
                      <p className="text-gray-600">Evita fondos complejos o desordenados</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Búsquedas Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentSearches.map((search) => (
                    <div key={search.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <img
                        src={search.image}
                        alt={search.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{search.name}</p>
                        <p className="text-xs text-gray-500">{search.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar por texto
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Ver favoritos
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Ir al carrito
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
