# ShopCart - Frontend & Backend

Este proyecto consta de un backend en Node.js/Express y un frontend en Next.js que se comunican entre sí.

## Estructura del Proyecto

```
shopcart/
├── Backend/          # Servidor Express (Puerto 5000)
│   ├── index.js      # Archivo principal del servidor
│   └── package.json  # Dependencias del backend
├── Frontend/         # Aplicación Next.js (Puerto 3000)
│   ├── app/          # Páginas de la aplicación
│   ├── components/   # Componentes React
│   ├── lib/          # Utilidades y servicios API
│   └── package.json  # Dependencias del frontend
└── README.md         # Este archivo
```

## Instalación

### Opción 1: Instalación Manual

1. **Instalar dependencias del Backend:**
   ```bash
   cd Backend
   npm install
   ```

2. **Instalar dependencias del Frontend:**
   ```bash
   cd Frontend
   npm install
   ```

### Opción 2: Scripts Automáticos (Recomendado)

Ejecuta uno de estos archivos desde la carpeta raíz:

- **Windows (Batch):** Doble clic en `start-servers.bat`
- **Windows (PowerShell):** Clic derecho en `start-servers.ps1` → "Ejecutar con PowerShell"

## Ejecución Manual

### 1. Iniciar el Backend
```bash
cd Backend
npm run dev
```
El servidor estará disponible en: http://localhost:5000

### 2. Iniciar el Frontend
```bash
cd Frontend
npm run dev
```
La aplicación estará disponible en: http://localhost:3000

## Endpoints de la API

### Backend (http://localhost:5000)
- `GET /api/saludo` - Devuelve un mensaje de saludo
- `POST /api/datos` - Recibe y procesa datos enviados desde el frontend

### Ejemplo de uso desde el frontend:
```javascript
import { apiService } from '@/lib/api';

// Obtener saludo
const saludo = await apiService.getSaludo();

// Enviar datos
const respuesta = await apiService.enviarDatos({ mensaje: "Hola desde el frontend" });
```

## Características

### Backend
- ✅ Servidor Express con CORS habilitado
- ✅ Middleware para parsear JSON
- ✅ Rutas de ejemplo para GET y POST
- ✅ Logging de datos recibidos

### Frontend
- ✅ Aplicación Next.js con TypeScript
- ✅ Servicio API centralizado (`lib/api.ts`)
- ✅ Componente de prueba para la conexión Backend-Frontend
- ✅ UI con Tailwind CSS y componentes shadcn/ui
- ✅ Variables de entorno para configuración

### Conexión
- ✅ CORS configurado correctamente
- ✅ Proxy de desarrollo configurado en Next.js
- ✅ Manejo de errores de conexión
- ✅ Componente de prueba en la página principal

## Componente de Prueba

La página principal incluye un componente `TestApiComponent` que demuestra:
- Obtener datos del backend (GET)
- Enviar datos al backend (POST)
- Manejo de estados de carga
- Manejo de errores de conexión

## Desarrollo

### Estructura de Archivos Importantes

**Backend:**
- `index.js` - Servidor principal con rutas API

**Frontend:**
- `lib/api.ts` - Servicio para comunicación con el backend
- `components/TestApiComponent.tsx` - Componente de prueba de conexión
- `app/page.tsx` - Página principal con el componente de prueba

### Variables de Entorno

El frontend utiliza estas variables de entorno (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## Solución de Problemas

### El frontend no puede conectar con el backend
1. Asegúrate de que el backend esté ejecutándose en el puerto 5000
2. Verifica que no haya errores de CORS
3. Comprueba que las URLs de la API sean correctas

### Error de dependencias
1. Elimina las carpetas `node_modules` de ambos proyectos
2. Ejecuta `npm install` en cada proyecto
3. Reinicia ambos servidores

### Puerto ocupado
Si algún puerto está ocupado, puedes cambiar:
- Backend: Modifica `PORT` en `Backend/index.js`
- Frontend: Ejecuta `npm run dev -- -p PUERTO_DESEADO`

## Scripts Disponibles

### Backend
- `npm run dev` - Inicia el servidor de desarrollo
- `npm start` - Inicia el servidor

### Frontend
- `npm run dev` - Inicia el servidor de desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

¡Tu aplicación está lista para usar! 🚀
