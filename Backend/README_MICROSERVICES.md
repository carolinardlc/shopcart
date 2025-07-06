# 🛍️ ShopCart Backend - Arquitectura de Microservicios

## 📋 Descripción

Backend de ShopCart implementado con **arquitectura de microservicios**, siguiendo las mejores prácticas de desarrollo distribuido, autenticación federada con OAuth 2.0, y comunicación asíncrona mediante eventos.

## 🏗️ Arquitectura

### Microservicios Implementados

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Frontend      │───▶│   API Gateway    │───▶│   Microservicios    │
│   (React)       │    │   Port: 5000     │    │                     │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌─────────────────┐    ┌─────────────────────┐
                       │   RabbitMQ      │    │   PostgreSQL        │
                       │   Port: 5672    │    │   Port: 5432        │
                       └─────────────────┘    └─────────────────────┘
```

### Servicios:

1. **🚪 API Gateway** (Puerto 5000)
   - Punto de entrada único
   - Autenticación JWT
   - Rate limiting y seguridad
   - Circuit breaker pattern

2. **👤 User Service** (Puerto 5001)
   - Gestión de usuarios
   - OAuth 2.0 con Google
   - Autenticación federada
   - Generación de JWT tokens

3. **📦 Product Service** (Puerto 5002)
   - CRUD de productos
   - Gestión de inventario
   - Control de stock
   - Events: stock updates

4. **🛒 Cart Service** (Puerto 5003)
   - Gestión de carritos
   - Items de carrito
   - Cálculo de totales
   - Persistencia de estado

5. **💳 Payment Service** (Puerto 5004)
   - Creación de órdenes
   - Procesamiento de pagos
   - Gestión de transacciones
   - Events: order lifecycle

6. **📂 Category Service** (Puerto 5005)
   - Gestión de categorías
   - Jerarquía de categorías
   - Filtros y búsquedas

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+
- RabbitMQ 3.8+
- PowerShell (Windows)

### Configuración Automática

```powershell
# 1. Configurar entorno (instala PostgreSQL, RabbitMQ, dependencias)
.\setup-environment.ps1

# 2. Iniciar todos los microservicios
.\start-microservices.ps1

# 3. Verificar que todo funciona
.\start-microservices.ps1 -Health
```

### Configuración Manual

1. **Clonar y navegar:**
```bash
cd Backend
```

2. **Configurar PostgreSQL:**
```bash
psql -U postgres -f setup-database.sql
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. **Instalar dependencias:**
```bash
cd microservices/api-gateway && npm install
cd ../user-service && npm install
cd ../product-service && npm install
cd ../cart-service && npm install
cd ../payment-service && npm install
cd ../category-service && npm install
```

5. **Iniciar servicios individualmente:**
```bash
# Terminal 1
cd microservices/api-gateway && npm start

# Terminal 2  
cd microservices/user-service && npm start

# Terminal 3
cd microservices/product-service && npm start

# Terminal 4
cd microservices/cart-service && npm start

# Terminal 5
cd microservices/payment-service && npm start

# Terminal 6
cd microservices/category-service && npm start
```

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopcart_db
DB_USER=shopcart_user
DB_PASSWORD=shopcart_password

# Puertos de microservicios
GATEWAY_PORT=5000
USER_SERVICE_PORT=5001
PRODUCT_SERVICE_PORT=5002
CART_SERVICE_PORT=5003
PAYMENT_SERVICE_PORT=5004
CATEGORY_SERVICE_PORT=5005

# URLs de servicios
USER_SERVICE_URL=http://localhost:5001
PRODUCT_SERVICE_URL=http://localhost:5002
CART_SERVICE_URL=http://localhost:5003
PAYMENT_SERVICE_URL=http://localhost:5004
CATEGORY_SERVICE_URL=http://localhost:5005

# OAuth Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URL=http://localhost:5001/api/users/auth/google/callback

# Seguridad
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Configuración OAuth Google

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear proyecto o seleccionar existente
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Configurar URLs autorizadas:
   - `http://localhost:5001/api/users/auth/google/callback`
6. Copiar Client ID y Client Secret al `.env`

## 📊 Health Checks & Monitoreo

### Verificar Estado de Servicios

```bash
# Health check agregado
curl http://localhost:5000/api/health

# Health individual
curl http://localhost:5001/api/users/health
curl http://localhost:5002/api/products/health
curl http://localhost:5003/api/cart/health
curl http://localhost:5004/api/payments/health
curl http://localhost:5005/api/categories/health
```

### Información del Sistema

```bash
# Información del gateway
curl http://localhost:5000/api/info
```

### Script de Health Check

```powershell
# Verificar todos los servicios
.\start-microservices.ps1 -Health
```

## 🔐 Autenticación y Seguridad

### OAuth 2.0 Flow

1. **Iniciar OAuth:**
```
GET http://localhost:5000/api/users/auth/google
```

2. **Callback OAuth:**
```
GET http://localhost:5001/api/users/auth/google/callback
```

3. **Verificar estado:**
```
GET http://localhost:5000/api/users/auth/status
```

### Uso de JWT Tokens

```javascript
// Header de autorización
Authorization: Bearer <jwt_token>

// Rutas protegidas requieren este header
POST /api/cart/items
GET /api/payments/orders
PUT /api/users/profile
```

### Rutas Públicas vs Privadas

**Públicas (no requieren autenticación):**
- `GET /api/products` - Listar productos
- `GET /api/categories` - Listar categorías  
- `GET /api/health` - Health checks
- `GET /api/users/auth/*` - OAuth endpoints

**Privadas (requieren JWT):**
- `POST /api/cart/*` - Operaciones de carrito
- `POST /api/payments/*` - Órdenes y pagos
- `PUT /api/users/*` - Actualizar perfil
- `POST /api/products/*` - Crear productos (admin)

## 📨 Eventos y Mensajería Asíncrona

### RabbitMQ Exchange

- **Exchange:** `shopcart_events`
- **Type:** `topic`
- **Routing Keys:** `service.action`

### Eventos Implementados

```javascript
// User Service publica
'user.registered' - Usuario registrado
'user.updated' - Usuario actualizado

// Payment Service publica  
'order.created' - Orden creada
'payment.completed' - Pago completado
'order.cancelled' - Orden cancelada

// Product Service escucha
'order.created' - Reduce stock
'order.cancelled' - Restaura stock
```

### Management UI de RabbitMQ

- **URL:** http://localhost:15672
- **Usuario:** guest
- **Password:** guest

## 🗄️ Base de Datos

### Esquema Principal (PostgreSQL)

```sql
-- Tablas principales
users              -- Usuarios y OAuth data
categories          -- Categorías de productos
products           -- Productos y stock
carts              -- Carritos de usuario
cart_items         -- Items en carrito
orders             -- Órdenes de compra
order_items        -- Items de orden
payments           -- Transacciones de pago
stock_movements    -- Historial de stock
user_sessions      -- Sesiones activas
```

### Inicializar Base de Datos

```bash
# Ejecutar script de configuración
psql -U postgres -f setup-database.sql
```

## 📡 API Endpoints

### API Gateway

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check agregado |
| GET | `/api/info` | Información del sistema |

### User Service

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users/auth/google` | Iniciar OAuth Google |
| GET | `/api/users/auth/google/callback` | Callback OAuth |
| GET | `/api/users/auth/status` | Estado autenticación |
| POST | `/api/users/auth/logout` | Cerrar sesión |
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:id` | Obtener usuario |

### Product Service

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar productos |
| GET | `/api/products/:id` | Obtener producto |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Eliminar producto |

### Cart Service

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cart/:userId` | Obtener carrito |
| POST | `/api/cart/items` | Agregar item |
| PUT | `/api/cart/items/:id` | Actualizar item |
| DELETE | `/api/cart/items/:id` | Remover item |
| DELETE | `/api/cart/:userId/clear` | Vaciar carrito |

### Payment Service

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/payments/orders` | Crear orden |
| GET | `/api/payments/orders/:id` | Obtener orden |
| POST | `/api/payments/process` | Procesar pago |
| GET | `/api/payments/orders` | Listar órdenes |

### Category Service

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categories` | Listar categorías |
| GET | `/api/categories/:id` | Obtener categoría |
| POST | `/api/categories` | Crear categoría |
| PUT | `/api/categories/:id` | Actualizar categoría |
| DELETE | `/api/categories/:id` | Eliminar categoría |

## 🛠️ Scripts Disponibles

### PowerShell Scripts

```powershell
# Configuración inicial completa
.\setup-environment.ps1

# Iniciar todos los servicios
.\start-microservices.ps1

# Modo desarrollo (nodemon)
.\start-microservices.ps1 -Dev

# Ejecutar en background
.\start-microservices.ps1 -Background

# Verificar health
.\start-microservices.ps1 -Health

# Detener servicios
.\start-microservices.ps1 -Stop
```

### NPM Scripts (por servicio)

```bash
npm start      # Producción
npm run dev    # Desarrollo (nodemon)
npm test       # Tests (cuando estén implementados)
```

## 🐳 Docker (Futuro)

### Docker Compose

```bash
# Construcción e inicio
docker-compose up --build

# Solo iniciar
docker-compose up

# Detener
docker-compose down

# Ver logs
docker-compose logs -f [service-name]
```

## 🧪 Testing

### Health Checks Manuales

```bash
# Test básico de conectividad
curl -f http://localhost:5000/api/health || echo "Gateway down"
curl -f http://localhost:5001/api/users/health || echo "User service down"

# Test de OAuth (requiere navegador)
open http://localhost:5000/api/users/auth/google

# Test de APIs públicas
curl http://localhost:5000/api/products
curl http://localhost:5000/api/categories
```

### Test de Eventos RabbitMQ

1. Abrir RabbitMQ Management: http://localhost:15672
2. Ir a Exchanges → `shopcart_events`
3. Verificar bindings y queues
4. Crear una orden y verificar eventos en logs

## 🔧 Troubleshooting

### Problemas Comunes

**Puerto ocupado:**
```bash
# Windows - matar proceso en puerto
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**PostgreSQL no conecta:**
```bash
# Verificar servicio
Get-Service postgresql*
# Reiniciar servicio
Restart-Service postgresql-x64-14
```

**RabbitMQ no conecta:**
```bash
# Verificar servicio
Get-Service RabbitMQ
# Reiniciar servicio
Restart-Service RabbitMQ
```

**Variables de entorno:**
```bash
# Verificar que .env existe y tiene valores correctos
Get-Content .env
```

### Logs y Debugging

```bash
# Ver logs de servicio específico
# Los logs aparecen en la consola de cada servicio

# Verificar conexión a DB
psql -U shopcart_user -d shopcart_db -h localhost

# Verificar RabbitMQ
rabbitmqctl status
```

## 📈 Performance y Escalabilidad

### Optimizaciones Implementadas

- **Índices de DB** para consultas frecuentes
- **Connection pooling** en PostgreSQL
- **Rate limiting** en API Gateway
- **Caching** de respuestas estáticas
- **Circuit breaker** pattern

### Scaling Horizontal

```bash
# Múltiples instancias del mismo servicio
PORT=5002 npm start  # Product Service instancia 1
PORT=5012 npm start  # Product Service instancia 2

# Load balancer en API Gateway (futura implementación)
```

## 🔮 Roadmap

### Próximas Características

- [ ] **Circuit Breaker** avanzado con Hystrix
- [ ] **Service Discovery** con Consul
- [ ] **Distributed Tracing** con Jaeger
- [ ] **Metrics** con Prometheus + Grafana
- [ ] **API Documentation** con Swagger/OpenAPI
- [ ] **Integration Tests** automatizados
- [ ] **Kubernetes** deployment
- [ ] **CI/CD** pipeline

### Mejoras de Seguridad

- [ ] **API Rate Limiting** por usuario
- [ ] **Input Validation** con Joi
- [ ] **SQL Injection** protection
- [ ] **HTTPS** enforcement
- [ ] **Security Headers** avanzados
- [ ] **Audit Logging** completo

## 📞 Soporte

### Recursos Útiles

- [Documentación de Arquitectura](./MICROSERVICES_ARCHITECTURE.md)
- [Configuración OAuth Google](https://developers.google.com/identity/protocols/oauth2)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Contacto

Para problemas, sugerencias o contribuciones, crear un issue en el repositorio.

---

⭐ **ShopCart Backend** - Arquitectura de microservicios robusta y escalable
