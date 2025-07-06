// scripts/db-admin.js
require('dotenv').config();
const { testConnection, closePool } = require('../database/connection');
const { createTables, insertSampleData, dropTables } = require('../database/schema');

const commands = {
  test: async () => {
    console.log('🔍 Probando conexión a la base de datos...');
    const connected = await testConnection();
    if (connected) {
      console.log('✅ Conexión exitosa');
    } else {
      console.log('❌ Error en la conexión');
    }
  },
  
  setup: async () => {
    console.log('🏗️ Configurando base de datos...');
    await commands.test();
    await createTables();
    await insertSampleData();
    console.log('✅ Base de datos configurada completamente');
  },
  
  reset: async () => {
    console.log('🔄 Reiniciando base de datos...');
    await commands.test();
    await dropTables();
    await createTables();
    await insertSampleData();
    console.log('✅ Base de datos reiniciada completamente');
  },
  
  drop: async () => {
    console.log('🗑️ Eliminando todas las tablas...');
    await commands.test();
    await dropTables();
    console.log('✅ Tablas eliminadas');
  },
  
  seed: async () => {
    console.log('🌱 Insertando datos de ejemplo...');
    await commands.test();
    await insertSampleData();
    console.log('✅ Datos de ejemplo insertados');
  }
};

const showHelp = () => {
  console.log(`
📚 Administrador de Base de Datos - ShopCart

Uso: node scripts/db-admin.js <comando>

Comandos disponibles:
  test    - Probar conexión a la base de datos
  setup   - Configurar base de datos por primera vez (crear tablas + datos)
  reset   - Reiniciar base de datos (eliminar y recrear todo)
  drop    - Eliminar todas las tablas
  seed    - Insertar datos de ejemplo
  help    - Mostrar esta ayuda

Ejemplos:
  node scripts/db-admin.js test
  node scripts/db-admin.js setup
  node scripts/db-admin.js reset
  `);
};

const main = async () => {
  const command = process.argv[2];
  
  if (!command || command === 'help') {
    showHelp();
    return;
  }
  
  if (!commands[command]) {
    console.error(`❌ Comando desconocido: ${command}`);
    showHelp();
    process.exit(1);
  }
  
  try {
    await commands[command]();
  } catch (error) {
    console.error(`❌ Error ejecutando comando '${command}':`, error.message);
    process.exit(1);
  } finally {
    await closePool();
    process.exit(0);
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { commands };
