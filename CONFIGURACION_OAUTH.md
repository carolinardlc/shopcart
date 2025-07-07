# 🔐 Configuración de OAuth Google para ShopCart

## ⚠️ IMPORTANTE: Seguridad de Credenciales

**NUNCA commitees las credenciales reales de OAuth en el repositorio.** Este proyecto incluye archivos `.env.example` con valores de placeholder que debes reemplazar con tus credenciales reales.

## 📋 Pasos para Configurar OAuth Google

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API** y **Google OAuth2 API**

### 2. Crear Credenciales OAuth 2.0

1. Ve a **Credenciales** en el menú lateral
2. Clic en **+ CREAR CREDENCIALES** > **ID de cliente de OAuth 2.0**
3. Selecciona **Aplicación web**
4. Configura los siguientes campos:

**Orígenes de JavaScript autorizados:**
```
http://localhost:3000
http://localhost:5000
http://localhost:5001
```

**URIs de redirección autorizados:**
```
http://localhost:5001/api/users/auth/google/callback
```

### 3. Configurar Variables de Entorno

Una vez que tengas tu **Client ID** y **Client Secret**:

#### Backend Principal (`Backend/.env`)
```bash
# Copia Backend/.env.example a Backend/.env
cp Backend/.env.example Backend/.env

# Edita y reemplaza:
GOOGLE_CLIENT_ID=tu_client_id_real_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_real_aqui
```

#### API Gateway (`Backend/microservices/api-gateway/.env`)
```bash
# Copia el archivo de ejemplo
cp Backend/microservices/api-gateway/.env.example Backend/microservices/api-gateway/.env

# Edita y reemplaza:
GOOGLE_CLIENT_ID=tu_client_id_real_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_real_aqui
```

#### Frontend (`Frontend/.env.local`)
```bash
# Copia el archivo de ejemplo
cp Frontend/.env.local.example Frontend/.env.local

# Edita y reemplaza:
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu_client_id_real_aqui
```

### 4. Verificar Configuración

Ejecuta el script de verificación:
```bash
powershell -ExecutionPolicy Bypass -File verify-oauth.ps1
```

## 🔒 Seguridad

- ✅ Los archivos `.env` están en `.gitignore`
- ✅ Solo se commitean archivos `.env.example` 
- ✅ Las credenciales reales permanecen locales
- ✅ GitHub no detectará secretos en el repositorio

## 🚀 Después de Configurar

1. Ejecuta `INICIAR_TODO.ps1` como administrador
2. El sistema detectará automáticamente si OAuth está configurado
3. Si no está configurado, funcionará en "modo desarrollo"

## 📞 Soporte

Si tienes problemas con la configuración OAuth:
1. Verifica que las URLs de callback coincidan exactamente
2. Asegúrate de que las APIs estén habilitadas en Google Cloud
3. Revisa que no haya espacios extra en las credenciales
4. Usa el script `verify-oauth.ps1` para diagnóstico
