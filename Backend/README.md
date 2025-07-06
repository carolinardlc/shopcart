# ShopCart Backend - PostgreSQL

Backend de la aplicación ShopCart con base de datos PostgreSQL para gestión de productos y stock.

## 🗄️ Base de Datos

### Prerrequisitos
- PostgreSQL instalado y ejecutándose
- Base de datos y usuario creados

### Configuración de PostgreSQL

1. **Instalar PostgreSQL** (si no lo tienes):
   - Windows: Descargar desde [postgresql.org](https://www.postgresql.org/download/windows/)
   - Usar el instalador y recordar la contraseña del usuario `postgres`

2. **Crear base de datos y usuario:**
   ```sql
   -- Conectar como postgres
   psql -U postgres
   
   -- Crear usuario
   CREATE USER shopcart_user WITH PASSWORD 'shopcart_password';
   
   -- Crear base de datos
   CREATE DATABASE shopcart_db OWNER shopcart_user;
   
   -- Dar permisos
   GRANT ALL PRIVILEGES ON DATABASE shopcart_db TO shopcart_user;
   ```

3. **Configurar variables de entorno:**
   Editar archivo `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=shopcart_db
   DB_USER=shopcart_user
   DB_PASSWORD=shopcart_password
   PORT=5000
   NODE_ENV=development
   ```

## 🚀 Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar base de datos por primera vez
```bash
npm run db:setup
```

### 3. Iniciar el servidor
```bash
npm run dev
```

## 📋 Scripts Disponibles

### Scripts del servidor:
- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo

### Scripts de base de datos:
- `npm run db:test` - Probar conexión a la base de datos
- `npm run db:setup` - Configurar BD por primera vez (crear tablas + datos)
- `npm run db:reset` - Reiniciar BD (eliminar y recrear todo)
- `npm run db:drop` - Eliminar todas las tablas
- `npm run db:seed` - Insertar datos de ejemplo

## 🗂️ Estructura de la Base de Datos

### Tablas principales:

#### `categories`
- `id` - ID único de la categoría
- `name` - Nombre de la categoría (único)
- `description` - Descripción de la categoría
- `created_at`, `updated_at` - Timestamps

#### `products`
- `id` - ID único del producto
- `name` - Nombre del producto
- `description` - Descripción del producto
- `price` - Precio del producto (decimal)
- `stock` - Cantidad en stock (entero)
- `category_id` - Referencia a la categoría
- `image_url` - URL de la imagen del producto
- `is_active` - Producto activo/inactivo (boolean)
- `created_at`, `updated_at` - Timestamps

#### `stock_movements`
- `id` - ID único del movimiento
- `product_id` - Referencia al producto
- `movement_type` - Tipo: 'IN', 'OUT', 'ADJUSTMENT'
- `quantity` - Cantidad del movimiento
- `previous_stock` - Stock anterior
- `new_stock` - Stock nuevo
- `reason` - Razón del movimiento
- `created_at` - Timestamp

## 🔌 API Endpoints

### Productos (`/api/products`)
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `PATCH /api/products/:id/stock` - Actualizar solo stock
- `DELETE /api/products/:id` - Eliminar producto (soft delete)
- `GET /api/products/:id/stock-movements` - Historial de stock
- `GET /api/products/stats/low-stock` - Productos con bajo stock
- `GET /api/products/stats/overview` - Estadísticas generales

### Categorías (`/api/categories`)
- `GET /api/categories` - Obtener todas las categorías
- `GET /api/categories/:id` - Obtener categoría por ID
- `GET /api/categories/:id/products` - Productos de una categoría
- `POST /api/categories` - Crear nueva categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Utilidades
- `GET /api/health` - Estado del servidor y BD
- `GET /api/info` - Información de la API
- `GET /api/saludo` - Endpoint de prueba

## 📊 Ejemplos de Uso

### Obtener todos los productos:
```bash
curl http://localhost:5000/api/products
```

### Crear un producto:
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Camiseta Nueva",
    "description": "Camiseta de algodón",
    "price": 29.99,
    "stock": 100,
    "category_id": 1
  }'
```

### Actualizar stock:
```bash
curl -X PATCH http://localhost:5000/api/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 75,
    "reason": "Venta"
  }'
```

### Obtener productos con bajo stock:
```bash
curl http://localhost:5000/api/products/stats/low-stock?threshold=20
```

## 🔧 Características Principales

### ✅ **Gestión completa de productos:**
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Control de stock con historial de movimientos
- Categorización de productos
- Soft delete (eliminación lógica)
- Búsqueda y filtrado

### ✅ **Auditoría de stock:**
- Registro de todos los movimientos de stock
- Tipos de movimiento: entrada, salida, ajuste
- Razón de cada movimiento
- Historial completo por producto

### ✅ **Validaciones y seguridad:**
- Validación de datos de entrada
- Manejo de errores robusto
- Transacciones de base de datos
- Logging de actividades

### ✅ **Estadísticas y reportes:**
- Productos con bajo stock
- Estadísticas generales de inventario
- Conteo de productos por categoría

## 🛠️ Troubleshooting

### Error de conexión a PostgreSQL:
1. Verificar que PostgreSQL esté ejecutándose
2. Verificar credenciales en `.env`
3. Ejecutar `npm run db:test` para probar conexión

### Error "relation does not exist":
1. Ejecutar `npm run db:setup` para crear tablas
2. Si persiste, ejecutar `npm run db:reset`

### Puerto ocupado:
1. Cambiar `PORT` en archivo `.env`
2. O detener proceso que usa el puerto 5000

Tu backend ahora tiene una base de datos PostgreSQL completamente funcional! 🎉
