# 🚀 ShopCart - Configuración Sin Secretos

## ⚡ **Sistema Listo para Usar**

Este repositorio está configurado para que funcione **inmediatamente** sin credenciales OAuth reales. Perfecto para desarrollo, pruebas y demostraciones.

## 🎯 **Inicio Súper Rápido (30 segundos)**

```powershell
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/shopcart.git
cd shopcart

# 2. Ejecutar script principal (como Administrador)
.\INICIAR_TODO.ps1

# ¡Listo! El sistema estará funcionando en http://localhost:3000
```

## 🔧 **¿Cómo funciona sin OAuth real?**

### ✅ **Modo Desarrollo Automático**
- El sistema detecta automáticamente si OAuth está configurado
- Si no hay credenciales reales, funciona en "modo desarrollo"
- Todas las funcionalidades están disponibles excepto login con Google real

### ✅ **Archivos .env.example**
Los archivos incluyen:
- 🗄️ **PostgreSQL** preconfigurado
- 🔗 **URLs de microservicios** correctas
- 🔑 **JWT secrets** seguros para desarrollo
- 🐰 **RabbitMQ** configurado
- 📝 **Placeholders** para OAuth (sin credenciales reales)

### ✅ **Configuración Automática**
El script `INICIAR_TODO.ps1`:
1. Copia automáticamente `.env.example` → `.env`
2. Instala PostgreSQL 17, RabbitMQ, pgAdmin4
3. Configura base de datos con datos de ejemplo
4. Inicia todos los microservicios
5. Abre el sistema en el navegador

## 🔐 **Para OAuth Real (Opcional)**

Si quieres autenticación Google real:

### 1. Obtener Credenciales OAuth
- Ir a [Google Cloud Console](https://console.cloud.google.com/)
- Crear proyecto → APIs & Servicios → Credenciales
- Crear "OAuth 2.0 Client ID"
- Configurar URLs autorizadas:
  - `http://localhost:3000`
  - `http://localhost:5001/api/users/auth/google/callback`

### 2. Configurar Archivos .env
```bash
# En Backend/.env
GOOGLE_CLIENT_ID=tu_client_id_real
GOOGLE_CLIENT_SECRET=tu_client_secret_real

# En Backend/microservices/api-gateway/.env
GOOGLE_CLIENT_ID=tu_client_id_real
GOOGLE_CLIENT_SECRET=tu_client_secret_real

# En Frontend/.env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_client_id_real
```

### 3. Reiniciar Sistema
```powershell
.\start-servers.ps1
```

## 🎯 **URLs del Sistema**

Después de ejecutar `INICIAR_TODO.ps1`:
- 🌐 **Frontend:** http://localhost:3000
- 🚪 **API Gateway:** http://localhost:5000
- 📊 **Health Check:** http://localhost:5000/api/health
- 🗄️ **pgAdmin4:** Se abre automáticamente

## 🔒 **Seguridad**

### ✅ **Repositorio Limpio**
- ❌ **Sin credenciales reales** en el código
- ✅ **Archivos .env** ignorados por Git
- ✅ **Solo archivos .example** en el repositorio
- ✅ **GitHub no detecta secretos**

### ✅ **Desarrollo Seguro**
- 🔐 **Credenciales locales** nunca se suben
- 📝 **Documentación clara** sin exponer secretos
- 🛡️ **Archivos .example** como plantillas seguras

## 🆘 **Solución de Problemas**

### Sistema no inicia:
```powershell
# Verificar estado
.\INICIAR_TODO.ps1

# Revisar health check
curl http://localhost:5000/api/health
```

### OAuth no funciona:
- ✅ **Normal en modo desarrollo**
- ✅ **Todas las demás funciones disponibles**
- ✅ **Para OAuth real, seguir pasos de configuración arriba**

---

**¡Con esta configuración, cualquier persona puede ejecutar ShopCart sin configurar credenciales!** 🚀🔐
