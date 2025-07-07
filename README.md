# 🚀 ShopCart - Arquitectura de Microservicios

## ⚡ INICIO RÁPIDO (Para Compañeros del Equipo)

### 🎯 Opción 1: Instalación COMPLETAMENTE automática (RECOMENDADA)
**¡NUEVO!** Instala TODO automáticamente, incluso si no tienes nada.

```powershell
# 1. Clonar el repo
git clone [URL_DEL_REPOSITORIO]
cd shopcart

# 2. Abrir PowerShell como Administrador
# 3. Ejecutar UN SOLO comando (¡instala Node.js, PostgreSQL, RabbitMQ, etc!)
.\INICIAR_TODO.ps1
```

### 🎯 Opción 2: Inicio rápido (si ya tienes todo instalado)
```powershell
.\INICIAR_RAPIDO.ps1
```

### 🎯 Opción 3: Configuración manual paso a paso
Ver guía completa en: **[GUIA_INSTALACION_COMPLETA.md](GUIA_INSTALACION_COMPLETA.md)**

---

## 🛠️ Scripts Útiles

| Script | Descripción | ¿Cuándo usar? |
|--------|-------------|---------------|
| `.\INICIAR_TODO.ps1` | 🚀 Instala TODO y ejecuta el sistema completo | **Primera vez o si faltan dependencias** |
| `.\INICIAR_RAPIDO.ps1` | ⚡ Inicia solo los servicios (sin instalar) | **Si ya tienes todo instalado** |
| `.\VERIFICAR_SISTEMA.ps1` | 🔍 Verifica estado de todos los servicios | **Para debugging** |
| `.\DETENER_TODO.ps1` | 🛑 Detiene todos los servicios | **Para parar el sistema** |
| `.\GENERAR_REPORTE.ps1` | 📊 Genera reporte detallado del sistema | **Si algo no funciona** |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Frontend      │───▶│   API Gateway    │───▶│   Microservicios    │
│   (Next.js)     │    │   Port: 5000     │    │   (6 servicios)     │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌─────────────────┐    ┌─────────────────────┐
                       │   RabbitMQ      │    │   PostgreSQL        │
                       │   Port: 5672    │    │   Port: 5432        │
                       └─────────────────┘    └─────────────────────┘
```

### 🎯 URLs del Sistema
- **🎨 Aplicación**: http://localhost:3000
- **🚪 API Gateway**: http://localhost:5000
- **📊 RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **🗄️ PostgreSQL**: localhost:5432

### 🔧 Microservicios
- **🚪 API Gateway (5000)** - Punto único de entrada, autenticación JWT
- **👤 User Service (5001)** - OAuth Google + gestión de usuarios
- **📦 Product Service (5002)** - CRUD productos + gestión de stock
- **🛒 Cart Service (5003)** - Gestión de carritos de compra
- **💳 Payment Service (5004)** - Órdenes y pagos + eventos
- **📂 Category Service (5005)** - Gestión de categorías

---

## 📁 Estructura del Proyecto

```
shopcart/
├── INICIAR_TODO.ps1           # 🚀 Script principal para iniciar todo
├── VERIFICAR_SISTEMA.ps1      # 🔍 Verificar estado del sistema
├── DETENER_TODO.ps1           # 🛑 Detener todos los servicios
├── GUIA_INSTALACION_COMPLETA.md # 📖 Guía detallada paso a paso
├── Backend/                   # Microservicios (Puertos 5000-5005)
│   ├── microservices/         
│   │   ├── api-gateway/       # Gateway principal
│   │   ├── user-service/      # Usuarios y OAuth
│   │   ├── product-service/   # Productos y stock
│   │   ├── cart-service/      # Carritos
│   │   ├── payment-service/   # Pagos y órdenes
│   │   └── category-service/  # Categorías
│   ├── setup-environment.ps1  # Configuración automática
│   ├── start-microservices.ps1 # Iniciar servicios
│   └── setup-database.sql     # Esquemas de DB
├── Frontend/                  # Aplicación Next.js (Puerto 3000)
│   ├── app/                   # Páginas de la aplicación
│   ├── components/            # Componentes React
│   └── lib/                   # Servicios API
└── README.md                  # Este archivo
```

## 🚀 Inicio Rápido

### Configuración Automática (Recomendado)

```powershell
# 1. Configurar entorno completo (PostgreSQL, RabbitMQ, dependencias)
cd Backend
.\setup-environment.ps1

# 2. Iniciar todos los microservicios
.\start-microservices.ps1

# 3. Verificar que los servicios funcionen
.\start-microservices.ps1 -Health

# 4. Iniciar frontend (en nueva terminal)
cd ..\Frontend
npm run dev
```

### Scripts Automáticos Alternativos

Desde la carpeta raíz:
- **Windows (Batch):** Doble clic en `start-servers.bat`
- **Windows (PowerShell):** Clic derecho en `start-servers.ps1` → "Ejecutar con PowerShell"

## 🗄️ Acceso a la Base de Datos

### Opción 1: Script de Acceso Rápido

```powershell
cd Backend

# Conectar a la base de datos
.\db-access.ps1

# Ver información de la DB
.\db-access.ps1 info

# Ver datos de ejemplo
.\db-access.ps1 samples

# Ver todas las opciones
.\db-access.ps1 help
```

### Opción 2: Línea de Comandos

```bash
# Conectar directamente
psql -h localhost -p 5432 -U shopcart_user -d shopcart_db
# Contraseña: shopcart_password
```

### Opción 3: Herramientas Gráficas

**pgAdmin (Recomendado):**
```powershell
choco install pgadmin4
```

**Configuración de conexión:**
- Host: `localhost`
- Puerto: `5432`
- Base de datos: `shopcart_db`
- Usuario: `shopcart_user`
- Contraseña: `shopcart_password`

## Instalación

### Opción 1: Instalación Manual

1. **Instalar dependencias del Backend:**
   ```bash
   cd Backend
   
   # Instalar dependencias de cada microservicio
   cd microservices/api-gateway && npm install && cd ../..
   cd microservices/user-service && npm install && cd ../..
   cd microservices/product-service && npm install && cd ../..
   cd microservices/cart-service && npm install && cd ../..
   cd microservices/payment-service && npm install && cd ../..
   cd microservices/category-service && npm install && cd ../..
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

### 1. Iniciar los Microservicios

```powershell
# Opción A: Script automatizado (Recomendado)
cd Backend
.\start-microservices.ps1

# Opción B: Manual (6 terminales separadas)
# Terminal 1 - API Gateway
cd Backend/microservices/api-gateway && npm start

# Terminal 2 - User Service  
cd Backend/microservices/user-service && npm start

# Terminal 3 - Product Service
cd Backend/microservices/product-service && npm start

# Terminal 4 - Cart Service
cd Backend/microservices/cart-service && npm start

# Terminal 5 - Payment Service
cd Backend/microservices/payment-service && npm start

# Terminal 6 - Category Service
cd Backend/microservices/category-service && npm start
```

**Servicios disponibles en:**
- API Gateway: http://localhost:5000
- User Service: http://localhost:5001
- Product Service: http://localhost:5002
- Cart Service: http://localhost:5003
- Payment Service: http://localhost:5004
- Category Service: http://localhost:5005

### 2. Iniciar el Frontend
```bash
cd Frontend
npm run dev
```
La aplicación estará disponible en: http://localhost:3000

## 📡 Endpoints de la API

### API Gateway (http://localhost:5000)
- `GET /api/health` - Health check de todos los servicios
- `GET /api/info` - Información del sistema
- `GET /api/products` - Listar productos (proxy)
- `GET /api/users/auth/google` - Iniciar OAuth Google
- `POST /api/cart/items` - Agregar al carrito (requiere auth)

### Autenticación OAuth 2.0
```javascript
// Iniciar login con Google
window.location.href = 'http://localhost:5000/api/users/auth/google';

// Verificar estado de autenticación
fetch('http://localhost:5000/api/users/auth/status', {
  credentials: 'include'
});
```

### Ejemplo de uso desde el frontend:
```javascript
import { apiService } from '@/lib/api';

// Obtener productos (público)
const productos = await apiService.getProducts();

// Agregar al carrito (requiere autenticación)
const resultado = await apiService.addToCart({
  productId: 1,
  quantity: 2
});
```

## 🔐 Autenticación y Seguridad

### ⚠️ Configuración de OAuth 2.0 con Google

**IMPORTANTE:** Las credenciales OAuth NO están incluidas en el repositorio por seguridad.

1. **Configurar Google OAuth:**
   - Sigue la guía detallada: [`CONFIGURACION_OAUTH.md`](./CONFIGURACION_OAUTH.md)
   - Crear proyecto en [Google Cloud Console](https://console.cloud.google.com/)
   - Configurar credenciales OAuth 2.0
   - URL de callback: `http://localhost:5001/api/users/auth/google/callback`

2. **Configurar archivos .env:**
   ```bash
   # Copiar archivos de ejemplo
   cp Backend/.env.example Backend/.env
   cp Backend/microservices/api-gateway/.env.example Backend/microservices/api-gateway/.env
   cp Frontend/.env.local.example Frontend/.env.local
   
   # Editar y reemplazar credenciales reales
   ```

### JWT Tokens

Las rutas protegidas requieren header de autorización:
```javascript
// Header requerido para rutas privadas
Authorization: Bearer <jwt_token>
```

**Rutas públicas:** productos, categorías, health checks
**Rutas privadas:** carrito, pagos, perfil de usuario

## 🔍 Monitoreo y Health Checks

### Verificar Estado de Servicios

```powershell
# Script de health check
cd Backend
.\start-microservices.ps1 -Health

# O manualmente
curl http://localhost:5000/api/health
```

### RabbitMQ Management UI

- **URL:** http://localhost:15672
- **Usuario:** guest
- **Password:** guest
const respuesta = await apiService.enviarDatos({ mensaje: "Hola desde el frontend" });
```

## 📊 Base de Datos PostgreSQL

### Consultas Útiles

```sql
-- Ver todas las tablas creadas
\dt

-- Explorar datos de ejemplo
SELECT * FROM users;
SELECT * FROM products p JOIN categories c ON p.category_id = c.id;
SELECT * FROM carts WHERE status = 'active';

-- Ver estructura de tablas
\d users
\d products
\d orders
```

### Tablas Principales

- **users** - Usuarios y datos de OAuth
- **categories** - Categorías de productos
- **products** - Productos, precios y stock
- **carts / cart_items** - Carritos de compra
- **orders / order_items** - Órdenes de compra
- **payments** - Transacciones de pago
- **stock_movements** - Historial de movimientos de inventario

## 🎯 Características Implementadas

### Arquitectura de Microservicios
- ✅ 6 microservicios independientes + API Gateway
- ✅ Comunicación REST síncrona
- ✅ Eventos asíncronos con RabbitMQ
- ✅ Base de datos PostgreSQL compartida con separación lógica
- ✅ Health checks y monitoreo

### Autenticación y Seguridad
- ✅ OAuth 2.0 con Google (Identidad Federada)
- ✅ JWT tokens para sesiones
- ✅ Rate limiting en API Gateway
- ✅ CORS configurado correctamente
- ✅ Validación de rutas públicas vs privadas

### Backend (Microservicios)
- ✅ API Gateway con proxy inteligente
- ✅ User Service con OAuth Google
- ✅ Product Service con gestión de stock
- ✅ Cart Service para carritos de compra
- ✅ Payment Service para órdenes y pagos
- ✅ Category Service para categorización
- ✅ Eventos asíncronos (order.created, user.registered, etc.)

### Frontend
- ✅ Aplicación Next.js con TypeScript
- ✅ Servicio API centralizado
- ✅ Componente de prueba para conexión Backend-Frontend
- ✅ UI con Tailwind CSS y componentes shadcn/ui
- ✅ Variables de entorno para configuración

### Base de Datos
- ✅ PostgreSQL con esquemas optimizados
- ✅ Índices para consultas frecuentes
- ✅ Relaciones entre entidades bien definidas
- ✅ Datos de ejemplo para desarrollo
- ✅ Triggers para timestamps automáticos

## 🛠️ Scripts Disponibles

### Backend (Microservicios)

```powershell
# Configuración inicial
.\setup-environment.ps1

# Gestión de servicios
.\start-microservices.ps1          # Iniciar todos
.\start-microservices.ps1 -Dev     # Modo desarrollo (nodemon)
.\start-microservices.ps1 -Health  # Verificar estado
.\start-microservices.ps1 -Stop    # Detener todos

# Base de datos
.\db-access.ps1                    # Conectar a PostgreSQL
.\db-access.ps1 info              # Información de la DB
.\db-access.ps1 samples           # Ver datos de ejemplo
```

### Por Microservicio

```bash
cd Backend/microservices/[servicio]
npm start      # Producción
npm run dev    # Desarrollo (nodemon)
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

### Frontend

```bash
cd Frontend
npm run dev    # Desarrollo con Turbopack
npm run build  # Construir para producción  
npm start      # Servidor de producción
npm run lint   # Ejecutar linter
```

## 🐳 Docker (Futuro)

El proyecto incluye `docker-compose.yml` para futura containerización:

```bash
cd Backend
docker-compose up --build  # Construir e iniciar
docker-compose up          # Solo iniciar
docker-compose down        # Detener
```

## 📚 Documentación Adicional

- **[Arquitectura de Microservicios](Backend/MICROSERVICES_ARCHITECTURE.md)** - Documentación técnica detallada
- **[README del Backend](Backend/README_MICROSERVICES.md)** - Guía completa del backend
- **[Configuración OAuth Google](https://developers.google.com/identity/protocols/oauth2)** - Documentación oficial

## 🔧 Solución de Problemas

### El frontend no puede conectar con el backend
1. Verificar que todos los microservicios estén ejecutándose:
   ```powershell
   .\start-microservices.ps1 -Health
   ```
2. Comprobar que PostgreSQL y RabbitMQ estén ejecutándose
3. Verificar URLs en variables de entorno

### Error de dependencias
```bash
# Limpiar e reinstalar (en cada microservicio)
rm -rf node_modules package-lock.json
npm install
```

### PostgreSQL no conecta
```powershell
# Verificar servicio
Get-Service postgresql*

# Reiniciar servicio  
Restart-Service postgresql-x64-14

# Verificar conexión manualmente
.\db-access.ps1
```

### RabbitMQ no disponible
```powershell
# Verificar servicio
Get-Service RabbitMQ

# Reiniciar servicio
Restart-Service RabbitMQ

# Management UI
http://localhost:15672 (guest/guest)
```

### Puertos ocupados
```bash
# Windows - verificar puerto ocupado
netstat -ano | findstr :5000

# Matar proceso
taskkill /PID <PID> /F
```

## 🚀 Próximos Pasos

### Para Desarrollo
1. **Configurar OAuth Google** con credenciales reales
2. **Adaptar Frontend** para consumir el API Gateway
3. **Implementar autenticación** en componentes React
4. **Agregar más endpoints** según necesidades del negocio

### Para Producción
1. **Configurar HTTPS** y certificados SSL
2. **Implementar logging** centralizado
3. **Agregar métricas** y monitoring
4. **Configurar CI/CD** pipeline
5. **Desplegar en cloud** (AWS, Azure, GCP)

## 📞 Soporte

Para problemas específicos:
- **Base de datos:** Usar `.\db-access.ps1 help`
- **Microservicios:** Revisar logs en cada terminal
- **Autenticación:** Verificar configuración OAuth en `.env`
- **Health checks:** Ejecutar `.\start-microservices.ps1 -Health`

---

🛍️ **ShopCart** - E-commerce con arquitectura de microservicios moderna y escalable
