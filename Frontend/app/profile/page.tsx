'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, MapPin, CreditCard, Package, Heart, Star, Settings, Shield, Bell, Eye, Trash2 } from 'lucide-react';

// Mock user data
const mockUser = {
  id: 1,
  name: 'Juan Pérez',
  email: 'juan.perez@email.com',
  phone: '+51 999 123 456',
  avatar: '/api/placeholder/150/150',
  joinDate: '2023-03-15',
  lastActive: '2024-01-15',
  plan: 'Premium',
  emotionalState: 'Feliz',
  points: 2450,
  level: 'Gold',
  addresses: [
    {
      id: 1,
      type: 'home',
      name: 'Casa',
      street: 'Av. Javier Prado Este 123',
      district: 'San Isidro',
      city: 'Lima',
      zipCode: '15036',
      isDefault: true
    },
    {
      id: 2,
      type: 'work',
      name: 'Trabajo',
      street: 'Calle Los Olivos 456',
      district: 'Miraflores',
      city: 'Lima',
      zipCode: '15074',
      isDefault: false
    }
  ],
  paymentMethods: [
    {
      id: 1,
      type: 'credit_card',
      name: 'Visa **** 1234',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'paypal',
      name: 'PayPal',
      email: 'juan.perez@email.com',
      isDefault: false
    }
  ],
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false,
      orderUpdates: true,
      promotions: true,
      recommendations: true
    },
    privacy: {
      profilePublic: false,
      shareData: true,
      personalizedAds: true,
      cookieConsent: true
    },
    shopping: {
      currency: 'PEN',
      language: 'es',
      theme: 'light',
      autoSaveCart: true,
      oneClickPurchase: false
    }
  },
  stats: {
    totalOrders: 24,
    totalSpent: 1250,
    averageRating: 4.8,
    favoriteProducts: 18,
    reviewsWritten: 12
  }
};

const mockOrderHistory = [
  {
    id: 'ORD-001',
    date: '2024-01-10',
    status: 'delivered',
    total: 299.99,
    items: 3,
    rating: 5
  },
  {
    id: 'ORD-002',
    date: '2024-01-05',
    status: 'delivered',
    total: 159.99,
    items: 2,
    rating: 4
  },
  {
    id: 'ORD-003',
    date: '2023-12-28',
    status: 'delivered',
    total: 89.99,
    items: 1,
    rating: 5
  }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    bio: ''
  });

  const handleSave = () => {
    // Simulate saving
    setIsEditing(false);
    alert('Perfil actualizado exitosamente');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      bio: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'processing': return 'text-blue-600';
      case 'shipped': return 'text-purple-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-lg text-gray-600">Administra tu cuenta y preferencias</p>
        </div>

        {/* User Overview */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="absolute -bottom-2 -right-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {mockUser.level}
                  </Badge>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{mockUser.name}</h2>
                <p className="text-gray-600 mb-2">{mockUser.email}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Miembro desde {mockUser.joinDate}</span>
                  <span>•</span>
                  <span>Plan {mockUser.plan}</span>
                  <span>•</span>
                  <span>{mockUser.points} puntos</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{mockUser.stats.totalOrders}</div>
                <div className="text-sm text-gray-500">Pedidos</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">S/{mockUser.stats.totalSpent}</div>
                <div className="text-sm text-gray-500">Total gastado</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <nav className="space-y-2">
                  {[
                    { id: 'profile', label: 'Información Personal', icon: User },
                    { id: 'addresses', label: 'Direcciones', icon: MapPin },
                    { id: 'payments', label: 'Métodos de Pago', icon: CreditCard },
                    { id: 'orders', label: 'Historial de Pedidos', icon: Package },
                    { id: 'favorites', label: 'Favoritos', icon: Heart },
                    { id: 'settings', label: 'Configuración', icon: Settings },
                    { id: 'privacy', label: 'Privacidad', icon: Shield }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Información Personal</CardTitle>
                      <CardDescription>Actualiza tu información personal</CardDescription>
                    </div>
                    <Button
                      variant={isEditing ? 'destructive' : 'default'}
                      onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                    >
                      {isEditing ? 'Cancelar' : 'Editar'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Biografía</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Cuéntanos sobre ti..."
                        rows={3}
                      />
                    </div>
                    
                    {isEditing && (
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleCancel}>
                          Cancelar
                        </Button>
                        <Button onClick={handleSave}>
                          Guardar cambios
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Direcciones</CardTitle>
                      <CardDescription>Gestiona tus direcciones de envío</CardDescription>
                    </div>
                    <Button>
                      <MapPin className="h-4 w-4 mr-2" />
                      Agregar dirección
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUser.addresses.map((address) => (
                      <div key={address.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{address.name}</h3>
                              {address.isDefault && (
                                <Badge variant="secondary">Predeterminada</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">
                              {address.street}<br />
                              {address.district}, {address.city}<br />
                              {address.zipCode}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payments' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Métodos de Pago</CardTitle>
                      <CardDescription>Gestiona tus métodos de pago</CardDescription>
                    </div>
                    <Button>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Agregar método
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUser.paymentMethods.map((method) => (
                      <div key={method.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">{method.name}</div>
                              {method.type === 'credit_card' && (
                                <div className="text-sm text-gray-500">
                                  Expira {method.expiryDate}
                                </div>
                              )}
                              {method.type === 'paypal' && (
                                <div className="text-sm text-gray-500">
                                  {method.email}
                                </div>
                              )}
                            </div>
                            {method.isDefault && (
                              <Badge variant="secondary">Predeterminado</Badge>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Pedidos</CardTitle>
                  <CardDescription>Revisa tus pedidos anteriores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrderHistory.map((order) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">Pedido #{order.id}</div>
                              <div className="text-sm text-gray-500">
                                {order.date} • {order.items} artículos
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">S/{order.total}</div>
                            <div className={`text-sm ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < order.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Ver detalles
                            </Button>
                            <Button variant="outline" size="sm">
                              Reordenar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configuración</CardTitle>
                  <CardDescription>Personaliza tu experiencia</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Notificaciones</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'email', label: 'Notificaciones por email' },
                          { key: 'push', label: 'Notificaciones push' },
                          { key: 'sms', label: 'Notificaciones SMS' },
                          { key: 'orderUpdates', label: 'Actualizaciones de pedidos' },
                          { key: 'promotions', label: 'Promociones y ofertas' },
                          { key: 'recommendations', label: 'Recomendaciones personalizadas' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <label className="text-sm font-medium">{item.label}</label>
                            <input
                              type="checkbox"
                              checked={mockUser.preferences.notifications[item.key as keyof typeof mockUser.preferences.notifications]}
                              className="rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Compras</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Moneda</label>
                          <select className="p-2 border rounded">
                            <option value="PEN">PEN (Soles)</option>
                            <option value="USD">USD (Dólares)</option>
                            <option value="EUR">EUR (Euros)</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Idioma</label>
                          <select className="p-2 border rounded">
                            <option value="es">Español</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Guardar carrito automáticamente</label>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <Card>
                <CardHeader>
                  <CardTitle>Privacidad y Datos</CardTitle>
                  <CardDescription>Controla tu privacidad y datos personales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Privacidad del Perfil</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Perfil público</label>
                          <input type="checkbox" className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Compartir datos para mejorar el servicio</label>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Publicidad personalizada</label>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Datos Personales</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Eye className="h-4 w-4 mr-2" />
                          Descargar mis datos
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Solicitar eliminación de cuenta
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
