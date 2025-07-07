# 🚀 GUÍA COMPLETA DE INSTALACIÓN - ShopCart

## 📋 PASO A PASO PARA EJECUTAR EL PROYECTO COMPLETO

Esta guía está diseñada para que cualquier persona pueda ejecutar el proyecto **ShopCart** desde cero, sin tener nada instalado previamente.

## 🛠️ PRERREQUISITOS MÍNIMOS

- **Windows 10/11** (Scripts optimizados para PowerShell)
- **Conexión a Internet** (para descargar dependencias)
- **Permisos de Administrador** (para instalar software)

---

## 🎯 OPCIÓN 1: INSTALACIÓN COMPLETAMENTE AUTOMÁTICA (SÚPER RECOMENDADA)

**¡NUEVO!** Ahora el script instala TODO automáticamente, incluso si no tienes nada instalado.

### Pasos (Solo 3 comandos):
```bash
# 1. Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd shopcart

# 2. Abrir PowerShell como Administrador
# Clic derecho en el botón de Windows → "Windows PowerShell (Administrador)"

# 3. Ejecutar script automático (¡INSTALA TODO!)
.\INICIAR_TODO.ps1
```

### ¿Qué hace automáticamente?
- ✅ **Instala Node.js** (si no está instalado)
- ✅ **Instala PostgreSQL** (si no está instalado)
- ✅ **Instala RabbitMQ** (si no está instalado)
- ✅ **Configura la base de datos** automáticamente
- ✅ **Instala todas las dependencias** de los 7 proyectos
- ✅ **Inicia los 6 microservicios** (puertos 5000-5005)
- ✅ **Inicia el frontend** (puerto 3000)
- ✅ **Verifica que todo funcione** con health checks
- ✅ **Ofrece abrir el navegador** automáticamente

### Tiempo estimado:
- **Primera vez (instalación completa)**: 10-15 minutos
- **Siguientes veces**: 1-2 minutos

---

## 🎯 OPCIÓN 2: INICIO RÁPIDO (Si ya tienes todo instalado)

Si ya tienes Node.js, PostgreSQL y RabbitMQ instalados, puedes usar el script principal que detecta automáticamente qué está instalado:

```powershell
.\INICIAR_TODO.ps1
```

El script es inteligente y solo instala lo que falta.

---

## 🔧 OPCIÓN 3: INSTALACIÓN MANUAL PASO A PASO

### 📦 Paso 1: Instalar Node.js
1. **Descargar**: https://nodejs.org/
2. **Versión recomendada**: LTS (18.x o superior)
3. **Instalar** siguiendo el asistente
4. **Verificar instalación**:
   ```powershell
   node --version
   npm --version
   ```

### 🐘 Paso 2: Instalar PostgreSQL
1. **Descargar**: https://www.postgresql.org/download/windows/
2. **Versión recomendada**: 14.x o superior
3. **Durante la instalación**:
   - Usuario: `postgres`
   - Contraseña: `postgres` (anotar para después)
   - Puerto: `5432`
4. **Verificar instalación**:
   ```powershell
   psql --version
   ```

### 🐰 Paso 3: Instalar RabbitMQ
1. **Instalar Erlang primero**: https://www.erlang.org/downloads
2. **Descargar RabbitMQ**: https://www.rabbitmq.com/download.html
3. **Instalar** siguiendo el asistente
4. **Habilitar Management Plugin**:
   ```powershell
   rabbitmq-plugins enable rabbitmq_management
   ```
5. **Verificar**: http://localhost:15672 (guest/guest)

### 🗄️ Paso 4: Configurar Base de Datos
1. **Abrir PowerShell**
2. **Navegar al proyecto**:
   ```powershell
   cd ruta\shopcart\Backend
   ```
3. **Ejecutar script de DB**:
   ```powershell
   psql -U postgres -f setup-database.sql
   ```
   - Introducir contraseña: `postgres`

### 📦 Paso 5: Instalar Dependencias Backend
```powershell
# En la carpeta Backend
cd microservices\api-gateway
npm install

cd ..\user-service
npm install

cd ..\product-service
npm install

cd ..\cart-service
npm install

cd ..\payment-service
npm install

cd ..\category-service
npm install
```

### 📦 Paso 6: Instalar Dependencias Frontend
```powershell
cd ..\..\Frontend
npm install
```

### 🚀 Paso 7: Iniciar Servicios

#### 7.1 Iniciar Backend (6 terminales)
```powershell
# Terminal 1 - API Gateway
cd Backend\microservices\api-gateway
npm start

# Terminal 2 - User Service
cd Backend\microservices\user-service
npm start

# Terminal 3 - Product Service
cd Backend\microservices\product-service
npm start

# Terminal 4 - Cart Service
cd Backend\microservices\cart-service
npm start

# Terminal 5 - Payment Service
cd Backend\microservices\payment-service
npm start

# Terminal 6 - Category Service
cd Backend\microservices\category-service
npm start
```

#### 7.2 Iniciar Frontend
```powershell
# Terminal 7 - Frontend
cd Frontend
npm run dev
```

---

## 🔍 VERIFICACIÓN DEL SISTEMA

### Health Checks
- **API Gateway**: http://localhost:5000/api/health
- **User Service**: http://localhost:5001/api/users/health
- **Product Service**: http://localhost:5002/api/products/health
- **Cart Service**: http://localhost:5003/api/cart/health
- **Payment Service**: http://localhost:5004/api/payments/health
- **Category Service**: http://localhost:5005/api/categories/health

### Interfaces Web
- **Aplicación Principal**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

---

## 🚨 SOLUCIÓN DE PROBLEMAS COMUNES

### ❌ Error: "No se puede ejecutar scripts"
**Solución**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ Error: "Puerto 5432 ya está en uso"
**Solución**:
```powershell
# Detener PostgreSQL
net stop postgresql-x64-14

# Reiniciar
net start postgresql-x64-14
```

### ❌ Error: "ECONNREFUSED PostgreSQL"
**Solución**:
1. Verificar que PostgreSQL esté ejecutándose:
   ```powershell
   Get-Service postgresql*
   ```
2. Si no está ejecutándose:
   ```powershell
   Start-Service postgresql-x64-14
   ```

### ❌ Error: "RabbitMQ connection refused"
**Solución**:
```powershell
# Reiniciar RabbitMQ
net stop RabbitMQ
net start RabbitMQ
```

### ❌ Error: "Module not found"
**Solución**:
```powershell
# Limpiar cache npm
npm cache clean --force

# Reinstalar dependencias en cada servicio
cd Backend\microservices\[nombre-servicio]
rm -rf node_modules
npm install

# O usar el script principal que reinstala todo
.\INICIAR_TODO.ps1
```

---

## 📊 PUERTOS Y SERVICIOS

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend (Next.js) | 3000 | http://localhost:3000 |
| API Gateway | 5000 | http://localhost:5000 |
| User Service | 5001 | http://localhost:5001 |
| Product Service | 5002 | http://localhost:5002 |
| Cart Service | 5003 | http://localhost:5003 |
| Payment Service | 5004 | http://localhost:5004 |
| Category Service | 5005 | http://localhost:5005 |
| PostgreSQL | 5432 | localhost:5432 |
| RabbitMQ | 5672 | localhost:5672 |
| RabbitMQ Management | 15672 | http://localhost:15672 |

---

## 🔐 CREDENCIALES DEL SISTEMA

### PostgreSQL
- **Usuario**: `shopcart_user`
- **Contraseña**: `shopcart_password`
- **Base de datos**: `shopcart_db`

### RabbitMQ
- **Usuario**: `guest`
- **Contraseña**: `guest`

### Google OAuth (ya configurado en .env)
- Las credenciales OAuth están incluidas en el repositorio

---

## 🎯 FLUJO DE PRUEBA RÁPIDA

1. **Abrir**: http://localhost:3000
2. **Verificar** que carga la página principal
3. **Probar login** con Google OAuth
4. **Navegar** por las diferentes secciones
5. **Verificar APIs** en: http://localhost:5000/api/health

---

## 📞 AYUDA ADICIONAL

### Scripts Disponibles
```powershell
# Script principal - Instala y configura todo
.\INICIAR_TODO.ps1

# Iniciar solo los microservicios (backend)
.\Backend\start-microservices.ps1

# Iniciar frontend y backend por separado
.\start-servers.ps1
```

### Comandos Útiles de PowerShell
```powershell
# Verificar servicios de sistema
Get-Service postgresql*
Get-Service RabbitMQ

# Verificar puertos en uso
netstat -an | findstr :5432
netstat -an | findstr :5672

# Limpiar procesos Node.js
Get-Process node | Stop-Process -Force
```

---

## 📝 SCRIPTS DISPONIBLES EN EL PROYECTO

### Scripts Principales
- **`INICIAR_TODO.ps1`** - Script principal que instala y configura todo automáticamente
- **`start-servers.ps1`** - Script para iniciar frontend y backend por separado  
- **`Backend\start-microservices.ps1`** - Script para iniciar solo los microservicios

### ¿Cuál usar?
- **Primera vez o instalación completa**: `.\INICIAR_TODO.ps1`
- **Desarrollo diario**: `.\start-servers.ps1` 
- **Solo backend**: `.\Backend\start-microservices.ps1`

---

## 🆘 SI ALGO NO FUNCIONA

1. **Verificar que todos los puertos estén libres**
2. **Ejecutar como Administrador**
3. **Verificar conexión a Internet**
4. **Revisar logs en las terminales**
5. **Contactar al equipo de desarrollo**

---

## ✅ CHECKLIST FINAL

- [ ] Node.js instalado (npm --version)
- [ ] PostgreSQL ejecutándose (puerto 5432)
- [ ] RabbitMQ ejecutándose (puerto 5672)
- [ ] Todas las dependencias instaladas
- [ ] Base de datos configurada
- [ ] 6 microservicios ejecutándose (puertos 5000-5005)
- [ ] Frontend ejecutándose (puerto 3000)
- [ ] Página principal accesible
- [ ] Health checks respondiendo OK

---

🎉 **¡Si llegaste hasta aquí, el sistema debería estar funcionando perfectamente!**

Para cualquier duda o problema, revisar la documentación completa en `MICROSERVICES_ARCHITECTURE.md` o contactar al equipo de desarrollo.
