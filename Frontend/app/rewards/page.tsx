'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Gift, Star, Trophy, Target, Crown, Zap, Heart, ShoppingBag, Users, Calendar } from 'lucide-react';

// Mock data for rewards
const mockUserData = {
  points: 2450,
  level: 'Gold',
  nextLevel: 'Platinum',
  pointsToNextLevel: 550,
  totalSpent: 1250,
  purchaseCount: 24,
  referrals: 3,
  streakDays: 7
};

const mockRewards = [
  {
    id: 1,
    title: 'Descuento 20% en próxima compra',
    description: 'Válido por 30 días en cualquier producto',
    points: 500,
    category: 'discount',
    available: true,
    icon: '🎯'
  },
  {
    id: 2,
    title: 'Envío gratis por 3 meses',
    description: 'Envío gratuito en todas tus compras',
    points: 1000,
    category: 'shipping',
    available: true,
    icon: '📦'
  },
  {
    id: 3,
    title: 'Acceso VIP anticipado',
    description: 'Acceso exclusivo a ofertas antes que nadie',
    points: 1500,
    category: 'access',
    available: true,
    icon: '👑'
  },
  {
    id: 4,
    title: 'Producto gratis',
    description: 'Elige cualquier producto hasta $50',
    points: 2000,
    category: 'product',
    available: true,
    icon: '🎁'
  },
  {
    id: 5,
    title: 'Consultoría personalizada',
    description: 'Sesión 1:1 con experto en compras',
    points: 3000,
    category: 'service',
    available: false,
    icon: '💎'
  }
];

const mockChallenges = [
  {
    id: 1,
    title: 'Comprador frecuente',
    description: 'Realiza 5 compras este mes',
    progress: 3,
    total: 5,
    reward: 200,
    deadline: '2024-01-31',
    difficulty: 'easy'
  },
  {
    id: 2,
    title: 'Explorador de categorías',
    description: 'Compra en 3 categorías diferentes',
    progress: 2,
    total: 3,
    reward: 300,
    deadline: '2024-01-31',
    difficulty: 'medium'
  },
  {
    id: 3,
    title: 'Influencer social',
    description: 'Refiere 2 amigos que hagan su primera compra',
    progress: 1,
    total: 2,
    reward: 500,
    deadline: '2024-02-15',
    difficulty: 'hard'
  }
];

const mockHistory = [
  {
    id: 1,
    action: 'Compra realizada',
    points: 125,
    date: '2024-01-15',
    description: 'Compra por $250'
  },
  {
    id: 2,
    action: 'Referido exitoso',
    points: 200,
    date: '2024-01-10',
    description: 'Juan completó su primera compra'
  },
  {
    id: 3,
    action: 'Reseña publicada',
    points: 50,
    date: '2024-01-08',
    description: 'Reseña de 5 estrellas'
  }
];

export default function RewardsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  const filteredRewards = selectedCategory === 'all' 
    ? mockRewards 
    : mockRewards.filter(reward => reward.category === selectedCategory);

  const redeemReward = (reward: any) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    alert(`¡Recompensa "${selectedReward?.title}" canjeada exitosamente!`);
    setShowRedeemModal(false);
    setSelectedReward(null);
  };

  const progressPercentage = (mockUserData.points / (mockUserData.points + mockUserData.pointsToNextLevel)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Centro de Recompensas</h1>
          <p className="text-lg text-gray-600">Gana puntos y desbloquea beneficios exclusivos</p>
        </div>

        {/* User Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Puntos Totales</p>
                  <p className="text-3xl font-bold">{mockUserData.points.toLocaleString()}</p>
                </div>
                <Star className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Nivel Actual</p>
                  <p className="text-2xl font-bold text-yellow-600">{mockUserData.level}</p>
                </div>
                <Crown className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Racha de Días</p>
                  <p className="text-2xl font-bold text-green-600">{mockUserData.streakDays}</p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compras</p>
                  <p className="text-2xl font-bold text-blue-600">{mockUserData.purchaseCount}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Progreso al Siguiente Nivel
            </CardTitle>
            <CardDescription>
              Te faltan {mockUserData.pointsToNextLevel} puntos para alcanzar el nivel {mockUserData.nextLevel}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{mockUserData.level}</span>
                <span>{mockUserData.nextLevel}</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-gray-600">
                {mockUserData.points} / {mockUserData.points + mockUserData.pointsToNextLevel} puntos
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="rewards" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rewards">Recompensas</TabsTrigger>
            <TabsTrigger value="challenges">Desafíos</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="space-y-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: 'all', label: 'Todas', icon: '🎯' },
                { key: 'discount', label: 'Descuentos', icon: '💰' },
                { key: 'shipping', label: 'Envíos', icon: '📦' },
                { key: 'access', label: 'Acceso VIP', icon: '👑' },
                { key: 'product', label: 'Productos', icon: '🎁' },
                { key: 'service', label: 'Servicios', icon: '💎' }
              ].map(category => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key)}
                  className="flex items-center"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => (
                <Card key={reward.id} className={`relative ${!reward.available ? 'opacity-50' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl">{reward.icon}</div>
                      <Badge variant={reward.available ? 'default' : 'secondary'}>
                        {reward.points} puntos
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      disabled={!reward.available || mockUserData.points < reward.points}
                      onClick={() => redeemReward(reward)}
                    >
                      {!reward.available ? 'No disponible' : 
                       mockUserData.points < reward.points ? 'Puntos insuficientes' : 
                       'Canjear'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockChallenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <Badge variant={
                        challenge.difficulty === 'easy' ? 'default' : 
                        challenge.difficulty === 'medium' ? 'secondary' : 'destructive'
                      }>
                        {challenge.difficulty === 'easy' ? 'Fácil' : 
                         challenge.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                      </Badge>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progreso</span>
                        <span>{challenge.progress}/{challenge.total}</span>
                      </div>
                      <Progress value={(challenge.progress / challenge.total) * 100} />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          Hasta {challenge.deadline}
                        </div>
                        <div className="flex items-center text-sm font-medium text-green-600">
                          <Gift className="h-4 w-4 mr-1" />
                          {challenge.reward} puntos
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Puntos</CardTitle>
                <CardDescription>Últimas actividades que generaron puntos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Star className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{item.action}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">+{item.points}</div>
                        <div className="text-sm text-gray-500">{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Redeem Modal */}
        {showRedeemModal && selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full m-4">
              <CardHeader>
                <CardTitle>Confirmar Canje</CardTitle>
                <CardDescription>
                  ¿Estás seguro de que quieres canjear esta recompensa?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{selectedReward.icon}</div>
                    <div>
                      <div className="font-medium">{selectedReward.title}</div>
                      <div className="text-sm text-gray-600">{selectedReward.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Costo</span>
                    <span className="font-bold">{selectedReward.points} puntos</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span>Puntos restantes</span>
                    <span className="font-bold">{mockUserData.points - selectedReward.points}</span>
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-end space-x-2 p-6 pt-0">
                <Button variant="outline" onClick={() => setShowRedeemModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={confirmRedeem}>
                  Confirmar Canje
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
