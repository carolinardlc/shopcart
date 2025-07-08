'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const emotionalStates = [
  { value: 'happy', label: '😊 Feliz', color: 'text-yellow-500' },
  { value: 'excited', label: '🤩 Emocionado', color: 'text-orange-500' },
  { value: 'calm', label: '😌 Tranquilo', color: 'text-blue-500' },
  { value: 'motivated', label: '💪 Motivado', color: 'text-green-500' },
  { value: 'romantic', label: '💕 Romántico', color: 'text-pink-500' },
  { value: 'adventurous', label: '🚀 Aventurero', color: 'text-purple-500' },
  { value: 'nostalgic', label: '🌅 Nostálgico', color: 'text-indigo-500' },
  { value: 'creative', label: '🎨 Creativo', color: 'text-teal-500' }
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    emotionalState: '',
    plan: 'free',
    acceptTerms: false,
    acceptPrivacy: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validaciones
      if (formData.password !== formData.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      
      if (!formData.acceptTerms || !formData.acceptPrivacy) {
        alert('Debes aceptar los términos y condiciones y la política de privacidad');
        return;
      }

      // Aquí iría la lógica de registro
      console.log('Register attempt:', formData);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir después del registro exitoso
      router.push('/auth/login');
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // Implementar Google OAuth
    console.log('Google register');
  };

  const handleFacebookRegister = () => {
    // Implementar Facebook OAuth
    console.log('Facebook register');
  };

  return (
    <Container className="min-h-screen flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
          <CardDescription className="text-center">
            Únete a ShopCart y descubre una nueva forma de comprar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tu contraseña"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Estado Emocional Inicial */}
            <div className="space-y-3">
              <Label>Estado Emocional Inicial (Opcional)</Label>
              <p className="text-sm text-muted-foreground">
                Esto nos ayudará a personalizar tu experiencia de compra
              </p>
              <Select value={formData.emotionalState} onValueChange={(value: string) => handleInputChange('emotionalState', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu estado emocional" />
                </SelectTrigger>
                <SelectContent>
                  {emotionalStates.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      <span className={state.color}>{state.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selección de Plan */}
            <div className="space-y-3">
              <Label>Selecciona tu Plan</Label>
              <RadioGroup 
                value={formData.plan} 
                onValueChange={(value: string) => handleInputChange('plan', value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="free" id="free" />
                  <div className="flex-1">
                    <Label htmlFor="free" className="font-medium">Plan Gratuito</Label>
                    <p className="text-sm text-muted-foreground">
                      Funcionalidades básicas, búsqueda limitada
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="premium" id="premium" />
                  <div className="flex-1">
                    <Label htmlFor="premium" className="font-medium">Plan Premium</Label>
                    <p className="text-sm text-muted-foreground">
                      Todas las funcionalidades, búsqueda ilimitada
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      S/15 mensual - S/150 anual
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Términos y Condiciones */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked: boolean) => handleInputChange('acceptTerms', checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  Acepto los{' '}
                  <Button variant="link" className="p-0 h-auto text-sm">
                    términos y condiciones
                  </Button>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="privacy" 
                  checked={formData.acceptPrivacy}
                  onCheckedChange={(checked: boolean) => handleInputChange('acceptPrivacy', checked as boolean)}
                />
                <Label htmlFor="privacy" className="text-sm">
                  Acepto la{' '}
                  <Button variant="link" className="p-0 h-auto text-sm">
                    política de privacidad
                  </Button>
                  {' '}conforme a la Ley de Protección de Datos del Perú
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !formData.acceptTerms || !formData.acceptPrivacy}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O regístrate con
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleRegister}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Registrarse con Google
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleFacebookRegister}
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Registrarse con Facebook
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => router.push('/auth/login')}
              >
                Inicia sesión aquí
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
