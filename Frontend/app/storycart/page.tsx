'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Volume2, VolumeX, BookOpen, Star, Heart, Share } from 'lucide-react';

// Mock data for story
const mockStory = {
  id: 1,
  title: "Tu Aventura de Compra: Descubriendo Tesoros",
  description: "Déjate llevar por una narración visual de tu experiencia de compra",
  duration: "5 min",
  chapters: [
    {
      id: 1,
      title: "El Despertar del Deseo",
      content: "Todo comenzó cuando viste ese producto especial que captó tu atención...",
      image: "/api/placeholder/300/200",
      products: [
        { id: 1, name: "Smartphone Pro", price: 899, emotion: "curiosidad" }
      ]
    },
    {
      id: 2,
      title: "La Búsqueda del Tesoro",
      content: "Exploraste diferentes opciones, comparaste precios y características...",
      image: "/api/placeholder/300/200",
      products: [
        { id: 2, name: "Auriculares Bluetooth", price: 129, emotion: "emoción" },
        { id: 3, name: "Funda Protectora", price: 25, emotion: "seguridad" }
      ]
    },
    {
      id: 3,
      title: "El Momento de la Decisión",
      content: "Finalmente, tomaste la decisión perfecta para ti...",
      image: "/api/placeholder/300/200",
      products: [
        { id: 1, name: "Smartphone Pro", price: 899, emotion: "satisfacción" }
      ]
    }
  ]
};

export default function StoryCartPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentChapter < mockStory.chapters.length - 1) {
              setCurrentChapter(prev => prev + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 1;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentChapter]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const goToChapter = (chapterIndex: number) => {
    setCurrentChapter(chapterIndex);
    setProgress(0);
  };

  const shareStory = () => {
    // Simulate sharing
    alert('¡Historia compartida exitosamente!');
  };

  const currentChapterData = mockStory.chapters[currentChapter];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">StoryCart</h1>
          <p className="text-lg text-gray-600">Vive tu experiencia de compra como una historia</p>
        </div>

        {/* Story Player */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Story Display */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{mockStory.title}</CardTitle>
                    <CardDescription>{mockStory.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{mockStory.duration}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Story Visual */}
                <div className="relative mb-6">
                  <img 
                    src={currentChapterData.image} 
                    alt={currentChapterData.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                    <Button
                      size="lg"
                      onClick={togglePlay}
                      className="bg-white/90 hover:bg-white text-black"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                  </div>
                </div>

                {/* Chapter Title */}
                <h2 className="text-xl font-semibold mb-2">{currentChapterData.title}</h2>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <Progress value={progress} className="w-full" />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Capítulo {currentChapter + 1} de {mockStory.chapters.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>

                {/* Story Content */}
                <p className="text-gray-700 mb-6">{currentChapterData.content}</p>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      Guardar
                    </Button>
                    <Button variant="outline" size="sm" onClick={shareStory}>
                      <Share className="h-4 w-4 mr-1" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chapter Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capítulos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockStory.chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => goToChapter(index)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        index === currentChapter
                          ? 'bg-blue-50 border-blue-200 text-blue-900'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="font-medium text-sm">{chapter.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {chapter.products.length} productos
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Products in Current Chapter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Productos en este capítulo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentChapterData.products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        📱
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500">${product.price}</div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {product.emotion}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Story Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Análisis de tu Historia</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="emotions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="emotions">Emociones</TabsTrigger>
                <TabsTrigger value="journey">Recorrido</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              <TabsContent value="emotions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">Curiosidad</div>
                        <div className="text-sm text-gray-500">Emoción dominante</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">85%</div>
                        <div className="text-sm text-gray-500">Satisfacción</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">3</div>
                        <div className="text-sm text-gray-500">Momentos clave</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="journey" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <div>
                      <div className="font-medium">Descubrimiento</div>
                      <div className="text-sm text-gray-500">Encontraste el producto perfecto</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <div>
                      <div className="font-medium">Exploración</div>
                      <div className="text-sm text-gray-500">Comparaste opciones y precios</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <div>
                      <div className="font-medium">Decisión</div>
                      <div className="text-sm text-gray-500">Completaste tu compra con confianza</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="insights" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-5 w-5 text-blue-600" />
                      <div className="font-medium text-blue-900">Insight Principal</div>
                    </div>
                    <p className="text-blue-800">Tu proceso de compra muestra una fuerte orientación hacia la calidad y la investigación detallada.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <div className="font-medium text-green-900">Recomendación</div>
                    </div>
                    <p className="text-green-800">Productos similares que podrían interesarte basados en tu historia de compra.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
