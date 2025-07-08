# 🔧 GUÍA RÁPIDA - CONECTAR pgAdmin4 a ShopCart DB

## 📋 Credenciales Verificadas
- **Host**: localhost  
- **Puerto**: 5432
- **Base de datos**: shopcart_db
- **Usuario**: postgres
- **Contraseña**: postgres

## 🔍 Estado Actual de la Base de Datos
✅ **PostgreSQL 17.5** está ejecutándose correctamente  
✅ **Base de datos shopcart_db** creada y con datos  
✅ **Tablas existentes**:
   - categories (4 registros)
   - products (8 registros)  
   - stock_movements (0 registros)

## 🚀 Pasos para Conectar en pgAdmin4

### 1. Abrir pgAdmin4
- Busca "pgAdmin 4" en el menú inicio
- Abre la aplicación

### 2. Agregar Nueva Conexión
- **Clic derecho** en "Servers" en el panel izquierdo
- Selecciona **"Register > Server..."**

### 3. Configurar la Conexión
#### **Pestaña "General"**
- **Name**: ShopCart DB
- **Server group**: Servers

#### **Pestaña "Connection"**
- **Host name/address**: localhost
- **Port**: 5432
- **Maintenance database**: shopcart_db
- **Username**: postgres
- **Password**: postgres
- **Save password**: ✅ (marcado)

### 4. Conectar
- Clic en **"Save"**
- Deberías ver "ShopCart DB" en la lista de servidores

### 5. Explorar la Base de Datos
- Expande: ShopCart DB > Databases > shopcart_db > Schemas > public > Tables
- Verás las tablas: categories, products, stock_movements

## 🔍 Verificar Datos

### Ver Categorías
```sql
SELECT * FROM categories;
```

### Ver Productos  
```sql
SELECT * FROM products;
```

### Ver Stock
```sql
SELECT * FROM stock_movements;
```

## 🛠️ Solución de Problemas

### ❌ Error: "could not connect to server"
```bash
# Verificar que PostgreSQL está ejecutándose
netstat -an | findstr :5432
```

### ❌ Error: "password authentication failed"
- Verifica que uses: usuario `postgres`, contraseña `postgres`
- Si no funciona, prueba con contraseña vacía

### ❌ Error: "database does not exist"
- Conecta primero a la base de datos `postgres`
- Luego busca `shopcart_db` en la lista de bases de datos

## 🎯 Conexión Rápida desde Terminal

### Conectar con psql
```bash
psql -h localhost -p 5432 -U postgres -d shopcart_db
```

### Verificar tablas
```sql
\dt
```

### Salir
```sql
\q
```

## 📝 Próximos Pasos

1. **✅ Conectar pgAdmin4** (usando los pasos de arriba)
2. **✅ Explorar los datos existentes**
3. **🚀 Iniciar microservicios**: `npm run start-microservices`
4. **🌐 Probar APIs**: http://localhost:3001/api/products

## 🔗 Enlaces Útiles
- **pgAdmin4**: http://localhost:5050 (si usas Docker)
- **PostgreSQL Docs**: https://www.postgresql.org/docs/17/
- **ShopCart Backend**: http://localhost:3000
