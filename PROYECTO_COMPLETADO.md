# ShopCart - E-commerce Backend & Frontend Project

## ✅ Proyecto Completado

Este proyecto implementa una aplicación completa de comercio electrónico con backend en Node.js/Express y PostgreSQL, y frontend en Next.js con TypeScript.

## 🏗️ Arquitectura del Sistema

### Backend (Node.js + Express + PostgreSQL)
- **Puerto:** 5000
- **Base de datos:** PostgreSQL
- **API REST:** Endpoints completos para CRUD

### Frontend (Next.js + TypeScript)
- **Puerto:** 3000
- **Framework:** Next.js 15 con TypeScript
- **UI:** Tailwind CSS + shadcn/ui components

## 📁 Estructura del Proyecto

```
shopcart/
├── Backend/
│   ├── index.js                 # Servidor principal
│   ├── index-simple.js          # Servidor simplificado para debug
│   ├── package.json
│   ├── .env                     # Configuración PostgreSQL
│   ├── setup-database.sql       # Script SQL de inicialización
│   ├── database/
│   │   ├── connection.js        # Conexión PostgreSQL
│   │   └── schema.js           # Esquemas y datos de ejemplo
│   ├── models/
│   │   ├── Product.js          # Modelo de productos
│   │   └── Category.js         # Modelo de categorías
│   ├── routes/
│   │   ├── products.js         # Rutas de productos
│   │   └── categories.js       # Rutas de categorías
│   └── scripts/
│       └── db-admin.js         # Administración de BD
├── Frontend/
│   ├── app/
│   │   ├── page.tsx            # Página principal con pruebas
│   │   ├── shop/page.tsx       # Tienda con productos reales
│   │   ├── admin/page.tsx      # Panel de administración
│   │   ├── blog/page.tsx       # Blog
│   │   ├── contact/page.tsx    # Contacto
│   │   └── deal/page.tsx       # Ofertas
│   ├── components/
│   │   ├── TestApiComponent.tsx # Componente de pruebas API
│   │   └── ui/                 # Componentes de UI
│   ├── lib/
│   │   └── api.ts              # Servicio API centralizado
│   └── constants/
│       └── data.ts             # Datos de navegación
├── start-servers.bat           # Script Windows para iniciar ambos servidores
└── start-servers.ps1           # Script PowerShell para iniciar ambos servidores
```

## 🚀 Funcionalidades Implementadas

### ✅ Backend API REST

**Endpoints de Productos:**
- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `POST /api/products/:id/stock` - Actualizar stock con historial

**Endpoints de Categorías:**
- `GET /api/categories` - Listar todas las categorías
- `GET /api/categories/:id` - Obtener categoría por ID
- `POST /api/categories` - Crear nueva categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

**Endpoints de Sistema:**
- `GET /api/health` - Estado de salud del sistema
- `GET /api/info` - Información de la API
- `GET /api/saludo` - Endpoint de prueba (compatible con versión anterior)
- `POST /api/datos` - Endpoint de prueba para envío de datos

### ✅ Base de Datos PostgreSQL

**Tablas implementadas:**
- `categories` - Categorías de productos
- `products` - Productos con relación a categorías
- `stock_movements` - Historial de movimientos de stock

**Características:**
- Restricciones de integridad referencial
- Índices para optimización
- Datos de ejemplo precargados
- Scripts de administración automatizados

### ✅ Frontend Web Application

**Páginas implementadas:**
- `/` - Página principal con componente de pruebas API
- `/shop` - Tienda con productos reales desde PostgreSQL
- `/admin` - Panel de administración completo
- `/blog`, `/contact`, `/deal` - Páginas adicionales

**Componentes destacados:**
- `TestApiComponent` - Pruebas de conexión y visualización de datos
- Sistema de filtros y búsqueda en la tienda
- CRUD completo en panel de administración
- Gestión de stock con historial

## 🔧 Configuración y Uso

### 1. Configuración de la Base de Datos

```bash
# En Backend/
npm run db:setup    # Crear tablas y datos de ejemplo
npm run db:test     # Probar conexión
npm run db:reset    # Limpiar y recrear tablas
npm run db:drop     # Eliminar todas las tablas
```

### 2. Iniciar el Sistema

**Opción 1: Scripts automáticos**
```bash
# Windows Command Prompt
start-servers.bat

# PowerShell
.\start-servers.ps1
```

**Opción 2: Manual**
```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend  
cd Frontend
npm run dev
```

### 3. URLs de Acceso

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health
- **API Info:** http://localhost:5000/api/info

## 📊 Estado de las Pruebas

### ✅ Pruebas Exitosas Completadas

1. **Conexión Backend-Frontend:** ✅ Funcionando
2. **Conexión PostgreSQL:** ✅ Funcionando
3. **Endpoints CRUD:** ✅ Todos operativos
4. **Carga de datos:** ✅ 8 productos y 4 categorías precargadas
5. **Interfaz de tienda:** ✅ Mostrando productos reales
6. **Panel de administración:** ✅ CRUD completo funcional
7. **Gestión de stock:** ✅ Con historial de movimientos
8. **Filtros y búsqueda:** ✅ Funcionando
9. **Diseño responsive:** ✅ Adaptable a móviles

## 🎯 Características Técnicas

### Backend
- **Express 4.18.2** (versión estable)
- **PostgreSQL** con driver `pg`
- **CORS** configurado para desarrollo
- **Variables de entorno** para configuración
- **Logging** de requests y queries
- **Manejo de errores** centralizado
- **Validaciones** de datos de entrada

### Frontend
- **Next.js 15** con TypeScript
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes
- **Servicio API centralizado** con tipos TypeScript
- **Estados reactivos** con React hooks
- **Diseño modular** y reutilizable

### Base de Datos
- **Esquema normalizado** con relaciones
- **Restricciones de integridad**
- **Índices para optimización**
- **Timestamps automáticos**
- **Gestión de stock** con historial

## 🔄 Próximos Pasos (Opcional)

1. **Autenticación y autorización** para el panel de administración
2. **Carrito de compras** funcional con persistencia
3. **Procesamiento de pedidos** y gestión de inventario
4. **Notificaciones** para stock bajo
5. **Reportes y analytics** de ventas
6. **Optimización de imágenes** y CDN
7. **Tests unitarios y de integración**
8. **Deployment** a producción

## 📝 Notas de Desarrollo

- El proyecto está completamente funcional en modo desarrollo
- La base de datos incluye datos de ejemplo para pruebas
- Todos los endpoints han sido probados y funcionan correctamente
- La interfaz es responsive y funciona en dispositivos móviles
- El código está bien documentado y estructurado

---

**Estado del Proyecto:** ✅ **COMPLETO Y FUNCIONAL**

**Última actualización:** Julio 2025
