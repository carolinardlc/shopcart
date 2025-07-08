'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, Settings, HelpCircle } from 'lucide-react';

// Mock voice commands
const mockVoiceCommands = [
  { command: 'buscar smartphones', category: 'search', description: 'Buscar productos por nombre o categoría' },
  { command: 'agregar al carrito', category: 'cart', description: 'Añadir producto actual al carrito' },
  { command: 'ir al carrito', category: 'navigation', description: 'Navegar al carrito de compras' },
  { command: 'mostrar favoritos', category: 'favorites', description: 'Ver productos favoritos' },
  { command: 'filtrar por precio', category: 'filter', description: 'Aplicar filtros de precio' },
  { command: 'siguiente página', category: 'navigation', description: 'Ir a la siguiente página' },
  { command: 'página anterior', category: 'navigation', description: 'Ir a la página anterior' },
  { command: 'ordenar por precio', category: 'sort', description: 'Ordenar productos por precio' },
  { command: 'ayuda', category: 'help', description: 'Mostrar ayuda y comandos disponibles' },
  { command: 'configuración', category: 'settings', description: 'Abrir configuración de voz' }
];

const mockRecentCommands = [
  { command: 'buscar auriculares bluetooth', timestamp: '2024-01-15 10:30', result: 'Encontrados 24 productos' },
  { command: 'agregar al carrito', timestamp: '2024-01-15 10:25', result: 'Producto añadido exitosamente' },
  { command: 'ir al carrito', timestamp: '2024-01-15 10:20', result: 'Navegando al carrito' }
];

export default function VoiceNavigationPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState(mockRecentCommands);
  const [voiceSettings, setVoiceSettings] = useState({
    language: 'es-ES',
    voice: 'female',
    speed: 1.0,
    volume: 0.8,
    autoListen: false,
    confirmActions: true
  });

  const recognition = useRef<any>(null);
  const synthesis = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognition.current = new (window as any).webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = voiceSettings.language;

      recognition.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processCommand(finalTranscript);
        }
      };

      recognition.current.onend = () => {
        setIsListening(false);
        if (voiceSettings.autoListen) {
          startListening();
        }
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthesis.current = window.speechSynthesis;
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [voiceSettings]);

  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      setTranscript('');
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const processCommand = (command: string) => {
    setIsProcessing(true);
    setCurrentCommand(command);
    
    // Simulate command processing
    setTimeout(() => {
      const result = executeCommand(command);
      speak(result);
      
      // Add to history
      const newHistoryItem = {
        command,
        timestamp: new Date().toLocaleString(),
        result
      };
      setCommandHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
      
      setIsProcessing(false);
      setCurrentCommand('');
    }, 1000);
  };

  const executeCommand = (command: string): string => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('buscar')) {
      return 'Buscando productos relacionados...';
    } else if (lowerCommand.includes('carrito')) {
      return 'Navegando al carrito de compras';
    } else if (lowerCommand.includes('favoritos')) {
      return 'Mostrando productos favoritos';
    } else if (lowerCommand.includes('ayuda')) {
      return 'Aquí tienes los comandos disponibles';
    } else if (lowerCommand.includes('configuración')) {
      return 'Abriendo configuración de voz';
    } else {
      return 'Comando no reconocido. Di "ayuda" para ver comandos disponibles.';
    }
  };

  const speak = (text: string) => {
    if (synthesis.current && voiceEnabled) {
      synthesis.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceSettings.language;
      utterance.rate = voiceSettings.speed;
      utterance.volume = voiceSettings.volume;
      
      // Set voice gender
      const voices = synthesis.current.getVoices();
      const voice = voices.find((v: any) => 
        v.lang.includes(voiceSettings.language.split('-')[0]) && 
        v.name.toLowerCase().includes(voiceSettings.voice)
      );
      if (voice) {
        utterance.voice = voice;
      }
      
      synthesis.current.speak(utterance);
    }
  };

  const testVoice = () => {
    speak('Esta es una prueba de voz. ¿Puedes escucharme correctamente?');
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      speak('Voz activada');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      search: 'bg-blue-100 text-blue-800',
      cart: 'bg-green-100 text-green-800',
      navigation: 'bg-purple-100 text-purple-800',
      favorites: 'bg-pink-100 text-pink-800',
      filter: 'bg-yellow-100 text-yellow-800',
      sort: 'bg-orange-100 text-orange-800',
      help: 'bg-gray-100 text-gray-800',
      settings: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Navegación por Voz</h1>
          <p className="text-lg text-gray-600">Controla tu experiencia de compra con comandos de voz</p>
        </div>

        {/* Voice Status */}
        <div className="flex justify-center mb-8">
          <Card className="max-w-2xl w-full">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Button
                    size="lg"
                    onClick={isListening ? stopListening : startListening}
                    className={`w-16 h-16 rounded-full ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </Button>
                  {isListening && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {isListening ? 'Escuchando...' : 'Presiona para hablar'}
                  </h3>
                  
                  {transcript && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 font-medium">"{transcript}"</p>
                    </div>
                  )}
                  
                  {isProcessing && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-yellow-800">Procesando comando...</p>
                    </div>
                  )}
                  
                  {currentCommand && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-green-800">Ejecutando: "{currentCommand}"</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Commands and History */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="commands" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="commands">Comandos</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
                <TabsTrigger value="settings">Configuración</TabsTrigger>
              </TabsList>

              <TabsContent value="commands" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Comandos Disponibles</CardTitle>
                    <CardDescription>
                      Puedes usar estos comandos de voz para navegar por la aplicación
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockVoiceCommands.map((cmd, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              "{cmd.command}"
                            </code>
                            <Badge className={getCategoryColor(cmd.category)} variant="secondary">
                              {cmd.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{cmd.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Comandos</CardTitle>
                    <CardDescription>
                      Últimos comandos de voz ejecutados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {commandHistory.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Mic className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <code className="text-sm font-mono">"{item.command}"</code>
                              <span className="text-xs text-gray-500">{item.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-600">{item.result}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Voz</CardTitle>
                    <CardDescription>
                      Personaliza tu experiencia de navegación por voz
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Idioma</label>
                        <select 
                          value={voiceSettings.language}
                          onChange={(e) => setVoiceSettings({...voiceSettings, language: e.target.value})}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="es-ES">Español (España)</option>
                          <option value="es-MX">Español (México)</option>
                          <option value="en-US">English (US)</option>
                          <option value="en-GB">English (UK)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Voz</label>
                        <select 
                          value={voiceSettings.voice}
                          onChange={(e) => setVoiceSettings({...voiceSettings, voice: e.target.value})}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="female">Femenina</option>
                          <option value="male">Masculina</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Velocidad: {voiceSettings.speed}x
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={voiceSettings.speed}
                          onChange={(e) => setVoiceSettings({...voiceSettings, speed: parseFloat(e.target.value)})}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Volumen: {Math.round(voiceSettings.volume * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={voiceSettings.volume}
                          onChange={(e) => setVoiceSettings({...voiceSettings, volume: parseFloat(e.target.value)})}
                          className="w-full"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Escucha automática</label>
                        <input
                          type="checkbox"
                          checked={voiceSettings.autoListen}
                          onChange={(e) => setVoiceSettings({...voiceSettings, autoListen: e.target.checked})}
                          className="rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Confirmar acciones</label>
                        <input
                          type="checkbox"
                          checked={voiceSettings.confirmActions}
                          onChange={(e) => setVoiceSettings({...voiceSettings, confirmActions: e.target.checked})}
                          className="rounded"
                        />
                      </div>

                      <Button onClick={testVoice} className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Probar Voz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voice Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Controles de Voz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Voz habilitada</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleVoice}
                      className="flex items-center"
                    >
                      {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado</span>
                    <Badge variant={isListening ? 'default' : 'secondary'}>
                      {isListening ? 'Escuchando' : 'Inactivo'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Idioma</span>
                    <span className="text-sm text-gray-600">{voiceSettings.language}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Ayuda Rápida
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Iniciar búsqueda:</p>
                    <p className="text-gray-600">"Buscar [nombre del producto]"</p>
                  </div>
                  <div>
                    <p className="font-medium">Navegar:</p>
                    <p className="text-gray-600">"Ir a [página]"</p>
                  </div>
                  <div>
                    <p className="font-medium">Agregar productos:</p>
                    <p className="text-gray-600">"Agregar al carrito"</p>
                  </div>
                  <div>
                    <p className="font-medium">Obtener ayuda:</p>
                    <p className="text-gray-600">"Ayuda" o "Comandos"</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consejos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• Habla claramente y a velocidad normal</p>
                  <p>• Evita ruidos de fondo</p>
                  <p>• Usa comandos específicos</p>
                  <p>• Espera la confirmación antes del siguiente comando</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
