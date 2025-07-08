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

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  emotions: string[];
  category: string;
  description: string;
  isNew?: boolean;
  isFavorite?: boolean;
  inCart?: boolean;
}

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

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Auriculares Bluetooth Premium',
    price: 89.99,
    originalPrice: 129.99,
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 1245,
    emotions: ['happy', 'excited'],
    category: 'Tecnología',
    description: 'Auriculares con cancelación de ruido',
    isNew: true,
    isFavorite: false,
    inCart: false
  },
  {
    id: 2,
    name: 'Mochila Deportiva Multifuncional',
    price: 45.99,
    image: '/api/placeholder/300/300',
    rating: 4.3,
    reviews: 856,
    emotions: ['motivated', 'adventurous'],
    category: 'Deportes',
    description: 'Mochila resistente para actividades deportivas',
    isFavorite: true,
    inCart: false
  },
  {
    id: 3,
    name: 'Set de Aromas Relajantes',
    price: 32.99,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    reviews: 423,
    emotions: ['calm', 'romantic'],
    category: 'Hogar',
    description: 'Aceites esenciales para relajación',
    isFavorite: false,
    inCart: true
  }
];

export default function ShopPageNew() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState('relevant');
  const [isListening, setIsListening] = useState(false);
  const [savedFilters, setSavedFilters] = useState<string[]>([]);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedEmotion, selectedRole, selectedCategory, activeTab]);

  const filterProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedEmotion) {
      filtered = filtered.filter(product =>
        product.emotions.includes(selectedEmotion)
      );
    }

    switch (activeTab) {
      case 'relevant':
        filtered.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
        break;
      case 'recent':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'favorites':
        filtered = filtered.filter(product => product.isFavorite);
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('auriculares bluetooth');
    }, 2000);
  };

  const toggleFavorite = (productId: number) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    ));
  };

  const addToCart = (productId: number) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, inCart: !product.inCart }
        : product
    ));
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

  const getEmotionColor = (emotion: string) => {
    const emotionData = emotionalStates.find(e => e.value === emotion);
    return emotionData?.color || 'bg-gray-100 text-gray-800';
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.isNew && (
          <Badge className="absolute top-2 left-2 bg-green-500">
            Nuevo
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => toggleFavorite(product.id)}
        >
          <Heart className={`h-4 w-4 ${product.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium ml-1">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviews} reseñas)</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {product.emotions.map((emotion) => (
            <Badge key={emotion} variant="secondary" className={getEmotionColor(emotion)}>
              {emotionalStates.find(e => e.value === emotion)?.label}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-600">
              S/{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                S/{product.originalPrice}
              </span>
            )}
          </div>
          
          <Button
            onClick={() => addToCart(product.id)}
            className={product.inCart ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inCart ? 'En carrito' : 'Agregar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
            size="icon"
            onClick={handleVoiceSearch}
            className={`${isListening ? 'bg-red-100 border-red-300' : ''}`}
          >
            <Volume2 className={`h-4 w-4 ${isListening ? 'text-red-500' : ''}`} />
          </Button>
          <Button onClick={surpriseMe} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Sparkles className="h-4 w-4 mr-2" />
            Sorpréndeme
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Estado emocional" />
            </SelectTrigger>
            <SelectContent>
              {emotionalStates.map((emotion) => (
                <SelectItem key={emotion.value} value={emotion.value}>
                  {emotion.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Rol/Estilo de vida" />
            </SelectTrigger>
            <SelectContent>
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
              <SelectItem value="technology">Tecnología</SelectItem>
              <SelectItem value="sports">Deportes</SelectItem>
              <SelectItem value="home">Hogar</SelectItem>
              <SelectItem value="fashion">Moda</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={saveCurrentFilter}>
            <Filter className="h-4 w-4 mr-2" />
            Guardar Filtro
          </Button>
        </div>

        {savedFilters.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Filtros guardados:</p>
            <div className="flex flex-wrap gap-2">
              {savedFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer">
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="relevant">Relevantes</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
        </TabsList>

        <TabsContent value="relevant">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tienes productos favoritos aún</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
