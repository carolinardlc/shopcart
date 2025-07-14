'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingCart, Search, Filter, Star, Sparkles, Volume2 } from 'lucide-react';
import { apiService, Product } from '@/lib/api';
import AddToCartButton from '@/components/AddToCartButton';

const emotionalStates = [
  { value: 'happy', label: '😊 Feliz', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'excited', label: '🤩 Emocionado', color: 'bg-orange-100 text-orange-800' },
  { value: 'calm', label: '😌 Tranquilo', color: 'bg-blue-100 text-blue-800' },
  { value: 'motivated', label: '💪 Motivado', color: 'bg-green-100 text-green-800' },
  { value: 'romantic', label: '💕 Romántico', color: 'bg-pink-100 text-pink-800' },
  { value: 'adventurous', label: '🚀 Aventurero', color: 'bg-purple-100 text-purple-800' },
];

const lifestyleRoles = [
  { value: 'student', label: '🎓 Estudiante' },
  { value: 'professional', label: '💼 Profesional' },
  { value: 'parent', label: '👨‍👩‍👧‍👦 Padre/Madre' },
  { value: 'athlete', label: '🏃‍♂️ Deportista' },
  { value: 'artist', label: '🎨 Artista' },
  { value: 'traveler', label: '✈️ Viajero' },
];

export default function ShopPageNew() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('relevant');
  const [isListening, setIsListening] = useState(false);
  const [savedFilters, setSavedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Cargar productos reales del backend
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getProducts();
        if (response.success && response.data) {
          const activeProducts = response.data.filter(product => product.is_active);
          setProducts(activeProducts);
          setFilteredProducts(activeProducts);
        }
      } catch (err) {
        console.error('Error cargando productos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filtros de productos
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category_name?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Ordenar según tab activo
    switch (activeTab) {
      case 'relevant':
        // Ordenar por precio (simulando relevancia)
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'new':
        // Los productos más recientes primero (por ID)
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'favorites':
        filtered = filtered.filter(product => favorites.includes(product.id));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, activeTab, favorites]);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const surpriseMe = () => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setFilteredProducts(shuffled.slice(0, 6));
  };

  const saveCurrentFilter = () => {
    const filterName = `${selectedEmotion || 'all'}_${selectedRole || 'all'}_${selectedCategory || 'all'}`;
    if (!savedFilters.includes(filterName)) {
      setSavedFilters(prev => [...prev, filterName]);
    }
  };

  const voiceSearch = () => {
    setIsListening(!isListening);
    // Aquí se implementaría la funcionalidad de reconocimiento de voz
    setTimeout(() => setIsListening(false), 3000);
  };

  // Función para obtener un badge de emoción aleatorio para cada producto
  const getRandomEmotion = (productId: number) => {
    const index = productId % emotionalStates.length;
    return emotionalStates[index];
  };

  // Función para generar rating aleatorio
  const getRandomRating = (productId: number) => {
    const ratings = [4.2, 4.5, 4.8, 4.1, 4.6, 4.3, 4.7, 4.4];
    return ratings[productId % ratings.length];
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative">
          <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-gray-500">Imagen del producto</span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
          
          {product.id % 4 === 0 && (
            <Badge className="absolute top-2 left-2 bg-green-500">
              Nuevo
            </Badge>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium ml-1">{getRandomRating(product.id)}</span>
            </div>
            <span className="text-xs text-gray-500">({Math.floor(product.id * 23 + 100)} reseñas)</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            <Badge 
              variant="outline" 
              className={`text-xs ${getRandomEmotion(product.id).color}`}
            >
              {getRandomEmotion(product.id).label}
            </Badge>
            {product.category_name && (
              <Badge variant="outline" className="text-xs">
                {product.category_name}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-green-600">
              S/{parseFloat(product.price).toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
          </div>
          
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            disabled={product.stock === 0}
            className="w-full"
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
          </AddToCartButton>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar productos por texto, emociones o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={voiceSearch}
            className={isListening ? 'bg-red-50 border-red-200' : ''}
          >
            <Volume2 className={`h-4 w-4 mr-2 ${isListening ? 'text-red-500' : ''}`} />
            {isListening ? 'Escuchando...' : 'Buscar por voz'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Estado emocional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {emotionalStates.map((emotion) => (
                <SelectItem key={emotion.value} value={emotion.value}>
                  {emotion.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Estilo de vida" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estilos</SelectItem>
              {lifestyleRoles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {Array.from(new Set(products.map(p => p.category_name).filter(Boolean))).map((category) => (
                <SelectItem key={category} value={category!}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={surpriseMe} variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Sorpréndeme
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="relevant">Relevantes</TabsTrigger>
          <TabsTrigger value="new">Nuevos</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos ({favorites.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta cambiar los filtros o buscar algo diferente
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedEmotion('all');
                setSelectedRole('all');
              }}>
                Limpiar filtros
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {savedFilters.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Filtros guardados</h3>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer">
                {filter.replace(/all_/g, '').replace(/_/g, ' → ')}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
