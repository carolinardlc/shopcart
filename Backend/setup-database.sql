-- Configuración inicial de PostgreSQL para ShopCart
-- Ejecutar este script como usuario postgres

-- Crear el usuario para la aplicación
CREATE USER shopcart_user WITH PASSWORD 'shopcart_password';

-- Crear la base de datos
CREATE DATABASE shopcart_db WITH OWNER shopcart_user;

-- Dar permisos completos al usuario sobre su base de datos
GRANT ALL PRIVILEGES ON DATABASE shopcart_db TO shopcart_user;

-- Conectar a la nueva base de datos y dar permisos sobre el esquema
\c shopcart_db;

GRANT ALL PRIVILEGES ON SCHEMA public TO shopcart_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO shopcart_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO shopcart_user;

-- Dar permisos para crear tablas
ALTER USER shopcart_user CREATEDB;

-- Mostrar información de la configuración
SELECT 'Usuario creado: shopcart_user' AS status;
SELECT 'Base de datos creada: shopcart_db' AS status;
SELECT 'Configuración completada exitosamente!' AS status;
