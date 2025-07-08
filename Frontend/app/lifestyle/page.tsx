'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Heart, 
  Baby, 
  Briefcase, 
  GraduationCap, 
  Home, 
  Zap,
  Palette,
  Leaf,
  Star,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const lifestyleRoles = [
  {
    id: 'parent',
    name: 'Padre/Madre',
    icon: Baby,
    description: 'Productos para la familia y el hogar',
    color: 'bg-blue-500'
  },
  {
    id: 'professional',
    name: 'Profesional',
    icon: Briefcase,
    description: 'Herramientas y accesorios para el trabajo',
    color: 'bg-gray-500'
  },
  {
    id: 'student',
    name: 'Estudiante',
    icon: GraduationCap,
    description: 'Productos para el estudio y la vida universitaria',
    color: 'bg-green-500'
  },
  {
    id: 'homeowner',
    name: 'Propietario de Hogar',
    icon: Home,
    description: 'Mejoras y decoración para el hogar',
    color: 'bg-orange-500'
  },
  {
    id: 'fitness',
    name: 'Fitness Enthusiast',
    icon: Zap,
    description: 'Productos para deporte y vida saludable',
    color: 'bg-red-500'
  },
  {
    id: 'creative',
    name: 'Creativo',
    icon: Palette,
    description: 'Herramientas y materiales para crear',
    color: 'bg-purple-500'
  }
];

const lifestyleValues = [
  { id: 'sustainability', name: 'Sostenibilidad', icon: Leaf },
  { id: 'quality', name: 'Calidad Premium', icon: Star },
  { id: 'innovation', name: 'Innovación', icon: TrendingUp },
  { id: 'security', name: 'Seguridad', icon: ShieldCheck },
  { id: 'community', name: 'Comunidad', icon: Users },
  { id: 'wellness', name: 'Bienestar', icon: Heart }
];

const productCategories = [
  'Tecnología',
  'Hogar y Jardín',
  'Moda y Belleza',
  'Deportes y Fitness',
  'Libros y Educación',
  'Alimentación',
  'Salud y Bienestar',
  'Entretenimiento',
  'Bebés y Niños',
  'Mascotas',
  'Automóviles',
  'Arte y Manualidades'
];

export default function LifestylePage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 1000]);
  const [priority, setPriority] = useState<string>('balanced');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleValueToggle = (valueId: string) => {
    setSelectedValues(prev => 
      prev.includes(valueId) 
        ? prev.filter(id => id !== valueId)
        : [...prev, valueId]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleApplyFilters = async () => {
    setIsLoading(true);
    
    try {
      // Aquí iría la lógica para aplicar filtros
      const filters = {
        role: selectedRole,
        values: selectedValues,
        categories: selectedCategories,
        budgetRange,
        priority
      };
      
      console.log('Applying lifestyle filters:', filters);
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir a la página de shop con filtros aplicados
      const params = new URLSearchParams({
        role: selectedRole,
        values: selectedValues.join(','),
        categories: selectedCategories.join(','),
        minPrice: budgetRange[0].toString(),
        maxPrice: budgetRange[1].toString(),
        priority
      });
      
      router.push(`/shop/new?${params.toString()}`);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedRole('');
    setSelectedValues([]);
    setSelectedCategories([]);
    setBudgetRange([0, 1000]);
    setPriority('balanced');
  };

  return (
    <Container className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Filtros de Estilo de Vida</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Personaliza tu experiencia de compra según tu estilo de vida, valores y preferencias. 
            Encuentra productos que realmente se ajusten a tu forma de vivir.
          </p>
        </div>

        {/* Lifestyle Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              ¿Cuál es tu rol principal?
            </CardTitle>
            <CardDescription>
              Selecciona el rol que mejor describe tu estilo de vida actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lifestyleRoles.map((role) => {
                const Icon = role.icon;
                return (
                  <Card
                    key={role.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedRole === role.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-full ${role.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="font-semibold">{role.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Values and Priorities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Valores Importantes
            </CardTitle>
            <CardDescription>
              Selecciona los valores que más te importan en tus compras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {lifestyleValues.map((value) => {
                const Icon = value.icon;
                const isSelected = selectedValues.includes(value.id);
                return (
                  <div
                    key={value.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleValueToggle(value.id)}
                  >
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
                    <span className={`font-medium ${isSelected ? 'text-primary' : ''}`}>
                      {value.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Budget Range */}
        <Card>
          <CardHeader>
            <CardTitle>Rango de Presupuesto</CardTitle>
            <CardDescription>
              Establece tu rango de presupuesto preferido
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="px-4">
              <Slider
                value={budgetRange}
                onValueChange={setBudgetRange}
                max={2000}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>S/. {budgetRange[0]}</span>
              <span>S/. {budgetRange[1]}</span>
            </div>
          </CardContent>
        </Card>

        {/* Product Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categorías de Interés</CardTitle>
            <CardDescription>
              Selecciona las categorías de productos que más te interesan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {productCategories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <Badge
                    key={category}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 justify-center py-2"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Shopping Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Prioridad de Compra</CardTitle>
            <CardDescription>
              ¿Qué es más importante para ti al momento de comprar?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={priority} onValueChange={setPriority}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price" id="price" />
                <Label htmlFor="price">Precio más bajo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quality" id="quality" />
                <Label htmlFor="quality">Mejor calidad</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="speed" id="speed" />
                <Label htmlFor="speed">Entrega rápida</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="balanced" id="balanced" />
                <Label htmlFor="balanced">Equilibrio entre precio y calidad</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="min-w-[150px]"
          >
            Limpiar Filtros
          </Button>
          <Button
            onClick={handleApplyFilters}
            disabled={isLoading || !selectedRole}
            className="min-w-[150px]"
          >
            {isLoading ? 'Aplicando...' : 'Aplicar Filtros'}
          </Button>
        </div>

        {/* Selected Filters Summary */}
        {(selectedRole || selectedValues.length > 0 || selectedCategories.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedRole && (
                <div>
                  <span className="font-medium">Rol: </span>
                  <Badge variant="secondary">
                    {lifestyleRoles.find(r => r.id === selectedRole)?.name}
                  </Badge>
                </div>
              )}
              
              {selectedValues.length > 0 && (
                <div>
                  <span className="font-medium">Valores: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedValues.map(valueId => {
                      const value = lifestyleValues.find(v => v.id === valueId);
                      return (
                        <Badge key={valueId} variant="secondary">
                          {value?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {selectedCategories.length > 0 && (
                <div>
                  <span className="font-medium">Categorías: </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedCategories.map(category => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <span className="font-medium">Presupuesto: </span>
                <Badge variant="secondary">
                  S/. {budgetRange[0]} - S/. {budgetRange[1]}
                </Badge>
              </div>
              
              <div>
                <span className="font-medium">Prioridad: </span>
                <Badge variant="secondary">
                  {priority === 'price' && 'Precio más bajo'}
                  {priority === 'quality' && 'Mejor calidad'}
                  {priority === 'speed' && 'Entrega rápida'}
                  {priority === 'balanced' && 'Equilibrio precio-calidad'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
}
