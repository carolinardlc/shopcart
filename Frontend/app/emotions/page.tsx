'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Heart, Sparkles, TrendingUp, Music, Palette, Volume2, Smile, Frown, Meh } from 'lucide-react';

interface EmotionData {
  emotion: string;
  label: string;
  emoji: string;
  color: string;
  intensity: number;
  products: any[];
  music?: string;
  colors?: string[];
  recommendations?: string[];
}

const emotionStates: EmotionData[] = [
  {
    emotion: 'happy',
    label: 'Feliz',
    emoji: '😊',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    intensity: 0,
    products: [],
    music: 'upbeat',
    colors: ['#FFD700', '#FFA500', '#FFFF99'],
    recommendations: ['Accesorios coloridos', 'Ropa vibrante', 'Decoración alegre']
  },
  {
    emotion: 'excited',
    label: 'Emocionado',
    emoji: '🤩',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    intensity: 0,
    products: [],
    music: 'energetic',
    colors: ['#FF6B35', '#F7931E', '#FFB347'],
    recommendations: ['Gadgets nuevos', 'Deportes extremos', 'Aventuras']
  },
  {
    emotion: 'calm',
    label: 'Tranquilo',
    emoji: '😌',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    intensity: 0,
    products: [],
    music: 'relaxing',
    colors: ['#87CEEB', '#B0E0E6', '#ADD8E6'],
    recommendations: ['Productos de relajación', 'Libros', 'Tés e infusiones']
  },
  {
    emotion: 'romantic',
    label: 'Romántico',
    emoji: '💕',
    color: 'bg-pink-100 text-pink-800 border-pink-300',
    intensity: 0,
    products: [],
    music: 'romantic',
    colors: ['#FFB6C1', '#FF69B4', '#FFC0CB'],
    recommendations: ['Regalos románticos', 'Velas aromáticas', 'Joyería']
  },
  {
    emotion: 'motivated',
    label: 'Motivado',
    emoji: '💪',
    color: 'bg-green-100 text-green-800 border-green-300',
    intensity: 0,
    products: [],
    music: 'motivational',
    colors: ['#90EE90', '#98FB98', '#00FF7F'],
    recommendations: ['Equipos de ejercicio', 'Libros de autoayuda', 'Suplementos']
  },
  {
    emotion: 'nostalgic',
    label: 'Nostálgico',
    emoji: '🌅',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    intensity: 0,
    products: [],
    music: 'nostalgic',
    colors: ['#DDA0DD', '#9370DB', '#8A2BE2'],
    recommendations: ['Productos vintage', 'Fotografía', 'Coleccionables']
  },
  {
    emotion: 'creative',
    label: 'Creativo',
    emoji: '🎨',
    color: 'bg-teal-100 text-teal-800 border-teal-300',
    intensity: 0,
    products: [],
    music: 'creative',
    colors: ['#20B2AA', '#48D1CC', '#00CED1'],
    recommendations: ['Materiales de arte', 'Herramientas creativas', 'Cursos online']
  },
  {
    emotion: 'adventurous',
    label: 'Aventurero',
    emoji: '🚀',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    intensity: 0,
    products: [],
    music: 'adventure',
    colors: ['#9932CC', '#8B008B', '#9400D3'],
    recommendations: ['Equipos de viaje', 'Artículos outdoor', 'Experiencias']
  }
];

export default function EmotionDashboard() {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData>(emotionStates[0]);
  const [emotions, setEmotions] = useState<EmotionData[]>(emotionStates);
  const [faceDetectionActive, setFaceDetectionActive] = useState(false);
  const [surveyActive, setSurveyActive] = useState(false);
  const [emotionHistory, setEmotionHistory] = useState<Array<{date: string, emotion: string, intensity: number}>>([]);
  const [backgroundMusic, setBackgroundMusic] = useState(false);
  const [interfaceMode, setInterfaceMode] = useState('auto');

  useEffect(() => {
    // Simular detección de emociones
    if (faceDetectionActive) {
      const interval = setInterval(() => {
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        const randomIntensity = Math.floor(Math.random() * 100) + 1;
        
        setCurrentEmotion({
          ...randomEmotion,
          intensity: randomIntensity
        });

        // Actualizar historial
        setEmotionHistory(prev => [
          ...prev.slice(-9), // Mantener últimos 10 registros
          {
            date: new Date().toLocaleTimeString(),
            emotion: randomEmotion.emotion,
            intensity: randomIntensity
          }
        ]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [faceDetectionActive, emotions]);

  useEffect(() => {
    // Cambiar la interfaz según la emoción
    if (interfaceMode === 'auto') {
      document.body.style.background = `linear-gradient(135deg, ${currentEmotion.colors?.[0] || '#ffffff'}20, ${currentEmotion.colors?.[1] || '#ffffff'}10)`;
    }
  }, [currentEmotion, interfaceMode]);

  const handleEmotionSurvey = (emotion: string, intensity: number) => {
    const selectedEmotion = emotions.find(e => e.emotion === emotion);
    if (selectedEmotion) {
      setCurrentEmotion({
        ...selectedEmotion,
        intensity
      });
      
      setEmotionHistory(prev => [
        ...prev.slice(-9),
        {
          date: new Date().toLocaleTimeString(),
          emotion,
          intensity
        }
      ]);
    }
  };

  const toggleFaceDetection = () => {
    setFaceDetectionActive(!faceDetectionActive);
  };

  const surpriseMe = () => {
    const randomProducts = emotions[Math.floor(Math.random() * emotions.length)].recommendations || [];
    alert(`¡Sorpréndeme! Te recomendamos: ${randomProducts.join(', ')}`);
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 30) return 'bg-red-200 text-red-800';
    if (intensity <= 60) return 'bg-yellow-200 text-yellow-800';
    return 'bg-green-200 text-green-800';
  };

  const getIntensityText = (intensity: number) => {
    if (intensity <= 30) return 'Baja';
    if (intensity <= 60) return 'Media';
    return 'Alta';
  };

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🎭 Dashboard Emocional</h1>
          <p className="text-gray-600">
            Descubre productos personalizados según tu estado emocional
          </p>
        </div>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Estado Actual</TabsTrigger>
            <TabsTrigger value="detection">Detección</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {/* Estado emocional actual */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{currentEmotion.emoji}</span>
                  Tu Estado Emocional Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-2 ${currentEmotion.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{currentEmotion.label}</h3>
                        <Badge className={getIntensityColor(currentEmotion.intensity)}>
                          {getIntensityText(currentEmotion.intensity)}
                        </Badge>
                      </div>
                      <Progress value={currentEmotion.intensity} className="mb-2" />
                      <p className="text-sm">Intensidad: {currentEmotion.intensity}%</p>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {currentEmotion.colors?.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Recomendaciones Personalizadas</h4>
                      <div className="space-y-2">
                        {currentEmotion.recommendations?.map((rec, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={surpriseMe} className="flex-1">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Sorpréndeme
                      </Button>
                      <Button variant="outline" onClick={() => setBackgroundMusic(!backgroundMusic)}>
                        <Music className="h-4 w-4 mr-2" />
                        {backgroundMusic ? 'Detener' : 'Música'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Productos recomendados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Productos Recomendados para ti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="aspect-square bg-gray-100 rounded mb-3 flex items-center justify-center">
                        <span className="text-2xl">{currentEmotion.emoji}</span>
                      </div>
                      <h3 className="font-semibold mb-1">Producto Emocional {i}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Perfecto para tu estado {currentEmotion.label.toLowerCase()}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-600">S/49.99</span>
                        <Button size="sm">Agregar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detección de Emociones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Detección facial */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Detección Facial</h3>
                      <p className="text-sm text-gray-600">
                        Usa tu cámara para detectar tu estado emocional automáticamente
                      </p>
                    </div>
                    <Button
                      onClick={toggleFaceDetection}
                      variant={faceDetectionActive ? "destructive" : "default"}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {faceDetectionActive ? 'Detener' : 'Activar'}
                    </Button>
                  </div>
                  
                  {faceDetectionActive && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">Cámara activada - Detectando emociones...</p>
                      <div className="mt-4 flex justify-center">
                        <div className="animate-pulse flex space-x-4">
                          <div className="rounded-full bg-gray-300 h-3 w-3"></div>
                          <div className="rounded-full bg-gray-300 h-3 w-3"></div>
                          <div className="rounded-full bg-gray-300 h-3 w-3"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Encuesta emocional */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Encuesta Emocional</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Cuéntanos cómo te sientes ahora mismo
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {emotions.map((emotion) => (
                      <Button
                        key={emotion.emotion}
                        variant="outline"
                        onClick={() => handleEmotionSurvey(emotion.emotion, 75)}
                        className="flex flex-col items-center gap-2 h-auto p-4"
                      >
                        <span className="text-2xl">{emotion.emoji}</span>
                        <span className="text-sm">{emotion.label}</span>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Intensidad de la emoción:</Label>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial Emocional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emotionHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Smile className="h-12 w-12 mx-auto mb-4" />
                      <p>No hay historial emocional aún</p>
                      <p className="text-sm">Activa la detección para comenzar a registrar</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {emotionHistory.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">
                              {emotions.find(e => e.emotion === entry.emotion)?.emoji}
                            </span>
                            <div>
                              <p className="font-medium">
                                {emotions.find(e => e.emotion === entry.emotion)?.label}
                              </p>
                              <p className="text-sm text-gray-600">{entry.date}</p>
                            </div>
                          </div>
                          <Badge className={getIntensityColor(entry.intensity)}>
                            {entry.intensity}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de la Interfaz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="interface-mode">Modo de Interfaz</Label>
                    <Select value={interfaceMode} onValueChange={setInterfaceMode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un modo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Automático (según emoción)</SelectItem>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="colorful">Colorido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Música de Fondo</Label>
                      <p className="text-sm text-gray-600">
                        Reproducir música según tu estado emocional
                      </p>
                    </div>
                    <Button
                      variant={backgroundMusic ? "default" : "outline"}
                      onClick={() => setBackgroundMusic(!backgroundMusic)}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      {backgroundMusic ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificaciones Emocionales</Label>
                      <p className="text-sm text-gray-600">
                        Recibir notificaciones sobre cambios emocionales
                      </p>
                    </div>
                    <Button variant="outline">
                      Configurar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
