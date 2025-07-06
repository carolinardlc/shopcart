// User Service - Microservicio de gestión de usuarios con autenticación federada
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 5001;

// Configuración de base de datos
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'shopcart_db',
  user: process.env.DB_USER || 'shopcart_user',
  password: process.env.DB_PASSWORD || 'shopcart_password',
});

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'shopcart_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Cambiar a true en producción con HTTPS
}));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[User Service] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Configuración de Passport OAuth 2.0 (solo si las credenciales están configuradas)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL || "/api/users/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Buscar usuario existente por Google ID
      let userResult = await pool.query(
        'SELECT * FROM users WHERE google_id = $1',
        [profile.id]
      );
    
    if (userResult.rows.length > 0) {
      // Usuario existente
      return done(null, userResult.rows[0]);
    }
    
    // Crear nuevo usuario
    const newUser = await pool.query(
      `INSERT INTO users (name, email, google_id, provider, avatar_url) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        profile.displayName,
        profile.emails[0].value,
        profile.id,
        'google',
        profile.photos[0].value
      ]
    );
    
    // Enviar evento de usuario registrado
    await publishEvent('user.registered', {
      userId: newUser.rows[0].id,
      email: newUser.rows[0].email,
      name: newUser.rows[0].name,
      provider: 'google'
    });
    
    return done(null, newUser.rows[0]);
  } catch (error) {
    console.error('[User Service] Error en OAuth:', error);
    return done(error, null);
  }
}));

// Serialización de usuarios para sesiones
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});
} else {
  console.log('[User Service] OAuth no configurado - funcionando en modo desarrollo');
}

// Configuración de RabbitMQ para eventos
let rabbitConnection = null;
let rabbitChannel = null;

const connectRabbitMQ = async () => {
  try {
    rabbitConnection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
    rabbitChannel = await rabbitConnection.createChannel();
    await rabbitChannel.assertExchange('shopcart_events', 'topic', { durable: true });
    console.log('[User Service] Conectado a RabbitMQ');
  } catch (error) {
    console.error('[User Service] Error conectando a RabbitMQ:', error.message);
  }
};

const publishEvent = async (eventType, data) => {
  if (rabbitChannel) {
    try {
      const message = {
        eventType,
        timestamp: new Date().toISOString(),
        service: 'user-service',
        data
      };
      rabbitChannel.publish(
        'shopcart_events',
        eventType,
        Buffer.from(JSON.stringify(message))
      );
      console.log(`[User Service] Evento publicado: ${eventType}`);
    } catch (error) {
      console.error('[User Service] Error publicando evento:', error);
    }
  }
};

// Conectar a RabbitMQ al inicio
connectRabbitMQ();

// Health check
app.get('/api/users/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      service: 'User Service',
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      service: 'User Service',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Inicializar tablas de usuarios
const initializeTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(200) NOT NULL,
        password_hash VARCHAR(255),
        google_id VARCHAR(100) UNIQUE,
        provider VARCHAR(50) DEFAULT 'local',
        avatar_url VARCHAR(500),
        profile_picture VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        role VARCHAR(50) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(500) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Índices para mejorar rendimiento
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
      CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
    `);

    console.log('✅ [User Service] Tablas inicializadas correctamente');
  } catch (error) {
    console.error('❌ [User Service] Error inicializando tablas:', error.message);
  }
};

// Listar usuarios
app.get('/api/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT id, email, name, profile_picture, is_active, role, created_at FROM users';
    let params = [];
    
    if (role) {
      query += ' WHERE role = $1';
      params.push(role);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.rows.length
      }
    });
  } catch (error) {
    console.error('[User Service] Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener usuario por ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT id, email, name, profile_picture, is_active, role, created_at FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('[User Service] Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Crear usuario
app.post('/api/users', async (req, res) => {
  try {
    const { email, name, password_hash, google_id, profile_picture, role = 'customer' } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email y nombre son requeridos'
      });
    }
    
    const result = await pool.query(
      `INSERT INTO users (email, name, password_hash, google_id, profile_picture, role) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, name, profile_picture, is_active, role, created_at`,
      [email, name, password_hash, google_id, profile_picture, role]
    );
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Usuario creado exitosamente'
    });
  } catch (error) {
    console.error('[User Service] Error al crear usuario:', error);
    
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar usuario
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profile_picture, is_active, role } = req.body;
    
    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           profile_picture = COALESCE($2, profile_picture),
           is_active = COALESCE($3, is_active),
           role = COALESCE($4, role),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING id, email, name, profile_picture, is_active, role, updated_at`,
      [name, profile_picture, is_active, role, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Usuario actualizado exitosamente'
    });
  } catch (error) {
    console.error('[User Service] Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Eliminar usuario (soft delete)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Usuario desactivado exitosamente'
    });
  } catch (error) {
    console.error('[User Service] Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Autenticación por email
app.post('/api/users/auth/login', async (req, res) => {
  try {
    const { email, password_hash } = req.body;
    
    const result = await pool.query(
      'SELECT id, email, name, profile_picture, role FROM users WHERE email = $1 AND password_hash = $2 AND is_active = true',
      [email, password_hash]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Autenticación exitosa'
    });
  } catch (error) {
    console.error('[User Service] Error en autenticación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Autenticación por Google ID
app.post('/api/users/auth/google', async (req, res) => {
  try {
    const { google_id, email, name, profile_picture } = req.body;
    
    // Buscar usuario existente
    let result = await pool.query(
      'SELECT id, email, name, profile_picture, role FROM users WHERE google_id = $1 OR email = $2',
      [google_id, email]
    );
    
    if (result.rows.length === 0) {
      // Crear nuevo usuario
      result = await pool.query(
        `INSERT INTO users (email, name, google_id, profile_picture, role) 
         VALUES ($1, $2, $3, $4, 'customer') 
         RETURNING id, email, name, profile_picture, role`,
        [email, name, google_id, profile_picture]
      );
    } else {
      // Actualizar información de Google
      result = await pool.query(
        `UPDATE users 
         SET google_id = $1, profile_picture = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3 
         RETURNING id, email, name, profile_picture, role`,
        [google_id, profile_picture, result.rows[0].id]
      );
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Autenticación con Google exitosa'
    });
  } catch (error) {
    console.error('[User Service] Error en autenticación Google:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ========== RUTAS DE AUTENTICACIÓN OAUTH 2.0 ==========

// Ruta para iniciar autenticación con Google
app.get('/api/users/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback de Google OAuth
app.get('/api/users/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    // Autenticación exitosa
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET || 'shopcart_jwt_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    // Redirigir al frontend con el token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/success?token=${token}`);
  }
);

// Ruta de fallo de autenticación
app.get('/auth/failure', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/failure`);
});

// Logout
app.post('/api/users/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    }
    req.session.destroy();
    res.json({ success: true, message: 'Sesión cerrada exitosamente' });
  });
});

// Verificar estado de autenticación
app.get('/api/users/auth/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      authenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar_url,
        provider: req.user.provider
      }
    });
  } else {
    res.json({
      success: true,
      authenticated: false,
      user: null
    });
  }
});

// ========== FIN RUTAS OAUTH ==========

// ========== ENDPOINTS PARA DESARROLLO ==========

// Endpoint para generar token JWT para desarrollo/testing
app.post('/api/users/auth/dev-login', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requerido'
      });
    }

    // Buscar usuario por email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const user = userResult.rows[0];

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET || 'shopcart_jwt_secret_key_2025',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Token generado exitosamente',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('[User Service] Error generando token dev:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Endpoint para registro rápido de desarrollo
app.post('/api/users/auth/dev-register', async (req, res) => {
  try {
    const { email, name, role = 'customer' } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email y nombre requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Usuario ya existe'
      });
    }

    // Crear nuevo usuario
    const newUser = await pool.query(
      `INSERT INTO users (email, name, provider, role) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [email, name, 'development', role]
    );

    const user = newUser.rows[0];

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET || 'shopcart_jwt_secret_key_2025',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('[User Service] Error registrando usuario dev:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('[User Service] Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servicio de usuarios'
  });
});

// Inicializar y arrancar servidor
const startServer = async () => {
  try {
    await initializeTables();
    
    app.listen(PORT, () => {
      console.log(`🚀 [User Service] Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📚 [User Service] Endpoints disponibles:`);
      console.log(`   - GET /api/users - Listar usuarios`);
      console.log(`   - GET /api/users/:id - Obtener usuario`);
      console.log(`   - POST /api/users - Crear usuario`);
      console.log(`   - PUT /api/users/:id - Actualizar usuario`);
      console.log(`   - DELETE /api/users/:id - Eliminar usuario`);
      console.log(`   - POST /api/users/auth/login - Login email/password`);
      console.log(`   - POST /api/users/auth/google - Login Google OAuth`);
    });
  } catch (error) {
    console.error('❌ [User Service] Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();
