# ShopCart - Arquitectura de Microservicios

## 📋 Visión General

ShopCart ha sido reestructurado siguiendo el patrón de microservicios, implementando las siguientes decisiones arquitectónicas:

### 🏗️ Decisiones Arquitectónicas Implementadas

#### 1. Arquitectura de Microservicios
- **Decisión**: Migración de arquitectura monolítica a microservicios
- **Sustento**: Escalabilidad granular, tolerancia a fallos, independencia tecnológica
- **Implementación**: 6 servicios independientes + API Gateway

#### 2. Distribución de Responsabilidades
- **Frontend**: Validaciones simples, UI/UX, interactividad
- **Backend**: Lógica de negocio, persistencia, seguridad
- **Implementación**: Separación clara entre capa de presentación y servicios

#### 3. Identidad Federada
- **Decisión**: Uso de OAuth 2.0 con Google como IdP
- **Sustento**: Seguridad robusta, escalabilidad, reducción de complejidad
- **Implementación**: Passport.js + Google OAuth Strategy

#### 4. Comunicación entre Servicios
- **Síncrona**: REST API para operaciones inmediatas
- **Asíncrona**: RabbitMQ para eventos y desacoplamiento
- **Implementación**: HTTP para requests directos, eventos para notificaciones

#### 5. Modelo de Datos
- **Principal**: PostgreSQL (relacional) para integridad y consistencia
- **Sesiones**: Express-session para manejo de estado
- **Implementación**: Esquemas separados por dominio

## 🏢 Arquitectura de Servicios

### API Gateway (Puerto 5000)
```
📡 Punto de entrada único
├── Autenticación JWT
├── Rate Limiting
├── Circuit Breaker
├── Health Checking
└── Proxy a microservicios
```

**Responsabilidades:**
- Punto de entrada único para el frontend
- Autenticación y autorización
- Rate limiting y seguridad
- Enrutamiento a microservicios
- Health checking agregado

**Tecnologías:**
- Express.js
- JWT para autenticación
- Helmet para seguridad
- Morgan para logging
- http-proxy-middleware

### User Service (Puerto 5001)
```
👤 Gestión de usuarios
├── OAuth 2.0 Google
├── JWT Token Generation
├── Session Management
└── RabbitMQ Events
```

**Responsabilidades:**
- Registro y autenticación de usuarios
- Integración con Google OAuth 2.0
- Generación de tokens JWT
- Gestión de sesiones
- Publicación de eventos de usuario

**Tecnologías:**
- Express.js
- Passport.js + Google Strategy
- PostgreSQL
- RabbitMQ (amqplib)
- bcrypt para hashing

**Endpoints Principales:**
- `GET /api/users/auth/google` - Iniciar OAuth
- `GET /api/users/auth/google/callback` - Callback OAuth
- `GET /api/users/auth/status` - Estado de autenticación
- `POST /api/users/auth/logout` - Cerrar sesión

### Product Service (Puerto 5002)
```
📦 Gestión de productos
├── CRUD de productos
├── Gestión de stock
├── Event Handling
└── RabbitMQ Integration
```

**Responsabilidades:**
- CRUD de productos
- Gestión de inventario y stock
- Escucha eventos de órdenes
- Actualización automática de stock

**Eventos que maneja:**
- `order.created` - Reduce stock
- `order.cancelled` - Restaura stock

### Cart Service (Puerto 5003)
```
🛒 Gestión de carrito
├── Carrito por usuario
├── Gestión de items
├── Cálculo de totales
└── Estado del carrito
```

**Responsabilidades:**
- Gestión de carritos de compra
- Adición/eliminación de productos
- Cálculo de totales
- Persistencia de estado

### Payment Service (Puerto 5004)
```
💳 Gestión de pagos y órdenes
├── Creación de órdenes
├── Procesamiento de pagos
├── Event Publishing
└── Transaction Management
```

**Responsabilidades:**
- Creación y gestión de órdenes
- Procesamiento de pagos
- Transacciones atómicas
- Publicación de eventos de orden

**Eventos que publica:**
- `order.created` - Nueva orden creada
- `payment.completed` - Pago completado
- `order.cancelled` - Orden cancelada

### Category Service (Puerto 5005)
```
📂 Gestión de categorías
├── CRUD de categorías
├── Jerarquía de categorías
├── Filtros y búsqueda
└── Relación con productos
```

**Responsabilidades:**
- Gestión de categorías de productos
- Mantenimiento de jerarquías
- Filtros y búsquedas
- Relaciones con productos

## 🔄 Flujo de Comunicación

### Comunicación Síncrona (REST)
```
Frontend → API Gateway → Microservicio → PostgreSQL
```

### Comunicación Asíncrona (Events)
```
Service A → RabbitMQ → Service B
```

**Ejemplos de eventos:**
1. **Registro de usuario**: User Service → RabbitMQ → Analytics Service
2. **Creación de orden**: Payment Service → RabbitMQ → Product Service
3. **Actualización de stock**: Product Service → RabbitMQ → Notification Service

## 🗄️ Modelo de Datos

### Base de Datos Relacional (PostgreSQL)
- **Tablas principales**: users, products, categories, carts, orders, payments
- **Relaciones**: Foreign keys para integridad referencial
- **Índices**: Optimización de consultas frecuentes

### Esquemas por Servicio:
- **Users**: usuarios, sesiones, OAuth data
- **Products**: productos, stock, movimientos
- **Categories**: categorías, jerarquías
- **Carts**: carritos, items de carrito
- **Orders**: órdenes, items de orden, pagos

## 🔐 Seguridad

### Autenticación y Autorización
- **OAuth 2.0** con Google como IdP
- **JWT tokens** para sesiones
- **Passport.js** para estrategias de auth
- **CORS** configurado para origen específico

### Seguridad en API Gateway
- **Helmet** para headers de seguridad
- **Rate Limiting** (100 req/15min por IP)
- **Input validation** y sanitización
- **HTTPS ready** para producción

### Rutas Públicas vs Privadas
**Públicas:**
- Health checks
- Información del sistema
- OAuth endpoints
- Productos (GET)
- Categorías (GET)

**Privadas (requieren JWT):**
- Gestión de carrito
- Creación de órdenes
- Datos de usuario
- Operaciones de escritura

## 🚀 Despliegue y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- RabbitMQ 3.8+

### Variables de Entorno (.env)
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shopcart_db
DB_USER=shopcart_user
DB_PASSWORD=shopcart_password

# Microservicios
GATEWAY_PORT=5000
USER_SERVICE_PORT=5001
PRODUCT_SERVICE_PORT=5002
# ... etc

# OAuth Google
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# Seguridad
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

### Scripts de Inicialización

#### Configuración automática:
```powershell
.\setup-environment.ps1  # Instala PostgreSQL, RabbitMQ, Node.js
```

#### Iniciar todos los servicios:
```powershell
.\start-microservices.ps1  # Windows
```
```bash
./start-microservices.sh   # Linux
```

## 📊 Monitoreo y Health Checks

### Health Endpoints
- **API Gateway**: `GET /api/health` - Estado agregado
- **Cada servicio**: `GET /api/{service}/health` - Estado individual

### Logging
- **Morgan** en API Gateway para requests HTTP
- **Console logging** estructurado en cada servicio
- **Timestamps** en todos los logs

### Métricas Disponibles
- Response times
- Status de servicios
- Uptime del gateway
- Estado de conexiones DB/RabbitMQ

## 🔮 Próximos Pasos

### Implementaciones Futuras
1. **Containerización**: Docker + Docker Compose
2. **Orquestación**: Kubernetes para producción
3. **Service Discovery**: Consul o etcd
4. **Circuit Breaker**: Hystrix o similar
5. **Distributed Tracing**: Jaeger o Zipkin
6. **Métricas avanzadas**: Prometheus + Grafana

### Escalabilidad
- Load balancing con múltiples instancias
- Horizontal scaling por servicio
- Database sharding si es necesario
- CDN para assets estáticos

## 📞 Endpoints Principales

### API Gateway
- `GET /api/health` - Health check agregado
- `GET /api/info` - Información del sistema

### User Service
- `GET /api/users/auth/google` - OAuth login
- `GET /api/users/auth/status` - Estado auth
- `POST /api/users/auth/logout` - Logout

### Product Service
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Detalle producto
- `POST /api/products` - Crear producto (admin)

### Cart Service
- `GET /api/cart/:userId` - Obtener carrito
- `POST /api/cart/items` - Agregar item
- `DELETE /api/cart/items/:id` - Remover item

### Payment Service
- `POST /api/payments/orders` - Crear orden
- `POST /api/payments/process` - Procesar pago
- `GET /api/payments/orders/:id` - Estado orden

## 🎯 Beneficios Logrados

### Escalabilidad
- Servicios independientes escalables
- Separación de dominios de negocio
- Despliegues independientes

### Mantenibilidad
- Código modular y desacoplado
- Responsabilidades claras
- Testing independiente por servicio

### Seguridad
- Autenticación federada robusta
- Tokens JWT seguros
- Rate limiting y protección

### Resilencia
- Tolerancia a fallos por servicio
- Health checking automatizado
- Comunicación asíncrona desacoplada
